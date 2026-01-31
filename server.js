// server.js - Backend API for Neon Null Alpha Signup
// Install dependencies: npm install express nodemailer cors body-parser dotenv

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files (your HTML)

// In-memory storage (replace with database in production)
// For production, use MongoDB, PostgreSQL, or another database
const alphaTesters = [];

// Configure email transporter
// You'll need to set up these environment variables
const transporter = nodemailer.createTransport({
    service: 'gmail', // or 'smtp.sendgrid.net', 'smtp.mailgun.org', etc.
    auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASSWORD // your email password or app-specific password
    }
});

// Alternatively, use SMTP configuration:
/*
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});
*/

// Steam key pool (you'll need to manage this)
// In production, fetch from database or external service
const steamKeys = [
    'XXXXX-XXXXX-XXXXX', // Replace with actual Steam keys
    'YYYYY-YYYYY-YYYYY',
    'ZZZZZ-ZZZZZ-ZZZZZ'
    // Add more keys as needed
];

let keyIndex = 0;

// Function to get next available Steam key
function getNextSteamKey() {
    if (keyIndex >= steamKeys.length) {
        return null; // No more keys available
    }
    return steamKeys[keyIndex++];
}

// Generate welcome email HTML
function generateWelcomeEmail(name, steamKey) {
    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #0a0a1f;
            color: #E8F5FF;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            background: linear-gradient(135deg, #00D9FF, #FF3E9D);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: 3px;
        }
        .content {
            background: rgba(107, 76, 230, 0.1);
            border: 2px solid #6B4CE6;
            border-radius: 15px;
            padding: 30px;
            margin: 20px 0;
        }
        .steam-key-box {
            background: rgba(0, 217, 255, 0.1);
            border: 2px solid #00D9FF;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
        }
        .steam-key {
            font-size: 24px;
            font-weight: bold;
            color: #00D9FF;
            letter-spacing: 2px;
            margin: 10px 0;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #6B4CE6, #FF3E9D);
            color: white;
            padding: 15px 30px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: bold;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #B8C5D6;
            font-size: 14px;
        }
        h1 {
            color: #00D9FF;
        }
        p {
            line-height: 1.6;
            color: #E8F5FF;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">CELESTIAL CHAOS</div>
        </div>
        
        <div class="content">
            <h1>Welcome to the Alpha, ${name}! 🚀</h1>
            
            <p>Thank you for joining the Celestial Chaos alpha testing program! We're thrilled to have you aboard as we prepare for our July 2026 launch.</p>
            
            <p>You're now part of an exclusive group of testers who will help shape the final version of the game. Your feedback will be invaluable in creating the best possible roguelike experience.</p>
            
            <div class="steam-key-box">
                <p><strong>Your Steam Key:</strong></p>
                <div class="steam-key">${steamKey}</div>
                <p style="font-size: 14px; margin-top: 15px;">Keep this key safe! It grants you access to the alpha build.</p>
            </div>
            
            <h2>How to Activate Your Key:</h2>
            <ol>
                <li>Open Steam and log into your account</li>
                <li>Click "Games" in the top menu</li>
                <li>Select "Activate a Product on Steam"</li>
                <li>Enter your key: <strong>${steamKey}</strong></li>
                <li>Download and start playing!</li>
            </ol>
            
            <h2>What's Next?</h2>
            <ul>
                <li><strong>Download the Game:</strong> After activating your key, the alpha build will appear in your Steam library</li>
                <li><strong>Join Our Discord:</strong> Connect with other testers and the dev team (link coming soon)</li>
                <li><strong>Share Feedback:</strong> We'll send you a feedback form to share your experiences</li>
                <li><strong>Stay Updated:</strong> You'll receive regular updates about new features and builds</li>
            </ul>
            
            <p>If you encounter any issues or have questions, please don't hesitate to reach out to us at <a href="mailto:${process.env.EMAIL_USER}" style="color: #00D9FF;">${process.env.EMAIL_USER}</a></p>
            
            <p style="margin-top: 30px;">Welcome to the cosmos, pilot. Let's make something amazing together!</p>
            
            <p><strong>- The Celestial Chaos Team</strong></p>
        </div>
        
        <div class="footer">
            <p>© 2026 Celestial Chaos. All rights reserved.</p>
            <p>You're receiving this email because you signed up for alpha testing at celestialchaos.com</p>
        </div>
    </div>
</body>
</html>
    `;
}

// Alpha Signup Endpoint
app.post('/api/alpha-signup', async (req, res) => {
    try {
        const { name, email, experience } = req.body;
        
        // Validation
        if (!name || !email) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name and email are required' 
            });
        }
        
        // Check if email already registered
        const existingTester = alphaTesters.find(tester => tester.email === email);
        if (existingTester) {
            return res.status(409).json({ 
                success: false, 
                message: 'This email is already registered for alpha testing' 
            });
        }
        
        // Get Steam key
        const steamKey = getNextSteamKey();
        if (!steamKey) {
            return res.status(503).json({ 
                success: false, 
                message: 'No Steam keys available at the moment. Please try again later.' 
            });
        }
        
        // Save tester data
        const testerData = {
            name,
            email,
            experience: experience || 'Not provided',
            steamKey,
            signupDate: new Date().toISOString()
        };
        alphaTesters.push(testerData);
        
        // Send welcome email
        const mailOptions = {
            from: `"Celestial Chaos Team" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '🚀 Welcome to Celestial Chaos Alpha - Your Steam Key Inside!',
            html: generateWelcomeEmail(name, steamKey)
        };
        
        await transporter.sendMail(mailOptions);
        
        // Log the signup (in production, save to database)
        console.log('New alpha tester registered:', { name, email, timestamp: new Date() });
        
        res.status(200).json({ 
            success: true, 
            message: 'Successfully registered! Check your email for your Steam key.' 
        });
        
    } catch (error) {
        console.error('Alpha signup error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'An error occurred during signup. Please try again.' 
        });
    }
});

// Get alpha testers count (for admin purposes)
app.get('/api/alpha-stats', (req, res) => {
    // In production, add authentication here
    res.json({
        totalSignups: alphaTesters.length,
        keysRemaining: steamKeys.length - keyIndex
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API endpoint: http://localhost:${PORT}/api/alpha-signup`);
});

module.exports = app;
