let complaints = [];
let complaintIdCounter = 1;

export const getAllComplaints = (req, res) => {
  res.status(200).json({
    success: true,
    data: complaints,
    total: complaints.length,
  });
};

export const createComplaint = (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: "Title and description are required",
    });
  }

  const newComplaint = {
    id: complaintIdCounter++,
    title,
    description,
    status: "open",
  };

  complaints.push(newComplaint);

  res.status(201).json({
    success: true,
    message: "Complaint created successfully",
    data: newComplaint,
  });
};

export const resolveComplaint = (req, res) => {
  const { id } = req.params;
  const complaintId = parseInt(id);

  const complaint = complaints.find((c) => c.id === complaintId);

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: "Complaint not found",
    });
  }

  complaint.status = "resolved";

  res.status(200).json({
    success: true,
    message: "Complaint resolved successfully",
    data: complaint,
  });
};

export const deleteComplaint = (req, res) => {
  const { id } = req.params;
  const complaintId = parseInt(id);

  const index = complaints.findIndex((c) => c.id === complaintId);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Complaint not found",
    });
  }

  const deletedComplaint = complaints.splice(index, 1);

  res.status(200).json({
    success: true,
    message: "Complaint deleted successfully",
    data: deletedComplaint[0],
  });
};
