import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import chatRoutes from './routes/chatRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', chatRoutes);
app.get('/',(req,res)=>{
    res.send("Checksout");
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})