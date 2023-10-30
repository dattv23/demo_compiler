import { Request, Response, NextFunction } from 'express';
import { generateFile } from '../generateFile';
import { Submission } from '../models/submission';
import { executeCpp } from '../executes/executeCpp';
import { executeJava } from '../executes/executeJava';
import { executeJS } from '../executes/executeJS';
import { executePython } from '../executes/executePython';
import { ObjectId } from 'mongodb';

const addSubmission = async (req: Request, res: Response, next: NextFunction) => {
      const { language, code, input } = req.body;
      if (code === undefined) {
            return res.status(400).json({
                  success: false,
                  error: "Empty code body!"
            });
      }

      let submission: any;
      try {
            const filePath = await generateFile(language, code);
            submission = await new Submission({ language, filePath }).save();
            const submissionId = submission["_id"];
            res.status(201).json({ submissionId });

            let output;

            submission["startedAt"] = new Date();
            switch (language) {
                  case "c":
                  case "cpp":
                        output = await executeCpp(filePath, input);
                        break;
                  case "java":
                        output = await executeJava(filePath, input);
                        break;
                  case "javascript":
                        output = await executeJS(filePath, input);
                        break;
                  case "python":
                        output = await executePython(filePath, input);
                        break;
                  default:
                        break;
            }

            submission["completedAt"] = new Date();
            submission["status"] = "success";
            submission["output"] = output as string[];
            await submission.save();
            // return res.status(200).json({ success: true, output });
      } catch (error) {
            submission["completedAt"] = new Date();
            submission["status"] = "error";
            submission["output"] = JSON.stringify(error);
            await submission.save();
            //return res.status(500).json({ success: false, error: error });
      }
};

const getStatusSubmission = async (req: Request, res: Response, next: NextFunction) => {
      try {
            const submissionId = req.query.id;

            if (!submissionId) {
                  return res.status(400).json({ success: false, error: "missing id query param" });
            }

            const submission = await Submission.findById(submissionId);

            if (!submission) {
                  return res.status(400).json({ success: false, error: "couldn't find submission" });
            }

            return res.status(200).json({ success: true, submission });
      } catch (error) {
            return res.status(500).json({ success: false, error: error });
      }
};

export default { addSubmission, getStatusSubmission };
