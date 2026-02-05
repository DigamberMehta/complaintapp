import express from "express";
import loggerMiddleware from "./middleware/logger.middleware.js";
import complaintRoutes from "./routes/complaint.routes.js";

const app = express();

app.use(express.json());
app.use(loggerMiddleware);

app.use("/complaints", complaintRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;
