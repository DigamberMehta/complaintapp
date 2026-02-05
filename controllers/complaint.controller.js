let complaints = [];
let complaintIdCounter = 1;

export const getAllComplaints = (req, res) => {
  res.status(200).json({
    success: true,
    data: complaints,
    total: complaints.length,
  });
};

export const getComplaintById = (req, res) => {
  const { id } = req.params;
  const complaintId = parseInt(id);

  const complaint = complaints.find((c) => c.id === complaintId);

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: "Complaint not found",
    });
  }

  res.status(200).json({
    success: true,
    data: complaint,
  });
};

export const createComplaint = (req, res) => {
  const { title, description, name, email } = req.body;

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
    name: name || "Anonymous",
    email: email || "",
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  complaints.push(newComplaint);

  res.status(201).json({
    success: true,
    message: "Complaint created successfully",
    data: newComplaint,
  });
};

export const updateComplaintStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const complaintId = parseInt(id);

  const validStatuses = ["pending", "resolved", "rejected"];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status. Must be: pending, resolved, or rejected",
    });
  }

  const complaint = complaints.find((c) => c.id === complaintId);

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: "Complaint not found",
    });
  }

  complaint.status = status;
  complaint.updatedAt = new Date().toISOString();

  res.status(200).json({
    success: true,
    message: `Complaint status updated to ${status}`,
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
