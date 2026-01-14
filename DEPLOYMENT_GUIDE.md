# 🚀 Deployment Guide - Minto's Portfolio

## Deploying to Vercel (Recommended)

### Step 1: Prepare Your Repository

```bash
cd minto-portfolio
git init
git add .
git commit -m "Initial commit: Full-scale portfolio website"
git remote add origin https://github.com/yourusername/minto-portfolio.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Visit [https://vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Select your repository
5. Configure environment variables (see below)
6. Deploy!

### Step 3: Configure Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables:

```
NEXTAUTH_SECRET=<generate-new-secret>
NEXTAUTH_URL=https://yourdomain.com
ADMIN_EMAIL=danielminto13@gmail.com
ADMIN_PASSWORD=<secure-password>
MONGODB_URI=<your-mongodb-uri>
NEXT_PUBLIC_EMAILJS_SERVICE_ID=<your-service-id>
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=<your-template-id>
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=<your-public-key>
ADMIN_EMAIL_ADDRESS=danielminto13@gmail.com
```

---

## Alternative: Deploy to Other Platforms

### Heroku (Deprecated but still available)

1. Install Heroku CLI
2. `heroku login`
3. `heroku create your-app-name`
4. `heroku config:set NEXTAUTH_SECRET=<secret>`
5. `git push heroku main`

### Railway.app

1. Connect GitHub repository
2. Set environment variables in dashboard
3. Auto-deploys on push

### Netlify

1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variables

---

## Database Setup (MongoDB Atlas)

### Create Free MongoDB Cluster

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create account and sign in
3. Create new project
4. Build a database (free tier)
5. Configure:
   - Cloud provider: AWS
   - Region: Choose closest to you
6. Create cluster
7. Add database user
8. Get connection string
9. Replace `<password>` with user password
10. Add to `.env.local` as `MONGODB_URI`

### Network Access

- Click "Network Access" → "Add IP Address"
- For development: Your IP address
- For production: Allow access from anywhere (0.0.0.0/0)

---

## Custom Domain Setup

### Vercel + Custom Domain

1. In Vercel: Project Settings → Domains
2. Add your custom domain
3. Update DNS records at your domain registrar:
   - Add CNAME record pointing to Vercel
   - Or use Vercel nameservers

### Update NEXTAUTH_URL

After domain is live:
1. Update `.env` in Vercel:
   ```
   NEXTAUTH_URL=https://yourdomain.com
   ```
2. Redeploy project

---

## Email Setup (EmailJS)

### Configure EmailJS Service

1. Sign up at [https://www.emailjs.com](https://www.emailjs.com)
2. Add email service (Gmail, Outlook, etc.)
3. Create email template
4. Get credentials:
   - Service ID
   - Template ID
   - Public Key
5. Add to environment variables

### Email Template Example

```
Subject: New Order - {{ORDER_NUMBER}}

Hello {{CLIENT_NAME}},

Your order has been received!

Order Number: {{ORDER_NUMBER}}
Package: {{PACKAGE_TYPE}}
Amount: {{CURRENCY}} {{TOTAL_AMOUNT}}

Thank you for choosing Minto's Portfolio!

Best regards,
Daniel Minto
```

---

## Security Checklist

- [ ] Change `NEXTAUTH_SECRET` (use `openssl rand -base64 32`)
- [ ] Change admin password to something secure
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Set `NEXTAUTH_URL` to production domain
- [ ] Review MongoDB network access settings
- [ ] Use environment variables for all secrets
- [ ] Enable rate limiting if needed
- [ ] Set up CORS properly
- [ ] Review user data privacy settings
- [ ] Regular backups of MongoDB

---

## Performance Optimization

### Build Optimization

```bash
npm run build
```

Check bundle size:
```bash
npm install -g next-bundle-analyzer
```

### CDN Configuration

- Vercel automatically uses Edge Network
- Images optimized with Next.js Image component
- CSS minified by default

### Database Optimization

- Add indexes to frequently queried fields
- Monitor MongoDB metrics
- Archive old orders if needed

---

## Monitoring & Analytics

### Vercel Analytics

1. Project Settings → Analytics
2. Enable Web Vitals
3. Monitor:
   - Page speed
   - Core Web Vitals
   - Function execution

### Error Tracking

- Check Vercel Deployment logs
- Monitor Next.js error pages
- Set up error logging service (optional)

### User Monitoring

- Google Analytics (add to `_document.tsx`)
- Vercel Analytics
- Custom event tracking

---

## Maintenance

### Regular Tasks

- [ ] Monthly: Review user accounts
- [ ] Monthly: Check MongoDB usage
- [ ] Weekly: Review error logs
- [ ] As needed: Update dependencies (`npm update`)
- [ ] As needed: Fix bugs and deploy hotfixes

### Backup Strategy

```bash
# Download MongoDB backup
mongoexport --uri "mongodb+srv://user:pass@cluster.mongodb.net/db" \
  --collection orders --out backup.json
```

### Update Dependencies

```bash
npm outdated          # Check for updates
npm update            # Update minor/patch
npm audit             # Check for vulnerabilities
npm audit fix         # Fix vulnerabilities
```

---

## Troubleshooting Deployment

### Build Fails

1. Check build logs in Vercel
2. Run `npm run build` locally
3. Check for TypeScript errors
4. Verify all env variables are set

### Database Connection Error

1. Verify MongoDB URI
2. Check network access in Atlas
3. Test connection locally
4. Check firewall rules

### Authentication Not Working

1. Verify `NEXTAUTH_SECRET` is set
2. Check `NEXTAUTH_URL` matches domain
3. Clear browser cookies
4. Check NextAuth logs

### Email Not Sending

1. Verify EmailJS credentials
2. Test EmailJS account
3. Check spam folder
4. Review email templates

---

## Scaling Considerations

### When Traffic Grows

1. **Database**: MongoDB auto-scaling
2. **Images**: Use CDN (automatic on Vercel)
3. **API**: Vercel serverless scales automatically
4. **Cache**: Implement ISR (Incremental Static Regeneration)

### Load Testing

```bash
npm install -g artillery
artillery quick --count 10 --num 100 https://yourdomain.com
```

---

## Cost Estimation

### Monthly Costs

| Service | Tier | Cost |
|---------|------|------|
| Vercel | Pro (optional) | $20-40 |
| MongoDB | Free tier | $0 |
| EmailJS | Free tier | $0 |
| Domain | .com | ~$12/year |

**Total**: Approximately $20-50/month (or free for hobby tier)

---

## Rollback Strategy

If something breaks after deployment:

```bash
# View deployment history
vercel deployments list

# Rollback to previous version
vercel rollback <deployment-url>
```

Or redeploy from git:
```bash
git revert <commit-hash>
git push
# Vercel auto-deploys
```

---

## Advanced: Custom Server

If you need more control:

```bash
npm run build
npm start
```

This starts Node.js server on port 3000.

---

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **NextAuth Docs**: https://next-auth.js.org
- **MongoDB Docs**: https://docs.mongodb.com

---

**Last Updated**: January 5, 2026
**Version**: 1.0.0
