import { Request, Response, NextFunction } from 'express';
import { generateFile } from '../generateFile';
import { Submission } from '../models/submission';
import { addSubmissionToQueue } from '../submitQueue';

const addSubmission = async (req: Request, res: Response, next: NextFunction) => {
      const { language, code } = req.body;

      if (code === undefined) {
            return res.status(400).json({
                  success: false,
                  error: "Empty code body!"
            });
      }

      const filePath = await generateFile(language, code);
      const submission = await new Submission({ language, filePath }).save();
      const submissionId = submission["_id"];
      addSubmissionToQueue(submissionId);
      res.status(201).json({ submissionId });
}

const getStatusSubmission = async (req: Request, res: Response, next: NextFunction) => {
      const submissionId = req.query.id;

      if (submissionId === undefined) {
            return res.status(400).json({ success: false, error: "missing id query param" });
      }

      const submission = await Submission.findById(submissionId);

      if (submission === undefined) {
            return res.status(400).json({ success: false, error: "couldn't find submission" });
      }

      return res.status(200).json({ success: true, submission });
}

export default { addSubmission, getStatusSubmission };