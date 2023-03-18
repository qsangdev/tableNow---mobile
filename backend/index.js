import  express  from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import posts from './routers/posts'
import mongoose from 'mongoose';


const app = express();
const PORT = process.env.port || 5000;

const URI = 'mongodb+srv://mindx:<password>@mindxweb62.nwptbpv.mongodb.net/?retryWrites=true&w=majority'

app.use(bodyParser.json({limit: '30mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '30mb'}));
app.use(cors());

app.use('/posts', posts);



app.listen(PORT, () => {
    console.log(`Sever is running on port ${PORT}`)
})
