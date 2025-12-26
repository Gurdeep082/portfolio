const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const dotenv = require('dotenv');
const cors = require('cors'); // Import the cors package

dotenv.config();


const app = express();
const port = process.env.PORT || 5000;
app.use(cors({
    origin: 'https://gurdeeps-portfolio.netlify.app'
  }));
  

// Your Twilio credentials from .env file
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const fromWhatsApp = process.env.FROM_WHATSAPP; // Twilio sandbox WhatsApp number or your own
const toWhatsApp = process.env.TO_WHATSAPP; // Replace with your WhatsApp number (or a verified one)

// Initialize Twilio client
const client = twilio(accountSid, authToken);

// Middleware
app.use(bodyParser.json());

// POST route to handle form data and send WhatsApp message
app.post('/send-message', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Send WhatsApp message using Twilio API
        await client.messages.create({
            from: `whatsapp:${fromWhatsApp}`, // Ensure 'whatsapp:' is prefixed
            to: `whatsapp:${toWhatsApp}`,     // Ensure 'whatsapp:' is prefixed
            body: `*New Inquiry Received
             *Full Name*: ${name}            
             *Email Address*: ${email} 
             *Message*: ${message}`,
        });

        return res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to send message' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
