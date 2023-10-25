import { Request, Response, NextFunction } from 'express';
import { c, cpp, node, python, java, Result } from 'compile-run'
import { Submission } from '../models/submission';

interface Submission {
      userId: Number;
      id: String;
      title: String;
      body: String;
      language: String;
      result: String
}

// getting all submissions
const getSubmissions = async (req: Request, res: Response, next: NextFunction) => {
      try {
            // get some Submissions
            let result: Submission[] = await Submission.find();
            return res.status(200).json(result);
      } catch (error) {
            console.error(error);
            return res.status(500).json({
                  message: 'Internal Server Error',
            });
      }
};

// getting a single Submission
const getSubmission = async (req: Request, res: Response, next: NextFunction) => {
      // Get the submission id from the request parameters
      const id: string = req.params.id;

      try {
            // Replace this with the appropriate method to fetch a single submission from your data source (e.g., a database query)
            let submission: Submission | null = await Submission.findOne({ id: parseInt(id) });

            if (!submission) {
                  return res.status(404).json({
                        message: 'Submission not found',
                  });
            }

            return res.status(200).json({
                  message: submission,
            });
      } catch (error) {
            console.error(error);
            return res.status(500).json({
                  message: 'Internal Server Error',
            });
      }
};

const idRandom = (length: number): string => {
      // Generate a random number with the desired number of digits
      const min = Math.pow(10, length - 1);
      const max = Math.pow(10, length) - 1;
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

      // Convert the random number to a string
      const randomNumberString = randomNumber.toString();

      // Ensure the string has the desired length by adding leading zeros if needed
      const leadingZeros = '0'.repeat(length - randomNumberString.length);

      return leadingZeros + randomNumberString;
}

// adding a Submission
const addSubmission = async (req: Request, res: Response, next: NextFunction) => {
      // get the data from req.body
      let userId: number = req.body.userId;
      let title: string = req.body.title;
      let body: string = req.body.body;
      let language: string = req.body.language;

      if (!userId || !title || !body) {
            return res.status(400).json({
                  message: 'Missing required fields',
            });
      }

      let resultPromise: Promise<Result>;

      switch (language) {
            case "c":
                  resultPromise = c.runSource(body);
                  break;
            case "cpp":
                  resultPromise = cpp.runSource(body);
                  break;
            case "node":
                  resultPromise = node.runSource(body);
                  break;
            case "java":
                  resultPromise = java.runSource(body);
                  break;
            case "python":
                  resultPromise = python.runSource(body);
                  break;
            default:
                  // Handle unsupported languages
                  return res.status(400).json({
                        message: 'Unsupported language',
                  });
      }

      try {
            const result = await resultPromise;
            const submission = new Submission({
                  id: idRandom(8),
                  userId,
                  title,
                  body,
                  language,
                  result: JSON.stringify(result), // Assuming 'result' is the field to store the result
            });

            await submission.save();

            console.log(result);

            res.status(200).json({
                  message: 'Submission saved successfully',
                  result: result,
            });
      } catch (err) {
            console.error(err);
            return res.status(500).json({
                  message: 'Internal server error',
            });
      }
}

export default { getSubmissions, getSubmission, addSubmission };