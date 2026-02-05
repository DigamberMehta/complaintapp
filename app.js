import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import loggerMiddleware from "./middleware/logger.middleware.js";
import complaintRoutes from "./routes/complaint.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(loggerMiddleware);

app.use("/complaints", complaintRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;
