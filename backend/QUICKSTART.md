# Quick Start Guide

Get your backend running in 5 minutes!

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] PostgreSQL running (or access to PostgreSQL database)
- [ ] Gmail account with App Password OR SMTP credentials
- [ ] Stripe account (free test mode)

## Step-by-Step Setup

### 1. Extract the Backend

```bash
tar -xzf backend-complete.tar.gz
cd backend
```

### 2. Install Dependencies

```bash
npm install
# or if you have Bun
bun install
```

### 3. Setup PostgreSQL Database

#### Option A: Local PostgreSQL
```bash
# Start PostgreSQL
sudo service postgresql start

# Create database
createdb mybackend

# Your DATABASE_URL will be:
# postgresql://username:password@localhost:5432/mybackend
```

#### Option B: Free Cloud Database
- **Supabase**: https://supabase.com (Free tier)
- **Railway**: https://railway.app (Free tier)
- **Neon**: https://neon.tech (Free tier)

### 4. Configure Environment Variables

```bash
# Copy example file
cp .env.example .env

# Edit .env file
nano .env
```

**Minimum required configuration:**

```env
# Server
PORT=5000
NODE_ENV=development

# Database (REQUIRED)
DATABASE_URL="postgresql://username:password@localhost:5432/mybackend"

# JWT Secret (REQUIRED - generate random string)
JWT_SECRET=paste_random_64_character_string_here

# Email (REQUIRED for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
ADMIN_EMAIL=grandgaze01@gmail.com

# Stripe (REQUIRED for payments)
STRIPE_SECRET_KEY=sk_test_get_from_stripe_dashboard
STRIPE_WEBHOOK_SECRET=whsec_get_from_stripe_dashboard

# Frontend
FRONTEND_URL=http://localhost:5173
```

### 5. Generate Strong JWT Secret

```bash
# Use this command to generate a secure random string
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and paste it as your `JWT_SECRET` in `.env`

### 6. Setup Gmail App Password

1. Go to Google Account: https://myaccount.google.com
2. Click Security → 2-Step Verification (enable if not enabled)
3. Go back to Security → App passwords
4. Generate new app password for "Mail"
5. Copy the 16-character password
6. Paste it as `EMAIL_PASSWORD` in `.env`

### 7. Get Stripe Keys

1. Go to https://dashboard.stripe.com/register
2. Sign up (free)
3. Go to Developers → API keys
4. Copy "Secret key" (starts with `sk_test_`)
5. Paste as `STRIPE_SECRET_KEY` in `.env`

For webhook secret (optional for basic setup):
6. Go to Developers → Webhooks
7. Click "Add endpoint"
8. Copy webhook signing secret

### 8. Initialize Database

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations (creates all tables)
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

### 9. Start the Server

```bash
npm run dev
# or
bun run dev
```

You should see:
```
🚀 Server running in development mode on port 5000
📧 Admin email configured: grandgaze01@gmail.com
```

### 10. Test the API

```bash
# Health check
curl http://localhost:5000/health

# Expected response:
# {"success":true,"message":"Server is running","timestamp":"..."}
```

## Verify Setup

### Test Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#",
    "name": "Test User"
  }'
```

### Test Email
Create a contact message (check that grandgaze01@gmail.com receives email):
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@example.com",
    "message": "Testing email notifications"
  }'
```

## Common Issues & Solutions

### ❌ "Cannot connect to database"
**Solution:** Check your DATABASE_URL is correct and PostgreSQL is running
```bash
sudo service postgresql status
```

### ❌ "Email not sending"
**Solution:** 
- Verify you're using Gmail App Password (not regular password)
- Check 2FA is enabled
- Try enabling "Less secure app access"

### ❌ "Port 5000 already in use"
**Solution:** Change PORT in .env to 5001, 8000, or any available port

### ❌ "Prisma migration failed"
**Solution:** Reset and try again:
```bash
npx prisma migrate reset
npx prisma migrate dev --name init
```

### ❌ "Module not found"
**Solution:** Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. **Frontend Integration**: See `API_EXAMPLES.md` for React integration
2. **Add Services**: Use Prisma Studio or create via API
3. **Deploy**: Follow `DEPLOYMENT.md` for production deployment
4. **Security**: Review `SECURITY.md` before going live

## Project Structure

```
backend/
├── config/          # Database, email, logger configuration
├── controllers/     # Business logic for each feature
├── middleware/      # Auth, validation, rate limiting
├── routes/          # API route definitions
├── utils/           # Helper functions
├── prisma/          # Database schema
├── logs/            # Application logs
└── server.js        # Main application entry
```

## Available Endpoints

Once running, access:
- API Base: `http://localhost:5000/api`
- Health Check: `http://localhost:5000/health`
- Prisma Studio: `http://localhost:5555` (when running `npx prisma studio`)

## API Routes
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/services` - Get all services
- `POST /api/orders` - Create order (sends email to admin)
- `POST /api/quotes` - Submit quote request (sends email to admin)
- `POST /api/contact` - Send contact message (sends email to admin)

Full API documentation in `README.md`

## Support

- 📖 Full Documentation: `README.md`
- 🔐 Security Guide: `SECURITY.md`
- 🚀 Deployment Guide: `DEPLOYMENT.md`
- 💻 Code Examples: `API_EXAMPLES.md`

**Admin Email:** grandgaze01@gmail.com

## Production Deployment

When ready for production:
1. Set `NODE_ENV=production`
2. Use strong JWT_SECRET (64+ characters)
3. Use Stripe live keys (`sk_live_...`)
4. Enable SSL/HTTPS
5. Follow `DEPLOYMENT.md`

---

**Your backend is now ready! 🚀**

Start building your frontend and integrate using the examples in `API_EXAMPLES.md`
