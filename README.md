# Neon Null - Galaxy Roguelike Game Website

A stunning, galaxy-themed website for the upcoming roguelike game **NeonNull**, launching July 2026. Features animated geometric shapes, Steam integration, and a fully functional alpha tester signup system with automated email delivery.

## 🌟 Features

### Frontend
- **Cosmic Design**: Galaxy-themed interface with animated stars and floating geometric shapes (squares, diamonds, circles)
- **Responsive Layout**: Works beautifully on desktop, tablet, and mobile devices
- **Smooth Animations**: CSS animations and transitions for an immersive experience
- **Steam Integration**: Direct wishlist links to your Steam page
- **Alpha Signup Form**: Professional form with validation and user feedback

### Backend
- **Email Automation**: Automatically sends welcome emails with Steam keys to alpha testers
- **Data Management**: Stores alpha tester information (name, email, signup date)
- **Steam Key Distribution**: Manages and distributes Steam keys from a pool
- **Duplicate Prevention**: Prevents multiple signups with the same email
- **RESTful API**: Clean API endpoints for signup and statistics

## 📁 Project Structure

```
celestial-chaos/
├── index.html    # Frontend website
├── server.js                # Backend API server
├── package.json             # Node.js dependencies
├── .env.example             # Environment variables template
└── README.md                # This file
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Email account (Gmail recommended for testing)

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Environment Variables

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` with your credentials:

**For Gmail:**
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
PORT=3000
```

**To get Gmail App Password:**
1. Enable 2-factor authentication on your Google account
2. Go to https://myaccount.google.com/apppasswords
3. Generate a new app password for "Mail"
4. Use that 16-character password in your `.env` file

**For Other Email Services (SendGrid, Mailgun, etc.):**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-api-key
PORT=3000
```

### Step 3: Add Steam Keys

Edit `server.js` and add your Steam keys to the `steamKeys` array:

```javascript
const steamKeys = [
    'XXXXX-XXXXX-XXXXX',
    'YYYYY-YYYYY-YYYYY',
    'ZZZZZ-ZZZZZ-ZZZZZ'
];
```

**Note**: For production, store keys in a database, not in the code.

### Step 4: Update Steam Link

Edit `galaxy-roguelike.html` and replace the placeholder Steam URL:

```html
<!-- Find this line around line 463 -->
<a href="https://store.steampowered.com/app/YOUR_STEAM_APP_ID" class="btn btn-primary" target="_blank">
```

Replace `YOUR_STEAM_APP_ID` with your actual Steam app ID.

### Step 5: Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

### Step 6: Set Up Frontend

1. Create a `public` folder in your project root:
```bash
mkdir public
```

2. Move `galaxy-roguelike.html` to the `public` folder and rename it to `index.html`:
```bash
mv galaxy-roguelike.html public/index.html
```

3. Access the website at: `http://localhost:3000`

## 🌐 Deployment

### Option 1: Heroku

1. Create a Heroku account and install the Heroku CLI
2. Create a new app:
```bash
heroku create your-app-name
```

3. Set environment variables:
```bash
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASSWORD=your-app-password
```

4. Deploy:
```bash
git push heroku main
```

### Option 2: DigitalOcean / AWS / VPS

1. SSH into your server
2. Clone your repository
3. Install Node.js and npm
4. Set up environment variables
5. Use PM2 to keep the server running:
```bash
npm install -g pm2
pm2 start server.js
pm2 startup
pm2 save
```

### Option 3: Netlify (Frontend) + Serverless Function (Backend)

**Frontend:**
- Deploy `galaxy-roguelike.html` to Netlify
- Update the fetch URL to your serverless function endpoint

**Backend:**
- Use Netlify Functions, Vercel, or AWS Lambda for the API
- Configure environment variables in your platform

## 📧 Email Template Customization

The welcome email is generated in `server.js` in the `generateWelcomeEmail()` function. You can customize:
- Logo and branding
- Welcome message
- Instructions
- Contact information
- Footer content

## 🔧 API Endpoints

### POST `/api/alpha-signup`
Register a new alpha tester and send welcome email.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "experience": "I love roguelikes!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully registered! Check your email for your Steam key."
}
```

### GET `/api/alpha-stats`
Get alpha tester statistics (add authentication in production).

**Response:**
```json
{
  "totalSignups": 42,
  "keysRemaining": 158
}
```

### GET `/api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-31T12:00:00.000Z"
}
```

## 🗄️ Database Integration (Recommended for Production)

For production use, replace the in-memory storage with a database:

### MongoDB Example:
```bash
npm install mongoose
```

```javascript
const mongoose = require('mongoose');

const TesterSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  experience: String,
  steamKey: String,
  signupDate: { type: Date, default: Date.now }
});

const Tester = mongoose.model('Tester', TesterSchema);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);
```

### PostgreSQL Example:
```bash
npm install pg
```

Use an ORM like Sequelize or Prisma for easier management.

## 🔒 Security Best Practices

1. **Never commit `.env` file** - Add it to `.gitignore`
2. **Use HTTPS** in production
3. **Add rate limiting** to prevent spam:
```bash
npm install express-rate-limit
```

4. **Validate and sanitize** all user inputs
5. **Add authentication** to admin endpoints
6. **Store Steam keys securely** in a database, not in code
7. **Use environment variables** for all sensitive data

## 🎨 Customization

### Colors
Edit the CSS variables in `galaxy-roguelike.html`:
```css
:root {
    --cosmic-purple: #6B4CE6;
    --deep-space: #0a0a1f;
    --nebula-pink: #FF3E9D;
    --star-white: #E8F5FF;
    --plasma-cyan: #00D9FF;
}
```

### Fonts
Current fonts: Orbitron (headings) and Rajdhani (body)
To change, update the Google Fonts import and CSS font-family.

### Shapes
Modify the `createShapes()` function to adjust:
- Number of shapes
- Animation speed
- Shape types and sizes

## 📝 To-Do for Production

- [ ] Replace in-memory storage with database
- [ ] Add admin dashboard for managing signups
- [ ] Implement proper Steam key management system
- [ ] Add email verification
- [ ] Set up analytics (Google Analytics, Plausible)
- [ ] Add CAPTCHA to prevent bot signups
- [ ] Create privacy policy and terms of service
- [ ] Set up monitoring and error logging
- [ ] Add Discord/social media integration
- [ ] Configure CDN for better performance

## 🐛 Troubleshooting

### Emails not sending
- Check your email credentials in `.env`
- Verify app password is correct (for Gmail)
- Check spam folder
- Review server logs for errors

### CORS errors
- Ensure `cors` middleware is enabled in `server.js`
- Check that frontend is making requests to correct URL

### Steam keys running out
- Monitor `/api/alpha-stats` endpoint
- Add more keys to the pool or database
- Implement key generation system

## 📞 Support

For questions or issues:
- Email: your-email@example.com
- Discord: [Your Discord Server]
- GitHub Issues: [Your GitHub Repo]

## 📄 License

MIT License - feel free to use and modify for your own projects.

---

**Built with ❤️ for the roguelike community**
