import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const SubmissionSchema = new Schema({
      userId: Number,
      title: String,
      body: String,
      language: String,
      result: String,
});

export const Submission = mongoose.model('Submission', SubmissionSchema);