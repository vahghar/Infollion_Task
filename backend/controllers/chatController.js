import { model, extractText, fileToGenerativePart } from '../services/geminiService.js';

const chatSessions = {};

const handleFileUpload = async (req, res) => {
    try {
        const { chatId } = req.body;
        const file = req.file;

        if (!chatId || !file) return res.status(400).json({ error: "Missing chatId or file" });

        if (!chatSessions[chatId]) {
            chatSessions[chatId] = {
                history: [], docContext: "", imageData: null
            };
        }

        if (file.mimetype === 'application/pdf' || file.mimetype === 'text/plain') {
            const text = await extractText(file);
            chatSessions[chatId].docContext = text;
            res.json({ message: "Document processed." });
        } else if (file.mimetype.startsWith('image/')) {
            const imagePart = fileToGenerativePart(file.buffer, file.mimetype);
            chatSessions[chatId].imageData = imagePart;
            res.json({ message: "Image uploaded." });
        } else {
            res.status(400).json({ error: "Unsupported file type" });
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const handleChat = async (req, res) => {
    try {
        const { chatId, message } = req.body;
        if (!chatId || !message) {
            return res.status(400).json({ error: "Missing chatId or message" });
        }
        if (!chatSessions[chatId]) {
            chatSessions[chatId] = {
                history: [], docContext: "", imageData: null
            };
        }
        const session = chatSessions[chatId];
        let parts = [];

        let userMessage = message;
        if (session.docContext) {
            const contextSnippet = session.docContext.slice(0, 30000);
            userMessage = `Context:\n${contextSnippet}\n\nQuestion: ${message}`;
        }
        parts.push({ text: userMessage });
        if (session.imageData) parts.push(session.imageData);

        const chat = model.startChat({ history: session.history });
        const result = await chat.sendMessage(parts);
        const response = await result.response;
        const botText = response.text();

        session.history.push({ role: "user", parts: parts });
        session.history.push({ role: "model", parts: [{ text: botText }] });

        res.json({ response: botText });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const restChat = (req,res) => {
    const {chatId} = req.body;
    if(chatId && chatSessions[chatId]) delete chatSessions[chatId];
    res.json({message: "Chat reset successfully"})
}

export {handleFileUpload, handleChat, restChat};