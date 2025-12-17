import express from 'express';
import multer from 'multer';
import { handleFileUpload, handleChat, restChat } from '../controllers/chatController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), handleFileUpload);
router.post('/chat', handleChat);
router.post('/reset', restChat);

export default router;