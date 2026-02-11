if (document.getElementById("complaintForm")) {
  const form = document.getElementById("complaintForm");
  const successMessage = document.getElementById("successMessage");
  const errorMessage = document.getElementById("errorMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      roomNumber: document.getElementById("roomNumber").value.trim(),
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      category: document.getElementById("category").value.trim(),
      title: document.getElementById("title").value.trim(),
      description: document.getElementById("description").value.trim(),
    };

    try {
      const response = await fetch("/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        document.getElementById("complaintId").textContent =
          `#${result.data.id}`;
        successMessage.style.display = "block";
        errorMessage.style.display = "none";

        form.reset();

        successMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });

        setTimeout(() => {
          successMessage.style.display = "none";
        }, 10000);
      } else {
        document.getElementById("errorText").textContent =
          result.message || "Failed to submit complaint";
        errorMessage.style.display = "block";
        successMessage.style.display = "none";

        errorMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });

        setTimeout(() => {
          errorMessage.style.display = "none";
        }, 7000);
      }
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("errorText").textContent =
        "Network error. Please try again.";
      errorMessage.style.display = "block";
      successMessage.style.display = "none";

      setTimeout(() => {
        errorMessage.style.display = "none";
      }, 7000);
    }
  });

  successMessage.addEventListener("click", () => {
    successMessage.style.display = "none";
  });

  errorMessage.addEventListener("click", () => {
    errorMessage.style.display = "none";
  });
}

// Tracking functionality
if (document.getElementById("trackBtn")) {
  const trackBtn = document.getElementById("trackBtn");
  const trackingIdInput = document.getElementById("trackingId");
  const trackingResult = document.getElementById("trackingResult");
  const trackingError = document.getElementById("trackingError");
  const emptyTracking = document.getElementById("emptyTracking");

  trackBtn.addEventListener("click", searchComplaint);

  trackingIdInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchComplaint();
    }
  });

  async function searchComplaint() {
    const complaintId = trackingIdInput.value.trim();

    if (!complaintId) {
      trackingError.style.display = "none";
      trackingResult.style.display = "none";
      emptyTracking.style.display = "flex";
      return;
    }

    try {
      const response = await fetch("/complaints");
      const result = await response.json();

      if (result.success) {
        const complaint = result.data.find(
          (c) => c.id === parseInt(complaintId),
        );

        if (complaint) {
          displayTrackingResult(complaint);
          trackingResult.style.display = "block";
          trackingError.style.display = "none";
          emptyTracking.style.display = "none";
        } else {
          trackingError.style.display = "block";
          trackingResult.style.display = "none";
          emptyTracking.style.display = "none";
          document.getElementById("trackingErrorText").textContent =
            `No complaint found with ID: ${complaintId}`;
        }
      } else {
        trackingError.style.display = "block";
        trackingResult.style.display = "none";
        emptyTracking.style.display = "none";
        document.getElementById("trackingErrorText").textContent =
          "Failed to fetch complaints";
      }
    } catch (error) {
      console.error("Error:", error);
      trackingError.style.display = "block";
      trackingResult.style.display = "none";
      emptyTracking.style.display = "none";
      document.getElementById("trackingErrorText").textContent =
        "Network error. Please try again.";
    }
  }

  function displayTrackingResult(complaint) {
    document.getElementById("resultId").textContent = `#${complaint.id}`;

    const statusBadge = document.getElementById("resultStatus");
    statusBadge.textContent = complaint.status;
    statusBadge.className = `badge badge-${complaint.status}`;

    document.getElementById("resultTitle").textContent = complaint.title;
    document.getElementById("resultDescription").textContent =
      complaint.description;
    document.getElementById("resultRoomNumber").textContent =
      complaint.roomNumber || "Not provided";
    document.getElementById("resultCategory").textContent =
      complaint.category || "Other";
    document.getElementById("resultName").textContent =
      complaint.name || "Anonymous";
    document.getElementById("resultEmail").textContent =
      complaint.email || "Not provided";
  }
}
