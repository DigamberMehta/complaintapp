// User Page - Submit Complaint Form
if (document.getElementById("complaintForm")) {
  const form = document.getElementById("complaintForm");
  const successMessage = document.getElementById("successMessage");
  const errorMessage = document.getElementById("errorMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
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
        // Show success message
        document.getElementById("complaintId").textContent =
          `#${result.data.id}`;
        successMessage.style.display = "block";
        errorMessage.style.display = "none";

        // Reset form
        form.reset();

        // Scroll to success message
        successMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });

        // Hide success message after 10 seconds
        setTimeout(() => {
          successMessage.style.display = "none";
        }, 10000);
      } else {
        // Show error message
        document.getElementById("errorText").textContent =
          result.message || "Failed to submit complaint";
        errorMessage.style.display = "block";
        successMessage.style.display = "none";

        // Scroll to error message
        errorMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });

        // Hide error message after 7 seconds
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

  // Auto-hide alerts when clicking on them
  successMessage.addEventListener("click", () => {
    successMessage.style.display = "none";
  });

  errorMessage.addEventListener("click", () => {
    errorMessage.style.display = "none";
  });
}
