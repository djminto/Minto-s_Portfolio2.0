# Minto's Portfolio - Full-Scale Portfolio & Web Services Platform

A production-ready personal portfolio and web services platform built with Next.js, TypeScript, Tailwind CSS, and modern web technologies.

## 🚀 Features

### Core Features
- **Hero Section** - Animated typing text with sliding marquee
- **Projects Showcase** - MacBook mockup design with live project previews
- **Skills Display** - Interactive skill cards with hover animations
- **Pricing Section** - Multiple package options with currency selection (JMD/USD)
- **Dark Mode** - System and manual theme toggle
- **Responsive Design** - Mobile-first approach for all devices

### Authentication & Authorization
- Secure credential-based authentication with NextAuth.js
- Role-based access control (USER / ADMIN)
- Protected routes with middleware
- User registration and login pages

### User Features
- User profile management
- Order history tracking
- Dashboard with order statistics
- Profile photo and information updates

### Admin Features
- Comprehensive admin dashboard
- View all customer orders
- Update order status (Pending → In Progress → Completed)
- Monitor business metrics
- Revenue tracking

### Order & Services
- Service package selection (Basic, Standard, Professional, Enterprise)
- Multi-step order form
- Payment method options (Cash, Bank Transfer, Card)
- Payment instructions display
- Order confirmation and tracking

### Additional Features
- PDF proposal generation
- E-signature support
- Email notifications (EmailJS integration)
- Privacy Policy and Terms of Service pages
- Resume/CV viewer with PDF embed
- Professional footer with social links

## 📋 Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **3D Graphics**: Three.js & React Three Fiber
- **Authentication**: NextAuth.js
- **Database**: MongoDB with Mongoose
- **Email**: EmailJS
- **PDF Generation**: jsPDF
- **Icons**: Font Awesome (emoji-based)

## 📁 Project Structure

```
minto-portfolio/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/               # Authentication endpoints
│   │   ├── orders/             # Order management
│   │   ├── users/              # User management
│   │   ├── proposals/          # Proposal generation
│   │   └── email/              # Email notifications
│   ├── (auth)/                 # Auth pages group
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/              # User dashboard
│   ├── admin/                  # Admin dashboard
│   ├── profile/                # User profile
│   ├── order/                  # Order placement
│   ├── privacy/                # Privacy policy
│   ├── terms/                  # Terms of service
│   ├── resume/                 # Resume viewer
│   ├── layout.tsx              # Root layout with SessionProvider
│   └── page.tsx                # Home page
├── components/
│   ├── sections/               # Page sections
│   │   ├── HeroSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── SkillsSection.tsx
│   │   └── PricingSection.tsx
│   ├── common/                 # Shared components
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── ui/                     # UI components
│       └── Button.tsx
├── lib/
│   ├── db/
│   │   └── mongodb.ts          # MongoDB connection
│   ├── models/                 # Mongoose schemas
│   │   ├── User.ts
│   │   ├── Order.ts
│   │   └── Review.ts
│   ├── email/
│   │   └── sendEmail.ts        # Email utilities
│   └── utils/
│       └── proposalGenerator.ts # PDF proposal generation
├── public/
│   └── images/                 # Project images and assets
├── types/
│   └── global.d.ts             # Global TypeScript definitions
├── .env.local                  # Environment variables
├── package.json
├── tsconfig.json
└── tailwind.config.js
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account or local MongoDB
- EmailJS account (optional, for email features)

### Installation Steps

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Environment Variables**

Edit `.env.local`:
```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-key-here-change-in-production
NEXTAUTH_URL=http://localhost:3000

# Admin Credentials
ADMIN_EMAIL=danielminto13@gmail.com
ADMIN_PASSWORD=your-secure-password-here

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/minto-portfolio

# EmailJS Configuration (Optional)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxxxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xxxxx
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=public_key_xxxxx

# Admin Email
ADMIN_EMAIL_ADDRESS=danielminto13@gmail.com
```

3. **Run Development Server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

4. **Build for Production**
```bash
npm run build
npm start
```

## 📊 Database Models

### User Model
```typescript
{
  email: String (unique),
  password: String (hashed),
  fullName: String,
  phone: String,
  profilePhoto: String,
  address: String,
  role: 'USER' | 'ADMIN',
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model
```typescript
{
  userId: String,
  clientName: String,
  clientEmail: String,
  clientPhone: String,
  packageType: 'Basic' | 'Standard' | 'Professional' | 'Enterprise',
  description: String,
  status: 'Pending' | 'In Progress' | 'Completed',
  paymentMethod: 'Cash' | 'Bank Transfer' | 'Card',
  totalAmount: Number,
  currency: 'JMD' | 'USD',
  orderNumber: String (unique),
  proposalSigned: Boolean,
  signatureData: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentication

### Login Credentials (Admin)
- **Email**: danielminto13@gmail.com
- **Password**: Check your `.env.local` file

### Register New Account
Users can create new accounts via the registration page at `/register`

## 💰 Pricing Packages

| Package | JMD | USD | Features |
|---------|-----|-----|----------|
| Basic | 50,000 | $333 | Single page, basic SEO, contact form |
| Standard | 100,000 | $667 | Multi-page, advanced design, email integration |
| Professional | 150,000 | $1,000 | Custom design, database, payment gateway |
| Enterprise | 250,000 | $1,667 | Full web app, unlimited revisions, support |

## 🚀 Deployment

### Deploy to Vercel
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

```bash
vercel deploy
```

### Environment Variables for Production
- Update `NEXTAUTH_SECRET` with a strong random key
- Update `NEXTAUTH_URL` to your production domain
- Configure MongoDB Atlas for production
- Set up EmailJS credentials if using email features

## 📧 Email Setup (EmailJS)

1. Sign up at [EmailJS](https://www.emailjs.com/)
2. Create a service and template
3. Add credentials to `.env.local`:
   - `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
   - `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
   - `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`

## 🎨 Customization

### Colors & Theme
Edit `tailwind.config.js` to customize colors:
- Primary: Blue (#0066cc)
- Secondary: Black
- Accent: White

### Content Updates
- Update social links in `Footer.tsx`
- Modify project links in `ProjectsSection.tsx`
- Edit pricing in `PricingSection.tsx`
- Change admin email in `.env.local`

### Images
Place your images in `public/images/` and reference them:
```tsx
<img src="/images/your-image.png" alt="Description" />
```

## 📱 Pages Overview

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing page with all sections |
| Login | `/login` | User authentication |
| Register | `/register` | New user registration |
| Dashboard | `/dashboard` | User order history |
| Profile | `/profile` | User profile management |
| Order | `/order` | Place new service order |
| Admin | `/admin` | Admin order management |
| Privacy | `/privacy` | Privacy policy |
| Terms | `/terms` | Terms of service |
| Resume | `/resume` | CV/Resume viewer |

## 🐛 Troubleshooting

### Database Connection Issues
- Verify MongoDB URI is correct
- Check network access in MongoDB Atlas
- Ensure credentials are valid

### NextAuth Issues
- Clear `.next` folder and rebuild
- Verify `NEXTAUTH_SECRET` is set
- Check callback URLs match your domain

### Email Not Sending
- Verify EmailJS credentials
- Test template IDs
- Check spam folder
- Ensure service is activated

## 📈 Performance Tips

1. **Image Optimization**: Use Next.js Image component
2. **Code Splitting**: Components auto-split via dynamic imports
3. **Caching**: Leverage ISR and revalidation
4. **Monitoring**: Set up Vercel Analytics

## 📄 License

This project is proprietary and created for Daniel Minto.

## 📞 Support

For issues or questions:
- Email: danielminto13@gmail.com
- Phone: +1 (876) 386-4417
- GitHub: https://github.com/djminto

---

**Last Updated**: January 5, 2026
**Version**: 1.0.0
