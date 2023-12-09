// JavaScript for Profile Modal
const profileModal = document.getElementById('profileModal');
const closeProfileModal = document.getElementById('closeProfileModal');
const editProfileButton = document.getElementById('editProfileButton');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');

// Show the profile modal
function showProfileModal() {
  // Fetch user data and update modal content (replace with actual user data)
  usernameInput.value = "ExampleUser";
  emailInput.value = "user@example.com";

  profileModal.style.display = 'block';
}

// Hide the profile modal
function hideProfileModal() {
  profileModal.style.display = 'none';
}

// Close the profile modal when the close button is clicked
closeProfileModal.addEventListener('click', hideProfileModal);

// Open the profile modal when the "Your Profile" section is clicked
document.getElementById('profile').addEventListener('click', showProfileModal);

// Close the profile modal if the user clicks outside of it
window.addEventListener('click', (event) => {
  if (event.target === profileModal) {
    hideProfileModal();
  }
});

// Example: Open the edit profile form when the "Edit Profile" button is clicked
editProfileButton.addEventListener('click', () => {
  // Add your logic to open the edit profile form or make fields editable
  // For example, enable input fields for editing
  usernameInput.readOnly = false;
  emailInput.readOnly = false;
});
