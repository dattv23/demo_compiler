import express from 'express';
import controller from '../controllers/submission';
const router = express.Router();

router.get('/submissions', controller.getSubmissions);
router.get('/submissions/:id', controller.getSubmission);
router.post('/submissions', controller.addSubmission);

export = router;