import express from 'express';
import controller from '../controllers/submission';
const router = express.Router();

router.get('/statusSubmissions', controller.getStatusSubmission);
router.post('/submissions', controller.addSubmission);

export = router;