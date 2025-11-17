# Security Documentation

## Overview

This backend implements multiple layers of security to protect against common web vulnerabilities and attacks.

## Security Measures Implemented

### 1. Authentication & Authorization

#### JWT (JSON Web Tokens)
- Tokens signed with strong secret key
- Configurable expiration (default: 7 days)
- Tokens required for protected routes
- Automatic token verification on each request

#### Password Security
- Bcrypt hashing with 12 salt rounds
- Minimum password requirements:
  - At least 8 characters
  - Must contain uppercase letter
  - Must contain lowercase letter
  - Must contain number
  - Must contain special character

#### Role-Based Access Control (RBAC)
- User roles: USER, ADMIN
- Admin-only endpoints protected by `authorize()` middleware
- Users can only access their own resources

### 2. Rate Limiting

Protection against brute force and DDoS attacks:

```javascript
// API Routes: 100 requests per 15 minutes
// Auth Routes: 5 attempts per 15 minutes
// Payment Routes: 10 requests per hour
// Email Routes: 5 requests per hour
```

### 3. Input Validation & Sanitization

#### Express-validator
- Email format validation
- Data type validation
- String sanitization
- SQL injection prevention through validation
- XSS protection through sanitization

#### Request Size Limits
- JSON payload: 10MB maximum
- URL-encoded: 10MB maximum

### 4. Security Headers (Helmet.js)

```javascript
Content-Security-Policy
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
```

### 5. CORS (Cross-Origin Resource Sharing)

- Configured whitelist of allowed origins
- Credentials support enabled
- Pre-flight request handling

### 6. SQL Injection Prevention

- **Prisma ORM**: All queries parameterized
- No raw SQL execution
- Prepared statements for all database operations

### 7. Error Handling

- Detailed errors in development
- Generic errors in production (no stack traces exposed)
- Structured error logging with Winston
- No sensitive information in error responses

### 8. Logging & Monitoring

```javascript
// Winston logger with levels:
- error: Error messages
- warn: Warning messages
- info: Informational messages
- debug: Debug messages (development only)
```

### 9. Database Security

- Connection string in environment variables
- Principle of least privilege for database users
- No default credentials
- Connection pooling and timeout configuration

### 10. Payment Security

- Stripe PCI compliance
- Payment Intent API (server-side)
- No card details stored in database
- Webhook signature verification

## Environment Security

### Required Environment Variables

```bash
# Strong JWT secret (generate with: openssl rand -base64 64)
JWT_SECRET=<strong-random-string>

# Secure database connection
DATABASE_URL=postgresql://user:password@host:5432/db?sslmode=require

# Email credentials (use App Passwords)
EMAIL_PASSWORD=<app-specific-password>

# Stripe keys
STRIPE_SECRET_KEY=sk_live_...  # Use live keys in production
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Security Checklist for Production

- [ ] Change all default passwords
- [ ] Use strong JWT_SECRET (64+ characters)
- [ ] Enable SSL/TLS for database connections
- [ ] Use environment variables (never hardcode secrets)
- [ ] Enable HTTPS only (no HTTP)
- [ ] Set NODE_ENV=production
- [ ] Configure firewall rules
- [ ] Enable database backups
- [ ] Set up monitoring and alerts
- [ ] Review and limit CORS origins
- [ ] Use Stripe live keys (not test keys)
- [ ] Enable audit logging
- [ ] Regular security updates for dependencies
- [ ] Implement IP whitelisting for admin routes (if needed)

## Vulnerability Prevention

### Prevented Attacks

✅ **SQL Injection** - Prisma ORM with parameterized queries
✅ **XSS (Cross-Site Scripting)** - Input sanitization, CSP headers
✅ **CSRF (Cross-Site Request Forgery)** - CORS configuration
✅ **Brute Force** - Rate limiting on auth endpoints
✅ **DDoS** - Rate limiting on all routes
✅ **Man-in-the-Middle** - HTTPS enforcement, HSTS header
✅ **Sensitive Data Exposure** - No sensitive data in responses
✅ **Broken Authentication** - Secure JWT implementation
✅ **Security Misconfiguration** - Helmet.js security headers
✅ **Insufficient Logging** - Winston comprehensive logging

## Incident Response

### If Security Breach Suspected

1. **Immediately**:
   - Rotate all secrets (JWT_SECRET, database passwords, API keys)
   - Review logs for suspicious activity
   - Disable compromised accounts

2. **Investigate**:
   - Check error logs
   - Review access logs
   - Identify attack vector

3. **Remediate**:
   - Patch vulnerability
   - Update dependencies
   - Deploy fixes

4. **Notify**:
   - Inform affected users
   - Report to relevant authorities if required

## Regular Maintenance

### Weekly
- Review error logs
- Check for failed login attempts
- Monitor API usage patterns

### Monthly
- Update dependencies: `npm audit fix`
- Review and rotate API keys
- Check security advisories

### Quarterly
- Full security audit
- Penetration testing
- Update security policies

## Contact

For security concerns, contact: grandgaze01@gmail.com

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
