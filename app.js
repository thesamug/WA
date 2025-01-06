// Import necessary libraries
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Serve static files (if using a frontend)
app.use(express.static('public'));

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use other services like Yahoo, Outlook, etc.
  auth: {
    user: process.env.EMAIL, // Your email address
    pass: process.env.PASSWORD // Your email password or app-specific password
  }
});

// Endpoint to send bulk messages
app.post('/send-messages', async (req, res) => {
  const { subject, message, contacts } = req.body;

  if (!subject || !message || !contacts || !Array.isArray(contacts)) {
    return res.status(400).json({ error: 'Invalid input. Ensure subject, message, and contacts are provided.' });
  }

  try {
    const emailPromises = contacts.map(contact => {
      return transporter.sendMail({
        from: process.env.EMAIL,
        to: contact,
        subject,
        text: message
      });
    });

    await Promise.all(emailPromises);
    res.status(200).json({ success: true, message: 'Emails sent successfully!' });
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).json({ error: 'Failed to send emails.' });
  }
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Instructions for setting up:
// 1. Create a .env file in the root directory and add your email credentials:
//    EMAIL=your-email@gmail.com
//    PASSWORD=your-email-password
// 2. Run the app using: node app.js
// 3. Use a tool like Postman to test the /send-messages endpoint or integrate a frontend.

// Optional: Add a frontend for easier usage.

// Frontend (HTML, CSS, JS) - Create a 'public' folder and add the following files:

/* public/index.html */
/*
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bulk Message Sender</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <h1>Send Bulk Messages</h1>
    <form id="messageForm">
      <label for="subject">Subject</label>
      <input type="text" id="subject" name="subject" required>

      <label for="message">Message</label>
      <textarea id="message" name="message" required></textarea>

      <label for="contacts">Contacts (comma-separated emails)</label>
      <input type="text" id="contacts" name="contacts" required>

      <button type="submit">Send Messages</button>
    </form>
    <p id="responseMessage"></p>
  </div>
  <script src="script.js"></script>
</body>
</html>
*/

/* public/styles.css */
/*
body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f9;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.container {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 400px;
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
}

input, textarea {
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
*/

/* public/script.js */
/*
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
*/
