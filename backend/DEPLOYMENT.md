# Deployment Guide

This guide covers deploying your secure backend API to various platforms.

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations tested
- [ ] Email sending tested
- [ ] Stripe integration tested
- [ ] Security audit completed
- [ ] Dependencies updated
- [ ] NODE_ENV set to 'production'
- [ ] SSL/TLS certificates ready

## Platform-Specific Deployment

### 1. Heroku

#### Setup

```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login

# Create app
heroku create your-app-name

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set EMAIL_HOST=smtp.gmail.com
heroku config:set EMAIL_PORT=587
heroku config:set EMAIL_USER=your@gmail.com
heroku config:set EMAIL_PASSWORD=your_app_password
heroku config:set ADMIN_EMAIL=grandgaze01@gmail.com
heroku config:set STRIPE_SECRET_KEY=sk_live_...
heroku config:set STRIPE_WEBHOOK_SECRET=whsec_...
heroku config:set FRONTEND_URL=https://your-frontend.com

# Deploy
git push heroku main

# Run migrations
heroku run npx prisma migrate deploy

# Check logs
heroku logs --tail
```

#### Procfile
Create `Procfile` in root:
```
web: node server.js
release: npx prisma migrate deploy
```

### 2. Railway

#### Setup

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add PostgreSQL
railway add --plugin postgresql

# Link to project
railway link

# Set environment variables in Railway dashboard
# or use CLI:
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=your_jwt_secret
# ... (repeat for all variables)

# Deploy
railway up

# Run migrations
railway run npx prisma migrate deploy
```

### 3. DigitalOcean App Platform

#### Setup

1. Create App in DigitalOcean dashboard
2. Connect GitHub repository
3. Configure build settings:
   - Build Command: `npm install && npx prisma generate`
   - Run Command: `npm start`
4. Add Managed PostgreSQL database
5. Set environment variables in dashboard
6. Deploy

### 4. AWS (EC2 + RDS)

#### Setup EC2

```bash
# SSH into EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone your-repo-url
cd backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Create .env file
nano .env
# (paste your environment variables)

# Run migrations
npx prisma migrate deploy

# Start with PM2
pm2 start server.js --name backend-api
pm2 save
pm2 startup
```

#### Setup RDS (PostgreSQL)

1. Create RDS instance in AWS console
2. Configure security group for EC2 access
3. Get connection string
4. Update DATABASE_URL in .env

#### Setup Nginx (Reverse Proxy)

```bash
# Install Nginx
sudo apt install nginx -y

# Configure Nginx
sudo nano /etc/nginx/sites-available/backend-api
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/backend-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

### 5. Render

1. Connect GitHub repository in Render dashboard
2. Create Web Service
3. Configure:
   - Environment: Node
   - Build Command: `npm install && npx prisma generate && npx prisma migrate deploy`
   - Start Command: `npm start`
4. Add PostgreSQL database
5. Set environment variables
6. Deploy

### 6. Vercel (with Serverless Functions)

Note: Requires code modifications for serverless deployment.

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables
vercel env add NODE_ENV
vercel env add DATABASE_URL
# ... (repeat for all variables)

# Deploy to production
vercel --prod
```

## Database Migration Strategy

### Development to Production

```bash
# 1. Create migration in development
npx prisma migrate dev --name migration_name

# 2. Commit migration files
git add prisma/migrations
git commit -m "Add migration"

# 3. Deploy to production
# (migrations will run automatically via deploy command)
npx prisma migrate deploy
```

### Rollback Strategy

```bash
# Reset to specific migration
npx prisma migrate resolve --rolled-back <migration_name>

# Or reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## Post-Deployment

### Health Check

```bash
# Test API
curl https://your-api.com/health

# Expected response:
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-01-10T12:00:00.000Z"
}
```

### Test Endpoints

```bash
# Test registration
curl -X POST https://your-api.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!@#","name":"Test User"}'

# Test services
curl https://your-api.com/api/services
```

### Setup Monitoring

#### PM2 Monitoring (if using PM2)

```bash
pm2 monitor
```

#### Custom Health Check Monitoring

Set up cron job or service to ping `/health` endpoint every 5 minutes.

### Setup Logging

```bash
# View logs
pm2 logs backend-api

# Or on Heroku
heroku logs --tail

# Or on Railway
railway logs
```

## SSL/TLS Configuration

### Let's Encrypt (Free SSL)

```bash
sudo certbot --nginx -d your-domain.com
sudo certbot renew --dry-run  # Test renewal
```

### Cloudflare (Optional)

1. Add domain to Cloudflare
2. Update nameservers
3. Enable Full SSL mode
4. Enable Always Use HTTPS

## Environment Variables for Production

```bash
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
JWT_SECRET=<64-character-random-string>
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASSWORD=app_password
ADMIN_EMAIL=grandgaze01@gmail.com
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=https://your-frontend.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Scaling

### Horizontal Scaling

- Deploy multiple instances behind load balancer
- Use Redis for session storage (if needed)
- Implement database connection pooling

### Database Scaling

- Enable read replicas
- Implement caching (Redis)
- Optimize queries with indexes

## Backup Strategy

### Database Backups

```bash
# Manual backup
pg_dump $DATABASE_URL > backup.sql

# Automated daily backups (cron)
0 2 * * * pg_dump $DATABASE_URL > /backups/$(date +\%Y\%m\%d).sql
```

### Code Backups

- Use Git with remote repository
- Tag releases: `git tag -a v1.0.0 -m "Release 1.0.0"`

## Troubleshooting

### Server Not Starting

```bash
# Check logs
pm2 logs
# or
heroku logs --tail

# Common issues:
# - Missing environment variables
# - Database connection failed
# - Port already in use
```

### Database Connection Issues

```bash
# Test database connection
npx prisma db pull

# Check DATABASE_URL format:
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require
```

### Email Not Sending

- Verify EMAIL_PASSWORD is App Password
- Check firewall allows port 587
- Test SMTP connection

## Maintenance

### Daily
- Monitor error logs
- Check server health

### Weekly
- Review security logs
- Check disk space
- Review API usage

### Monthly
- Update dependencies: `npm update`
- Security audit: `npm audit`
- Review and optimize database

## Support

For deployment issues, contact: grandgaze01@gmail.com
