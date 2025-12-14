import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './router';
import { errorHandler } from '../../../shared/middleware';


//load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

//middlewares
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || true, // set FE origin in env for production
    credentials: true,
}));
app.use(helmet());

app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/auth', authRoutes);


// app.use(express.json({limit: "10mb"}));
// app.use(express.urlencoded({ extended: true }));


//Error handling middleware
app.use(errorHandler)


app.listen(PORT, () => {
    console.log(`Auth Service is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Database URL: ${process.env.DATABASE_URL}`);
    console.log(`JWT Secret: ${process.env.JWT_SECRET}`);
    console.log(`Health check:http://localhost:${PORT}/health`);
});

export default app;