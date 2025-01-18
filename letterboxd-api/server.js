import express from 'express'
import dotenv from 'dotenv'
dotenv.config();
const PORT = process.env.PORT || 5000
import userRoutes from './routes/userRoutes.js';
import tmdbRoutes from './routes/tmdbRoutes.js';
import profileRoutes from './routes/profileRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import connectDB from './config/db.js';

connectDB()

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(cors());

app.use(cookieParser())

app.use('/api/users', userRoutes);
app.use('/api/tmdb', tmdbRoutes);
app.use('/api/profile', profileRoutes);

app.get('/', (req, res) => {
    res.send('Server is ready')
})

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})