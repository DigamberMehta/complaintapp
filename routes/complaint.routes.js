import express from "express";
import {
  getAllComplaints,
  getComplaintById,
  createComplaint,
  updateComplaintStatus,
  deleteComplaint,
} from "../controllers/complaint.controller.js";

const router = express.Router();

router.get("/", getAllComplaints);
router.get("/:id", getComplaintById);
router.post("/", createComplaint);
router.put("/:id", updateComplaintStatus);
router.delete("/:id", deleteComplaint);

export default router;
