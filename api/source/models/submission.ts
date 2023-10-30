import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const SubmissionSchema = new Schema({
      language: {
            type: String,
            require: true,
            enum: ["c", "cpp", "java", "javascript", "python"]
      },
      filePath: {
            type: String,
            require: true
      },
      submittedAt: {
            type: Date
      },
      startedAt: {
            type: Date
      },
      completedAt: {
            type: Date
      },
      input: {
            type: []
      },
      output: {
            type: []
      },
      status: {
            type: String,
            default: "pending",
            enum: ["pending", "success", "error"]
      }
});

export const Submission = mongoose.model('Submission', SubmissionSchema);