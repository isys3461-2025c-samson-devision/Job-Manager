import express from "express";
import dotenv from 'dotenv';
import profileRoutes from "./router";

const app = express();
app.use(express.json());

dotenv.config();
const PORT = process.env.PORT || 3002;

// Routes
app.use("/api/profile", profileRoutes);

app.listen(PORT, () => {
 console.log(`Profile service running on port ${PORT}`);
});

export default app;
