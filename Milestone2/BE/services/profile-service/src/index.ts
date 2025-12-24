import express from "express";
import dotenv from 'dotenv';
import cors from "cors";
import profileRoutes from "./router";

const app = express();
app.use(express.json());

dotenv.config();
const PORT = process.env.PORT || 3002;

const corsOptions: cors.CorsOptions = {
	origin: ["http://localhost:5173"],
	credentials: true,
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Handle preflight requests (Express 5 doesn't accept "*")
app.options(/.*/, cors(corsOptions));

// Routes
app.use("/api/profile", profileRoutes);

app.listen(PORT, () => {
 console.log(`Profile service running on port ${PORT}`);
});

export default app;
