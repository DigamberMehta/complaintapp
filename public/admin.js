let allComplaints = [];
let complaintToDelete = null;
let autoRefreshInterval = null;

// Hardcoded admin passcode
const ADMIN_PASSCODE = "2000";
const AUTO_REFRESH_TIME = 10000; // 10 seconds

document.addEventListener("DOMContentLoaded", () => {
  setupLoginModal();
});

// Setup login modal
function setupLoginModal() {
  const loginModal = document.getElementById("loginModal");
  const adminContent = document.getElementById("adminContent");
  const loginBtn = document.getElementById("loginBtn");
  const passcodeInput = document.getElementById("adminPasscode");
  const loginError = document.getElementById("loginError");

  // Show login modal initially
  loginModal.style.display = "flex";
  adminContent.style.display = "none";

  // Handle login button click
  loginBtn.addEventListener("click", verifyPasscode);

  // Handle Enter key in passcode input
  passcodeInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      verifyPasscode();
    }
  });

  function verifyPasscode() {
    const enteredPasscode = passcodeInput.value.trim();

    if (enteredPasscode === ADMIN_PASSCODE) {
      // Correct passcode, show admin content
      loginModal.style.display = "none";
      adminContent.style.display = "block";
      loginError.style.display = "none";

      // Load complaints after successful login
      loadComplaints();
      setupAdminPanel();
    } else {
      // Incorrect passcode, show error
      loginError.style.display = "block";
      passcodeInput.value = "";
      passcodeInput.focus();
    }
  }
}

function setupAdminPanel() {
  document
    .getElementById("refreshBtn")
    .addEventListener("click", loadComplaints);
  document
    .getElementById("statusFilter")
    .addEventListener("change", filterComplaints);
  document
    .getElementById("categoryFilter")
    .addEventListener("change", filterComplaints);
  document
    .getElementById("cancelDelete")
    .addEventListener("click", closeDeleteModal);
  document
    .getElementById("confirmDelete")
    .addEventListener("click", confirmDeleteComplaint);

  // Start auto-refresh every 10 seconds
  startAutoRefresh();
}

function startAutoRefresh() {
  // Clear any existing interval
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval);
  }

  // Set up new interval for auto-refresh
  autoRefreshInterval = setInterval(() => {
    loadComplaints();
  }, AUTO_REFRESH_TIME);
}

async function loadComplaints() {
  try {
    const response = await fetch("/complaints");
    const result = await response.json();

    if (result.success) {
      allComplaints = result.data;
      updateStats();
      displayComplaints(allComplaints);
      updateRefreshInfo();
    }
  } catch (error) {
    showError("Failed to load complaints");
  }
}

function updateRefreshInfo() {
  const autoRefreshInfo = document.getElementById("autoRefreshInfo");
  const lastRefreshTime = document.getElementById("lastRefreshTime");

  if (autoRefreshInfo) {
    autoRefreshInfo.style.display = "flex";
    lastRefreshTime.textContent = new Date().toLocaleTimeString();
  }
}

function updateStats() {
  const pending = allComplaints.filter((c) => c.status === "pending").length;
  const resolved = allComplaints.filter((c) => c.status === "resolved").length;
  const rejected = allComplaints.filter((c) => c.status === "rejected").length;

  document.getElementById("pendingCount").textContent = pending;
  document.getElementById("resolvedCount").textContent = resolved;
  document.getElementById("rejectedCount").textContent = rejected;
  document.getElementById("totalCount").textContent = allComplaints.length;
}

function filterComplaints() {
  const statusFilter = document.getElementById("statusFilter").value;
  const categoryFilter = document.getElementById("categoryFilter").value;

  let filtered =
    statusFilter === "all"
      ? allComplaints
      : allComplaints.filter((c) => c.status === statusFilter);

  if (categoryFilter !== "all") {
    filtered = filtered.filter((c) => c.category === categoryFilter);
  }

  displayComplaints(filtered);
}

function displayComplaints(complaints) {
  const container = document.getElementById("complaintsContainer");
  const emptyState = document.getElementById("emptyState");

  if (complaints.length === 0) {
    container.innerHTML = "";
    emptyState.style.display = "flex";
    return;
  }

  emptyState.style.display = "none";
  container.innerHTML = complaints
    .map(
      (complaint) => `
                <div class="complaint-card" data-id="${complaint.id}">
                    <div class="complaint-header">
                        <div class="complaint-id-section">
                            <span class="complaint-id-label">ID:</span>
                            <span class="complaint-id-value">#${complaint.id}</span>
                        </div>
                        <div class="header-badges">
                            <span class="badge badge-${complaint.category || "other"}">${complaint.category || "other"}</span>
                            <span class="badge badge-${complaint.status}">${complaint.status}</span>
                        </div>
                    </div>
                    
                    <h3 class="complaint-title">${escapeHtml(complaint.title)}</h3>
                    <p class="complaint-description">${escapeHtml(complaint.description)}</p>
                    
                    <div class="complaint-meta">
                        <div class="meta-item">
                            <span class="meta-label">Room:</span>
                            <span>${escapeHtml(complaint.roomNumber || "N/A")}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Name:</span>
                            <span>${escapeHtml(complaint.name || "Anonymous")}</span>
                        </div>
                        <div class="meta-item">
                            <svg class="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                            <span>${escapeHtml(complaint.name)}</span>
                        </div>
                        ${
                          complaint.email
                            ? `
                        <div class="meta-item">
                            <svg class="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                            <span>${escapeHtml(complaint.email)}</span>
                        </div>
                        `
                            : ""
                        }
                        <div class="meta-item">
                            <svg class="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span>${formatDate(complaint.createdAt)}</span>
                        </div>
                    </div>
                    
                    <div class="complaint-actions">
                        <select class="select select-sm" onchange="updateStatus(${complaint.id}, this.value)">
                            <option value="">Change Status</option>
                            <option value="pending" ${complaint.status === "pending" ? "disabled" : ""}>Pending</option>
                            <option value="resolved" ${complaint.status === "resolved" ? "disabled" : ""}>Resolved</option>
                            <option value="rejected" ${complaint.status === "rejected" ? "disabled" : ""}>Rejected</option>
                        </select>
                        <button class="btn btn-danger btn-sm" onclick="openDeleteModal(${complaint.id})">
                            <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                            Delete
                        </button>
                    </div>
                </div>
            `,
    )
    .join("");
}

async function updateStatus(id, status) {
  if (!status) return;

  try {
    const response = await fetch(`/complaints/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const result = await response.json();

    if (result.success) {
      showSuccess(`Complaint status updated to ${status}`);
      await loadComplaints();
    } else {
      showError(result.message);
    }
  } catch (error) {
    showError("Failed to update status");
  }
}

function openDeleteModal(id) {
  complaintToDelete = id;
  document.getElementById("deleteModal").style.display = "flex";
}

function closeDeleteModal() {
  complaintToDelete = null;
  document.getElementById("deleteModal").style.display = "none";
}

async function confirmDeleteComplaint() {
  if (!complaintToDelete) return;

  try {
    const response = await fetch(`/complaints/${complaintToDelete}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (result.success) {
      showSuccess("Complaint deleted successfully");
      await loadComplaints();
    } else {
      showError(result.message);
    }
  } catch (error) {
    showError("Failed to delete complaint");
  }

  closeDeleteModal();
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function showSuccess(message) {
  const successDiv = document.getElementById("successMessage");
  document.getElementById("successText").textContent = message;
  successDiv.style.display = "block";
  setTimeout(() => (successDiv.style.display = "none"), 5000);
}

function showError(message) {
  const errorDiv = document.getElementById("errorMessage");
  document.getElementById("errorText").textContent = message;
  errorDiv.style.display = "block";
  setTimeout(() => (errorDiv.style.display = "none"), 5000);
}
