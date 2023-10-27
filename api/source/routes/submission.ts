import express from 'express';
import controller from '../controllers/submission';
const router = express.Router();

router.post('/submissions', controller.addSubmission);

export = router;