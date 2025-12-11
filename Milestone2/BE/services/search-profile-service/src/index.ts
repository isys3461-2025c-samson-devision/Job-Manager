import express from "express";
import dotenv from 'dotenv';
import profileRoutes from "./router";

const app = express();
app.use(express.json());

dotenv.config();
const PORT = process.env.PORT || 3009;

// Routes
app.use("/api/search-profile", profileRoutes);

app.listen(PORT, () => {
 console.log(`Search Profile service running on port ${PORT}`);
});

export default app;
