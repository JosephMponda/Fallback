# Secure Backend API

A professional, production-ready backend API with authentication, payments, and cybersecurity features.

## 🚀 Features

- **JWT Authentication** - Secure token-based authentication
- **Rate Limiting** - Protection against brute force and DDoS attacks
- **Payment Integration** - Stripe payment processing
- **Email Notifications** - Automated emails to admin and customers
- **Database** - PostgreSQL with Prisma ORM
- **Security** - Helmet.js, CORS, input validation, SQL injection prevention
- **Logging** - Winston logger for error tracking
- **Validation** - Express-validator for input sanitization

## 📋 Prerequisites

- Node.js 18+ or Bun
- PostgreSQL 14+
- Stripe account (for payments)
- Gmail account or SMTP server (for emails)

## 🛠️ Installation

### 1. Install Dependencies

```bash
cd backend
npm install
# or
bun install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` with your configurations:

```env
# Server
PORT=5000
NODE_ENV=development

# Database - Replace with your PostgreSQL connection string
DATABASE_URL="postgresql://username:password@localhost:5432/dbname?schema=public"

# JWT Secret - Generate a strong random string
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d

# Email - Gmail example (use App Password, not regular password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
ADMIN_EMAIL=grandgaze01@gmail.com

# Stripe - Get from https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173
```

### 3. Setup Gmail App Password (if using Gmail)

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password: https://myaccount.google.com/apppasswords
4. Use this password in `EMAIL_PASSWORD`

### 4. Setup Database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations (creates tables)
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view/edit data
npx prisma studio
```

### 5. Create Logs Directory

```bash
mkdir logs
```

## 🏃 Running the Server

### Development Mode

```bash
npm run dev
# or
bun run dev
```

### Production Mode

```bash
npm start
# or
bun start
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

#### Get Profile (Protected)
```http
GET /api/auth/profile
Authorization: Bearer <your-jwt-token>
```

### Services Endpoints

#### Get All Services
```http
GET /api/services
GET /api/services?active=true
```

#### Get Service by ID
```http
GET /api/services/:id
```

#### Create Service (Admin Only)
```http
POST /api/services
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "name": "Premium Service",
  "description": "High quality service",
  "price": 99.99,
  "imageUrl": "https://example.com/image.jpg",
  "active": true
}
```

### Gallery Endpoints

#### Get All Gallery Items
```http
GET /api/gallery
GET /api/gallery?featured=true
GET /api/gallery?category=landscape
```

#### Create Gallery Item (Admin Only)
```http
POST /api/gallery
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "title": "Beautiful Sunset",
  "description": "A stunning sunset photo",
  "imageUrl": "https://example.com/sunset.jpg",
  "category": "nature",
  "featured": true
}
```

### Order Endpoints

#### Create Order
```http
POST /api/orders
Content-Type: application/json

{
  "serviceId": "uuid-here",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+1234567890",
  "address": "123 Main St",
  "quantity": 2,
  "specialRequests": "Please deliver on weekends"
}
```

#### Get All Orders (Protected)
```http
GET /api/orders
Authorization: Bearer <jwt-token>
```

#### Create Payment Intent (Protected)
```http
POST /api/orders/payment-intent
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "orderId": "order-uuid-here"
}
```

### Quote Endpoints

#### Submit Quote Request
```http
POST /api/quotes
Content-Type: application/json

{
  "customerName": "Jane Smith",
  "customerEmail": "jane@example.com",
  "customerPhone": "+1234567890",
  "serviceType": "Custom Development",
  "description": "I need a custom solution for...",
  "budget": 5000
}
```

#### Get All Quotes (Protected)
```http
GET /api/quotes
Authorization: Bearer <jwt-token>
```

### Contact Endpoints

#### Send Contact Message
```http
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "subject": "Question about services",
  "message": "I would like to know more about..."
}
```

#### Get All Messages (Admin Only)
```http
GET /api/contact
Authorization: Bearer <admin-jwt-token>
```

## 🔐 Security Features

### Rate Limiting
- **API Routes**: 100 requests per 15 minutes
- **Authentication**: 5 attempts per 15 minutes
- **Payments**: 10 requests per hour
- **Email/Contact**: 5 requests per hour

### Input Validation
- Email format validation
- Password strength requirements (min 8 chars, uppercase, lowercase, number, special char)
- Phone number validation
- UUID validation
- XSS protection through sanitization

### Security Headers (Helmet.js)
- Content Security Policy
- X-Content-Type-Options
- X-Frame-Options
- Strict-Transport-Security

### SQL Injection Prevention
- Prisma ORM with parameterized queries
- No raw SQL execution

## 📧 Email Notifications

The system automatically sends emails for:

1. **New Orders** - Admin receives notification with order details
2. **Order Status Updates** - Customer receives status update emails
3. **Quote Requests** - Admin receives notification, customer receives confirmation
4. **Quote Status Updates** - Customer receives updates
5. **Contact Messages** - Admin receives notification, customer receives auto-reply

All admin emails go to: `grandgaze01@gmail.com`

## 💳 Payment Integration

### Stripe Setup

1. Create account at https://stripe.com
2. Get API keys from https://dashboard.stripe.com/apikeys
3. Add to `.env`:
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### Payment Flow

1. Customer creates order
2. Frontend calls `/api/orders/payment-intent` with order ID
3. Backend creates Stripe PaymentIntent
4. Frontend uses Stripe.js to complete payment
5. Payment status updates automatically

## 🗄️ Database Schema

### Models
- **User** - Authentication and user management
- **Service** - Services catalog
- **GalleryItem** - Gallery/portfolio items
- **Order** - Customer orders with payment tracking
- **Quote** - Quote requests from customers
- **ContactMessage** - Contact form submissions

### Relationships
- User → Orders (one-to-many)
- User → Quotes (one-to-many)
- Service → Orders (one-to-many)

## 📊 Admin Features

Admin users (role: ADMIN) can:
- Create, update, delete services
- Create, update, delete gallery items
- View all orders and update their status
- View all quotes and update their status
- View all contact messages

## 🔧 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
sudo service postgresql status

# Test connection
psql -U username -d dbname
```

### Email Not Sending
- Verify Gmail App Password (not regular password)
- Check firewall allows SMTP port 587
- Enable "Less secure app access" if needed

### Migration Errors
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Create new migration
npx prisma migrate dev --name your_migration_name
```

## 📝 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development/production |
| DATABASE_URL | PostgreSQL connection | postgresql://user:pass@localhost:5432/db |
| JWT_SECRET | Secret for JWT signing | random_string_256_bits |
| JWT_EXPIRE | Token expiration | 7d |
| EMAIL_HOST | SMTP host | smtp.gmail.com |
| EMAIL_PORT | SMTP port | 587 |
| EMAIL_USER | Email username | your@gmail.com |
| EMAIL_PASSWORD | Email password/app password | app_specific_password |
| ADMIN_EMAIL | Admin notification email | grandgaze01@gmail.com |
| STRIPE_SECRET_KEY | Stripe secret key | sk_test_... |
| STRIPE_WEBHOOK_SECRET | Stripe webhook secret | whsec_... |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:5173 |

## 🚀 Deployment

### Prepare for Production

1. Set `NODE_ENV=production` in `.env`
2. Use strong JWT_SECRET (64+ random characters)
3. Enable SSL/TLS for database connection
4. Set up proper PostgreSQL user with limited privileges
5. Configure firewall rules
6. Set up monitoring and logging

### Deployment Platforms

- **Heroku**: Add Heroku Postgres addon
- **DigitalOcean**: Use Managed PostgreSQL
- **AWS**: Use RDS for PostgreSQL
- **Railway**: Built-in PostgreSQL support
- **Render**: Free PostgreSQL database

## 📞 Support

For issues or questions, contact the system admin at: grandgaze01@gmail.com

## 📄 License

ISC
