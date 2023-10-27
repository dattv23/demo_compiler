import { Request, Response, NextFunction } from 'express';
import { generateFile } from '../generateFile';
import { excuteCpp } from '../executes/executeCpp';

const addSubmission = async (req: Request, res: Response, next: NextFunction) => {
      // get the data from req.body
      const { language, code } = req.body;

      if (code === undefined) {
            return res.status(400).json({
                  success: false,
                  error: "Empty code body!"
            });
      }

      const filePath = await generateFile(language, code);
      try {
            const output = await excuteCpp(filePath);
            return res.json({ filePath, output });
      } catch (error) {
            res.status(500).json({ filePath, error });
      }
}

export default { addSubmission };