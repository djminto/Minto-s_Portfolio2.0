# 🗺️ SITE MAP & NAVIGATION STRUCTURE

## Minto's Portfolio - Complete Site Navigation

---

## 📍 HOME PAGE & MAIN SECTIONS

```
/ (Home)
├── Hero Section
│   ├── Marquee text animation
│   ├── Typing occupation animation
│   ├── Call-to-action buttons
│   └── Live digital clock
├── Projects Section
│   ├── MacBook mockup display
│   ├── Zoe Accessories project
│   ├── The Giver Foundation project
│   └── Gentlecare Ambulance Services project
├── Skills Section
│   ├── HTML
│   ├── CSS
│   ├── JavaScript
│   ├── Tailwind CSS
│   ├── React
│   ├── Node.js
│   ├── ASP.NET Core
│   ├── MongoDB
│   └── SQL Server
├── Pricing Section
│   ├── Basic Package
│   ├── Standard Package (Popular)
│   ├── Professional Package
│   ├── Enterprise Package
│   └── Payment terms
└── Footer
    ├── Quick links
    ├── Social media (5 links)
    └── Contact info
```

---

## 🔐 AUTHENTICATION ROUTES

```
/login (Public)
├── Email input
├── Password input
├── Error messages
├── Register link
└── Redirect to /dashboard on success

/register (Public)
├── Full name input
├── Email input
├── Password input
├── Confirm password
├── Form validation
├── Register button
└── Redirect to /login on success
```

---

## 👤 USER ROUTES (Protected)

```
/dashboard (User only)
├── Welcome header
├── Statistics cards
│   ├── Total orders
│   ├── Completed orders
│   └── In progress orders
├── Quick action buttons
│   ├── Place new order
│   └── View profile
└── Orders table
    ├── Order number
    ├── Package type
    ├── Amount & currency
    ├── Status
    └── Date

/profile (User only)
├── Profile information form
│   ├── Email (read-only)
│   ├── Full name
│   ├── Phone number
│   ├── Address
│   └── Account type
├── Edit/Save buttons
└── Admin link (if admin role)

/order (User only)
├── Step 1: Package selection
│   ├── Basic
│   ├── Standard
│   ├── Professional
│   └── Enterprise
├── Step 2: Client information
│   ├── Full name
│   ├── Email
│   ├── Phone
│   └── Description
├── Step 3: Payment method
│   ├── Cash option
│   ├── Bank transfer option
│   └── Card option
├── Payment instructions popup
└── Order summary sidebar
    ├── Package details
    ├── Pricing
    └── Total amount
```

---

## 🛠️ ADMIN ROUTES (Admin only)

```
/admin (Admin only)
├── Dashboard header
├── Statistics cards
│   ├── Total orders
│   ├── Pending count
│   ├── In progress count
│   ├── Completed count
│   └── Total revenue
├── Filter buttons
│   ├── All
│   ├── Pending
│   ├── In Progress
│   └── Completed
└── Orders table
    ├── Order number
    ├── Client name & email
    ├── Package type
    ├── Amount
    ├── Status (editable dropdown)
    ├── Date
    └── Contact button
```

---

## 📄 LEGAL & INFO ROUTES

```
/privacy (Public)
├── Privacy Policy content
│   ├── Introduction
│   ├── Information collected
│   ├── Usage of information
│   ├── Data security
│   ├── User rights
│   └── Contact information
└── Last updated date

/terms (Public)
├── Terms & Agreements content
│   ├── Agreement to terms
│   ├── Use license
│   ├── Disclaimer
│   ├── Limitations
│   ├── Accuracy of materials
│   ├── Links
│   ├── Modifications
│   ├── Governing law
│   └── Contact
└── Last updated date

/resume (Public)
├── Resume header
├── PDF viewer (embedded)
├── Download button
└── Quick info cards
    ├── Experience
    ├── Education
    └── Skills
```

---

## 🔗 NAVIGATION FLOW

### Anonymous User Flow
```
Start
  ↓
Home (/)
  ↓
Browse Projects, Skills, Pricing
  ↓
Click "Order" or "Contact"
  ↓
Redirect to /login
  ↓
Login or /register
  ↓
Dashboard (/dashboard)
```

### Authenticated User Flow
```
Home (/)
  ↓
Click "Order Website"
  ↓
Order Form (/order)
  ↓
Place Order
  ↓
View Dashboard (/dashboard)
  ↓
View Profile (/profile)
  ↓
Check Order Status (in dashboard)
```

### Admin User Flow
```
Dashboard (/dashboard)
  ↓
View Profile (/profile)
  ↓
Go to Admin (/admin)
  ↓
View All Orders
  ↓
Update Order Status
  ↓
Monitor Statistics
```

---

## 🎯 KEY NAVIGATION POINTS

### Navbar (On Every Page)
```
[Logo] Minto's Portfolio | [Projects] [Skills] [Pricing] [Contact] | [Clock] [Dark Mode Toggle]
```

### Footer (On Every Page)
```
[About] [Quick Links] [Legal]
[Social Icons: Gmail, Instagram, WhatsApp, GitHub, LinkedIn]
[Copyright & Contact Info]
```

### Home Page CTA Buttons
```
"View Projects" → Scroll to #projects section
"Order Website" → /order (or /login if not authenticated)
"Contact Me" → Scroll to footer or open contact
```

---

## 🔄 REDIRECTS & PROTECTED ROUTES

### Automatic Redirects
```
/login (authenticated user)      → /dashboard
/register (authenticated user)   → /dashboard
/dashboard (unauthenticated)     → /login
/order (unauthenticated)         → /login
/profile (unauthenticated)       → /login
/admin (non-admin user)          → /dashboard
/admin (unauthenticated)         → /login
```

---

## 📱 RESPONSIVE BREAKPOINTS

All pages are responsive for:
```
Mobile:     320px - 640px
Tablet:     641px - 1024px
Desktop:    1025px+
```

Each section adapts:
- Grid layouts (1 → 2 → 3+ columns)
- Font sizes (mobile optimized)
- Navigation (mobile menu ready)
- Forms (full-width on mobile)
- Images (responsive sizing)

---

## 🎨 COMPONENT TREE

```
App
├── Layout
│   ├── Navbar
│   │   ├── Logo
│   │   ├── Navigation Links
│   │   ├── Digital Clock
│   │   └── Theme Toggle
│   ├── Main Content
│   │   └── [Page-specific components]
│   └── Footer
│       ├── Links
│       ├── Social Icons
│       └── Contact Info
├── Pages
│   ├── Home
│   │   ├── HeroSection
│   │   ├── ProjectsSection
│   │   ├── SkillsSection
│   │   └── PricingSection
│   ├── Auth Pages
│   │   ├── LoginPage
│   │   └── RegisterPage
│   ├── User Pages
│   │   ├── DashboardPage
│   │   ├── ProfilePage
│   │   └── OrderPage
│   ├── Admin Pages
│   │   └── AdminDashboard
│   ├── Legal Pages
│   │   ├── PrivacyPage
│   │   ├── TermsPage
│   │   └── ResumePage
│   └── Error Pages
│       └── NotFound (404)
└── API Routes
    ├── /api/auth/[...nextauth]
    ├── /api/users/register
    ├── /api/users/profile
    ├── /api/orders
    ├── /api/orders/[id]
    ├── /api/proposals
    └── /api/email/send
```

---

## 📊 PAGE COUNT & STATISTICS

| Category | Count |
|----------|-------|
| Public Pages | 6 |
| Protected User Pages | 3 |
| Admin Pages | 1 |
| Legal Pages | 3 |
| API Routes | 7 |
| UI Components | 10+ |
| Sections | 4 |
| **Total Pages** | **14** |

---

## 🚀 QUICK NAVIGATION GUIDE

### For Users
1. Home (/) - Start here
2. View Projects - Scroll or click in navbar
3. Order Website - /order (login required)
4. Dashboard - /dashboard (view orders)
5. Profile - /profile (edit info)

### For Admins
1. Dashboard - /dashboard (user stats)
2. Admin - /admin (all orders)
3. Profile - /profile (account info)

### For Public
1. Home - /
2. Privacy - /privacy
3. Terms - /terms
4. Resume - /resume

---

## 🔐 SESSION & AUTH FLOW

```
User
  ↓
Click Login or Register
  ↓
Submit Credentials
  ↓
Server Validates
  ↓
Generate JWT Token
  ↓
Set Session Cookie
  ↓
Redirect to Dashboard
  ↓
Protected Routes Check Session
  ↓
Allow Access or Redirect to Login
  ↓
Logout
  ↓
Clear Session & Redirect Home
```

---

## 🌐 PRODUCTION DEPLOYMENT CHECKLIST

- [ ] Update NEXTAUTH_URL to production domain
- [ ] Configure custom domain DNS
- [ ] Set up MongoDB Atlas production cluster
- [ ] Configure EmailJS (if using)
- [ ] Test all routes on production
- [ ] Monitor error logs
- [ ] Set up analytics
- [ ] Enable backups
- [ ] Test all forms
- [ ] Verify redirects
- [ ] Check responsive design
- [ ] Test authentication flow
- [ ] Verify admin access
- [ ] Check dark mode
- [ ] Test on mobile devices

---

## 📞 CONTACT PATHS

Users can contact via:
1. **Email**: Footer link → mailto:danielminto13@gmail.com
2. **WhatsApp**: Footer link → https://wa.me/18763864417
3. **Instagram**: Footer link → https://www.instagram.com/minto_web_design/
4. **GitHub**: Footer link → https://github.com/djminto
5. **LinkedIn**: Footer link → https://www.linkedin.com/in/daniel-minto-ba80a9271/

---

**Last Updated**: January 5, 2026  
**Version**: 1.0.0  
**Status**: ✅ Complete & Tested
