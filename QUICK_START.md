# 🚀 Quick Start Guide - Minto's Portfolio

## Initial Setup (5 minutes)

### Step 1: Install Dependencies
```bash
cd minto-portfolio
npm install
```

### Step 2: Configure Environment Variables
Edit `.env.local` with your settings:

```env
NEXTAUTH_SECRET=generate-a-random-string-here
NEXTAUTH_URL=http://localhost:3000
ADMIN_EMAIL=danielminto13@gmail.com
ADMIN_PASSWORD=your-secure-password
MONGODB_URI=your-mongodb-connection-string
```

**To generate a secure NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Step 3: Start Development Server
```bash
npm run dev
```

Visit: **http://localhost:3000**

---

## 🔑 Default Credentials

**Admin Account:**
- Email: `danielminto13@gmail.com`
- Password: Check your `.env.local` file

**Demo User Account:**
- Create one via `/register` page

---

## 📖 Key Pages

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Landing page with all sections |
| Login | `/login` | User sign in |
| Register | `/register` | Create new account |
| Dashboard | `/dashboard` | View your orders |
| Profile | `/profile` | Edit your information |
| Order | `/order` | Place new service order |
| Admin | `/admin` | Manage all orders (admin only) |
| Privacy | `/privacy` | Privacy policy |
| Terms | `/terms` | Terms of service |
| Resume | `/resume` | View CV/Resume |

---

## 🎯 Testing Workflow

### Test as Regular User
1. Go to `/register`
2. Create a new account
3. Navigate to `/order` to place an order
4. View your order in `/dashboard`

### Test as Admin
1. Login with admin credentials
2. Go to `/admin` dashboard
3. View all orders from all users
4. Change order status

### Test Home Page
- Scroll through all sections
- Toggle dark/light mode (top right)
- Check responsive design on mobile

---

## 🛠️ Development Tips

### Hot Reload
Changes automatically reload in browser - no restart needed!

### Using the Browser DevTools
- Inspect elements
- Check network requests
- Test responsive design (F12 → Toggle Device Toolbar)

### Database
- MongoDB operations happen in API routes
- Check `app/api/` for backend logic

### Styling
- Uses Tailwind CSS
- Edit `tailwind.config.js` for theme changes
- All styles are responsive by default

---

## 📦 Building for Production

```bash
npm run build
npm start
```

Then deploy to Vercel or your hosting provider.

---

## 🐛 Common Issues & Solutions

### Port 3000 Already In Use
```bash
npx kill-port 3000
# or specify different port:
npm run dev -- -p 3001
```

### MongoDB Connection Error
- Verify connection string in `.env.local`
- Check MongoDB Atlas network access
- Ensure credentials are correct

### NextAuth Error
- Clear `.next` folder: `rm -rf .next`
- Restart dev server
- Check `NEXTAUTH_SECRET` is set

### Styling Issues
- Clear browser cache (Ctrl+Shift+Delete)
- Rebuild: `npm run build`

---

## 📊 File Structure

```
minto-portfolio/
├── app/                    # Pages and API routes
├── components/             # React components
├── lib/                    # Utilities and database
├── public/images/          # Your images and logo
├── .env.local              # Configuration (local)
└── package.json            # Dependencies
```

---

## ✅ Checklist Before Launch

- [ ] Update all contact information
- [ ] Add your real MongoDB connection
- [ ] Configure EmailJS (if using)
- [ ] Update social links in footer
- [ ] Change admin password
- [ ] Test all forms
- [ ] Verify responsive design
- [ ] Check dark mode works
- [ ] Update project showcases
- [ ] Set up domain/hosting

---

## 📞 Support

For questions or issues:
- Documentation: See `SETUP_GUIDE.md`
- Email: danielminto13@gmail.com
- GitHub: https://github.com/djminto

---

**Happy Coding! 🎉**
