# 🔧 TROUBLESHOOTING GUIDE

## Common Issues & Solutions

---

## 🚀 STARTUP & INSTALLATION ISSUES

### Issue: "npm install" fails
**Problem**: Dependencies won't install  
**Solutions**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install

# If still failing, try legacy peer deps
npm install --legacy-peer-deps
```

### Issue: Port 3000 already in use
**Problem**: "Address already in use :::3000"  
**Solutions**:
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001

# Or find and kill manually
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows
```

### Issue: "Cannot find module" errors
**Problem**: Missing imports or wrong paths  
**Solutions**:
```bash
# Verify path aliases in tsconfig.json
# Check @/* mapping points to correct directory

# Rebuild TypeScript
npm run build

# Clear .next folder
rm -rf .next

# Restart dev server
npm run dev
```

---

## 🔐 AUTHENTICATION ISSUES

### Issue: Login not working
**Problem**: Can't log in with credentials  
**Solutions**:
1. Verify MongoDB is connected
2. Check `NEXTAUTH_SECRET` is set in `.env.local`
3. Verify admin user exists in database
4. Check password is correct
5. Clear browser cookies and cache
6. Try registering new user instead

```bash
# Check env variables
echo $NEXTAUTH_SECRET
echo $NEXTAUTH_URL
```

### Issue: "NextAuth not configured" error
**Problem**: Authentication module not working  
**Solutions**:
```bash
# Ensure file exists: app/api/auth/[...nextauth]/route.ts
# Verify it exports handler as GET and POST

# Clear next cache
rm -rf .next

# Restart server
npm run dev
```

### Issue: Session cookie not persisting
**Problem**: Getting logged out frequently  
**Solutions**:
1. Check `NEXTAUTH_SECRET` is long and secure
2. Verify `NEXTAUTH_URL` matches your domain
3. Clear browser cookies
4. Update session maxAge if needed
5. Check browser security settings (allow cookies)

### Issue: "Access Denied" on admin page
**Problem**: Can't access /admin even as admin user  
**Solutions**:
1. Verify user role is "ADMIN" in database
2. Check MongoDB connection
3. Verify JWT token includes role
4. Clear session: logout and login again
5. Check token expiration (30 days default)

---

## 💾 DATABASE ISSUES

### Issue: MongoDB connection fails
**Problem**: "MongooseConnectionError"  
**Solutions**:
```
1. Verify MONGODB_URI is correct in .env.local
2. Check MongoDB Atlas:
   - Cluster is active
   - Network access includes your IP
   - Username and password are correct
3. Test connection string:
   - Copy to MongoDB Compass
   - See if it connects
4. Whitelist your IP: MongoDB Atlas → Network Access → Add IP
```

### Issue: "Connection timeout"
**Problem**: Database connection takes too long or times out  
**Solutions**:
```
1. Check internet connection
2. Verify MongoDB cluster is running
3. Try connecting from different network
4. Check firewall settings
5. Verify connection string has correct database name
6. Add timeout parameter to URI:
   ?serverSelectionTimeoutMS=10000
```

### Issue: Data not saving to database
**Problem**: Form submissions don't save data  
**Solutions**:
```
1. Verify MongoDB connection works
2. Check API route returns 201 (created)
3. Verify schema matches data being sent
4. Check browser console for errors
5. Verify database user has write permissions
6. Check MongoDB quota/storage
```

### Issue: "Database not found"
**Problem**: Cannot connect to specific database  
**Solutions**:
```
1. Verify database name in MONGODB_URI
2. Create database in MongoDB Atlas if needed
3. Check spelling of database name
4. MongoDB auto-creates on first write
   (So write data first)
```

---

## 🎨 STYLING & DISPLAY ISSUES

### Issue: Tailwind CSS not applying
**Problem**: Styles not showing up  
**Solutions**:
```bash
# Rebuild Tailwind
npm run build

# Check tailwind.config.js has correct paths:
content: [
  "./app/**/*.{js,ts,jsx,tsx}",
  "./components/**/*.{js,ts,jsx,tsx}",
]

# Clear browser cache (Ctrl+Shift+Delete)

# Restart dev server
npm run dev
```

### Issue: Dark mode not working
**Problem**: Theme toggle doesn't change colors  
**Solutions**:
1. Verify dark: classes in Tailwind
2. Check `isDarkMode` state in Navbar
3. Verify `document.documentElement.classList` manipulation
4. Check browser console for errors
5. Test with browser DevTools

### Issue: Images not loading
**Problem**: Images show broken icon  
**Solutions**:
```
1. Verify image files exist in public/images/
2. Check image filename spelling (case-sensitive)
3. Use correct path: /images/filename.png
4. For next/image: configure in next.config.ts
5. Check browser console for 404 errors
6. Verify file permissions
```

### Issue: Layout looks broken on mobile
**Problem**: Page not responsive  
**Solutions**:
1. Check responsive classes: sm:, md:, lg:
2. Verify mobile-first approach
3. Test with DevTools (F12 → Toggle Device Toolbar)
4. Check viewport meta tag in layout.tsx
5. Verify Tailwind config has all breakpoints

---

## 🔗 API & ENDPOINT ISSUES

### Issue: "404 Not Found" on API route
**Problem**: API endpoint doesn't exist  
**Solutions**:
1. Verify file path: `app/api/route-name/route.ts`
2. Check file exports GET/POST handlers
3. Verify route name matches request URL
4. Check for typos in file path
5. Restart dev server after creating new route

### Issue: POST request fails with 400
**Problem**: "Bad Request"  
**Solutions**:
```
1. Verify Content-Type: application/json
2. Check request body format
3. Verify all required fields present
4. Console.log request in API route
5. Check form data serialization
6. Verify JSON.stringify in client
```

### Issue: API returns 401 Unauthorized
**Problem**: Can't access protected endpoints  
**Solutions**:
```
1. Verify session exists
2. Check JWT token not expired
3. Verify getServerSession returns session
4. Check Authorization header
5. Clear cookies and re-login
6. Verify NEXTAUTH_SECRET is set
```

### Issue: API returns 500 Internal Server Error
**Problem**: Server error in API route  
**Solutions**:
```
1. Check server logs
2. Add try-catch to API route
3. Log errors to console
4. Test API with Postman
5. Verify all dependencies imported
6. Check database connection
7. Verify async/await syntax
```

---

## 🐛 CLIENT-SIDE ERRORS

### Issue: "Hydration mismatch" error
**Problem**: Server and client render differently  
**Solutions**:
1. Add `'use client'` directive
2. Check for window/document usage
3. Verify initial state matches
4. Check Navbar digital clock
5. Verify useEffect dependencies

### Issue: "useState in server component"
**Problem**: Using state in server component  
**Solutions**:
```
Add 'use client' at top of file:
'use client';

// Then use useState
const [data, setData] = useState(...);
```

### Issue: Form submission doesn't work
**Problem**: Button click doesn't submit form  
**Solutions**:
1. Verify form has `onSubmit` handler
2. Check button type="submit"
3. Verify form element wraps button
4. Check preventDefault in handler
5. Verify API endpoint exists
6. Check browser console for errors
7. Test with network tab (F12 → Network)

### Issue: useEffect runs infinitely
**Problem**: Component keeps rerendering  
**Solutions**:
```
Add dependency array:
useEffect(() => {
  // code
}, []); // Empty = runs once on mount

Or specify dependencies:
useEffect(() => {
  // code
}, [dependency1, dependency2]);
```

---

## 📧 EMAIL ISSUES

### Issue: Emails not sending
**Problem**: No email received  
**Solutions**:
1. Verify EmailJS credentials in .env.local
2. Check email templates created in EmailJS
3. Test with EmailJS dashboard directly
4. Check spam folder
5. Verify recipient email is correct
6. Check service is active in EmailJS
7. Verify public key is correct

### Issue: EmailJS service not found
**Problem**: "Service not configured"  
**Solutions**:
1. Create service in EmailJS dashboard
2. Get Service ID from EmailJS
3. Add to .env.local: `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
4. Create template in EmailJS
5. Get Template ID and add to .env.local
6. Get Public Key and add to .env.local

---

## 🚀 BUILD & DEPLOYMENT ISSUES

### Issue: Build fails with TypeScript errors
**Problem**: `npm run build` returns errors  
**Solutions**:
```bash
# Check TypeScript errors
npm run build

# Fix errors one by one
# Common fixes:
# - Add type annotations
# - Import types from libraries
# - Fix undefined variables
# - Check path aliases

# Rebuild
npm run build
```

### Issue: "Module not found" on production
**Problem**: Works locally but fails after deploy  
**Solutions**:
1. Check case sensitivity of imports
2. Verify all environment variables set
3. Check build output has all files
4. Run `npm run build` locally to test
5. Verify all dependencies listed in package.json

### Issue: Vercel deploy fails
**Problem**: Deployment doesn't complete  
**Solutions**:
1. Check Vercel logs (Dashboard → Deployments)
2. Verify environment variables in Vercel
3. Check git commit was pushed
4. Verify package.json scripts
5. Run build locally first
6. Check for hardcoded values

### Issue: Environmental variables not working
**Problem**: `process.env.VARIABLE` returns undefined  
**Solutions**:
```
For public variables (client-side):
- Must start with NEXT_PUBLIC_
- Example: NEXT_PUBLIC_EMAILJS_SERVICE_ID

For private variables (server-only):
- No prefix needed
- Example: MONGODB_URI

In .env.local:
NEXT_PUBLIC_EXAMPLE=value
PRIVATE_EXAMPLE=value

In code:
const publicVar = process.env.NEXT_PUBLIC_EXAMPLE;
const privateVar = process.env.PRIVATE_EXAMPLE; // Only in API routes
```

---

## 🧪 TESTING & DEBUGGING

### Enable Debug Logging
```typescript
// In API route
console.log('Received data:', req.body);
console.log('Session:', session);
console.log('Error:', error);

// In component
console.log('State:', variable);
console.log('Props:', props);
```

### Test API Endpoints with Curl
```bash
# Test GET
curl http://localhost:3000/api/orders

# Test POST
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"name":"test"}'
```

### Test with Postman
1. Download Postman
2. Create request to http://localhost:3000/api/route
3. Set method (GET/POST)
4. Add body if needed (JSON)
5. Send request
6. Check response

---

## 📋 CHECKLIST BEFORE ASKING FOR HELP

Before reporting issues, verify:
- [ ] Checked error message carefully
- [ ] Looked in browser console (F12)
- [ ] Checked server logs
- [ ] Tried restarting dev server
- [ ] Cleared browser cache
- [ ] Verified .env.local has all variables
- [ ] Ran `npm install` recently
- [ ] TypeScript builds without errors
- [ ] Checked file paths (case-sensitive)
- [ ] Verified MongoDB connection

---

## 📞 GETTING MORE HELP

### Useful Resources
- Next.js Docs: https://nextjs.org/docs
- NextAuth Docs: https://next-auth.js.org
- MongoDB Docs: https://docs.mongodb.com
- Tailwind CSS: https://tailwindcss.com/docs
- Framer Motion: https://www.framer.com/motion/

### Debug Tools
- Browser DevTools (F12)
- Network tab for API calls
- MongoDB Compass for database
- Vercel Deployment Logs
- VSCode Debugger

---

**Last Updated**: January 5, 2026  
**Version**: 1.0.0
