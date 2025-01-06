/* public/script.js */

document.getElementById('messageForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value;
  const contacts = document.getElementById('contacts').value.split(',');

  try {
    const response = await fetch('/send-messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ subject, message, contacts })
    });

    const result = await response.json();
    document.getElementById('responseMessage').textContent = result.success ? result.message : result.error;
  } catch (error) {
    document.getElementById('responseMessage').textContent = 'Error sending messages.';
  }
});
