# Frontend-Backend Integration Guide

## 🎉 Integration Complete!

Your Everest Printing Press frontend is now fully integrated with the secure backend API!

## ✅ What's Been Integrated

### Authentication System
- ✅ Login/Register pages with JWT authentication
- ✅ Protected routes and user session management
- ✅ Authentication context for global state
- ✅ Auto-redirect on token expiration
- ✅ User info displayed in navbar

### Contact Form
- ✅ Connected to `/api/contact` endpoint
- ✅ Sends email to admin (grandgaze01@gmail.com)
- ✅ Auto-reply confirmation email to customer
- ✅ Error handling and loading states
- ✅ Success messages

### Order/Quote System
- ✅ Connected to `/api/quotes` endpoint
- ✅ Loads services from backend API
- ✅ Sends email notification to admin
- ✅ Customer confirmation email
- ✅ Fallback to default services if API unavailable

### Services Page
- ✅ Fetches services from `/api/services`
- ✅ Displays pricing and descriptions
- ✅ Graceful fallback to static data

### Gallery Page
- ✅ Fetches gallery items from `/api/gallery`
- ✅ Category filtering
- ✅ Image display support
- ✅ Fallback to demo content

### API Configuration
- ✅ Axios client with automatic auth token injection
- ✅ Error interceptors for 401 handling
- ✅ Environment-based API URL
- ✅ All CRUD operations implemented

## 🚀 Quick Start

### 1. Start the Backend

```bash
cd backend
npm install
# Configure .env file
npm run dev
```

Backend runs on `http://localhost:5000`

### 2. Start the Frontend

```bash
cd Everest-Printing-Press-
npm install
# Edit .env file if needed
npm run dev
```

Frontend runs on `http://localhost:5173`

### 3. Configure Environment Variables

#### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_your_key
```

#### Backend `.env`
```env
PORT=5000
DATABASE_URL=postgresql://user:pass@localhost:5432/db
JWT_SECRET=your_secret_key
EMAIL_USER=your@gmail.com
EMAIL_PASSWORD=app_password
ADMIN_EMAIL=grandgaze01@gmail.com
STRIPE_SECRET_KEY=sk_test_your_key
FRONTEND_URL=http://localhost:5173
```

## 📧 Email Notifications

All email notifications are sent to: **grandgaze01@gmail.com**

### When Emails Are Sent:

1. **Contact Form Submission**
   - Admin receives: Contact details and message
   - Customer receives: Auto-reply confirmation

2. **Quote/Order Request**
   - Admin receives: Customer info, service type, description, budget
   - Customer receives: Quote request confirmation

3. **Order Status Updates** (Admin only)
   - Customer receives: Status change notifications

## 🔐 Authentication Flow

### Registration
1. User fills registration form
2. Password validation (8+ chars, uppercase, lowercase, number, special char)
3. API creates user with hashed password
4. JWT token returned and stored in localStorage
5. User automatically logged in

### Login
1. User enters email/password
2. API validates credentials
3. JWT token returned and stored
4. User data stored in localStorage
5. Redirected to home page

### Logout
1. Token removed from localStorage
2. User state cleared
3. Redirected to home page

## 🎨 Updated Components

### Modified Files:
```
src/
├── api/
│   ├── client.js          (NEW) - Axios configuration
│   └── services.js        (NEW) - API endpoints
├── context/
│   └── AuthContext.jsx    (NEW) - Authentication state
├── pages/
│   ├── Contact.jsx        (UPDATED) - Backend integration
│   ├── Order.jsx          (UPDATED) - Backend integration
│   ├── Services.jsx       (UPDATED) - Backend integration
│   ├── Gallery.jsx        (UPDATED) - Backend integration
│   ├── Login.jsx          (NEW) - Login page
│   └── Register.jsx       (NEW) - Registration page
├── components/
│   └── Navbar.jsx         (UPDATED) - Auth UI
└── App.jsx                (UPDATED) - Routes & AuthProvider
```

## 📡 API Endpoints Used

### Authentication
```
POST /api/auth/register   - Create new user
POST /api/auth/login      - Login user
GET  /api/auth/profile    - Get user profile
```

### Contact
```
POST /api/contact         - Send contact message
```

### Quotes
```
POST /api/quotes          - Submit quote request
GET  /api/quotes          - Get user's quotes (auth required)
```

### Services
```
GET  /api/services        - Get all active services
GET  /api/services/:id    - Get service by ID
```

### Gallery
```
GET  /api/gallery         - Get all gallery items
GET  /api/gallery?category=x - Filter by category
```

## 🛡️ Security Features

### Frontend
- JWT token in Authorization header
- Auto-redirect on 401 errors
- Password validation
- XSS prevention
- Secure credential storage

### Backend
- Bcrypt password hashing (12 rounds)
- JWT authentication
- Rate limiting (5 login attempts per 15 min)
- Input validation
- SQL injection prevention
- CORS protection

## 🔄 Data Flow Examples

### Contact Form Submission
```
1. User fills contact form
2. Frontend: contactAPI.sendMessage()
3. Backend: validates input
4. Backend: saves to database
5. Backend: sends email to admin
6. Backend: sends auto-reply to customer
7. Frontend: shows success message
```

### Quote Request
```
1. User fills order form
2. Frontend: quotesAPI.create()
3. Backend: validates input
4. Backend: saves quote request
5. Backend: emails admin with details
6. Backend: emails customer confirmation
7. Frontend: shows success with quote ID
```

### Service Loading
```
1. Page loads
2. Frontend: servicesAPI.getAll()
3. Backend: fetches from database
4. Frontend: displays services
5. (If API fails: shows fallback data)
```

## ⚠️ Important Notes

### Environment Variables
- Always use `.env` file (never commit it!)
- Frontend vars must start with `VITE_`
- Update `FRONTEND_URL` in backend for CORS

### Email Setup
- Gmail requires App Password (not regular password)
- Enable 2FA in Google Account
- Generate App Password at: https://myaccount.google.com/apppasswords

### Database
- PostgreSQL must be running
- Run migrations: `npx prisma migrate dev`
- Admin email: grandgaze01@gmail.com

### Production Deployment
1. Update API URLs in both `.env` files
2. Set `NODE_ENV=production` in backend
3. Use HTTPS (SSL/TLS)
4. Use strong JWT_SECRET
5. Use Stripe live keys

## 🧪 Testing the Integration

### Test Contact Form
1. Go to `/contact`
2. Fill and submit form
3. Check: grandgaze01@gmail.com for email
4. Check: Your email for auto-reply

### Test Quote Request
1. Go to `/order`
2. Fill quote form
3. Submit request
4. Check admin email for notification

### Test Authentication
1. Go to `/register`
2. Create account
3. Login at `/login`
4. Check navbar shows username
5. Logout works

### Test Services
1. Go to `/services`
2. Services should load from API
3. If backend down, shows fallback data

## 🐛 Troubleshooting

### "Cannot connect to backend"
- Check backend is running on port 5000
- Verify `VITE_API_URL` in frontend .env
- Check CORS settings in backend

### "Email not sending"
- Verify EMAIL_USER and EMAIL_PASSWORD in backend .env
- Use Gmail App Password, not regular password
- Check firewall allows port 587

### "Services not loading"
- Check backend database has services
- Use Prisma Studio to add services
- Fallback data will show if API fails

### "Token expired" error
- Logout and login again
- Check JWT_SECRET is set in backend
- Check JWT_EXPIRE setting

## 📚 Additional Resources

- Backend API Docs: `backend/README.md`
- Security Guide: `backend/SECURITY.md`
- Deployment Guide: `backend/DEPLOYMENT.md`
- API Examples: `backend/API_EXAMPLES.md`

## 🎯 Next Steps

1. **Add Services to Database**
   ```bash
   cd backend
   npx prisma studio
   # Add services manually
   ```

2. **Add Gallery Items**
   - Use Prisma Studio or API to add gallery items

3. **Test All Features**
   - Register/Login
   - Submit contact form
   - Request quote
   - Browse services/gallery

4. **Deploy**
   - Follow `backend/DEPLOYMENT.md`
   - Update environment variables
   - Test production deployment

## 💡 Tips

- **Development**: Keep both frontend and backend running
- **API Changes**: Restart frontend to reload .env
- **Database Changes**: Run `npx prisma migrate dev`
- **Email Testing**: Check spam folder

## 🤝 Support

For issues or questions:
- Admin Email: grandgaze01@gmail.com
- Check backend logs: `backend/logs/`
- Check browser console for frontend errors

---

**Your full-stack application is now ready! 🚀**
