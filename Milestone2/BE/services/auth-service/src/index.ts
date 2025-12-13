import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './router';


//load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

//middlewares
app.use(cors());
app.use(helmet());

app.use('/auth', authRoutes);


app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`Auth Service is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Database URL: ${process.env.DATABASE_URL}`);
    console.log(`JWT Secret: ${process.env.JWT_SECRET}`);
    console.log(`Health check:http://localhost:${PORT}/health`);
});

export default app;