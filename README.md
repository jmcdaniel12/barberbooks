# BarberBooks — Deployment Guide

## How to Get Your App Live in 5 Minutes

### Step 1: Create a Vercel Account (Free)
1. Go to **https://vercel.com**
2. Click **"Sign Up"**
3. Sign up with your **GitHub**, **Google**, or **Email** account

### Step 2: Create a GitHub Account (if you don't have one)
1. Go to **https://github.com**
2. Sign up for a free account

### Step 3: Upload This Project to GitHub
1. On GitHub, click the **"+"** button (top right) → **"New repository"**
2. Name it **barberbooks**
3. Keep it **Public** (or Private, your choice)
4. Click **"Create repository"**
5. On the next page, click **"uploading an existing file"**
6. **Drag and drop ALL the files from this folder** into the upload area
   - Make sure you include the `src/` and `public/` folders too
7. Click **"Commit changes"**

### Step 4: Deploy on Vercel
1. Go to **https://vercel.com/new**
2. Click **"Import"** next to your **barberbooks** repository
3. Vercel auto-detects it as a Vite project — just click **"Deploy"**
4. Wait about 60 seconds...
5. **Done!** You'll get a live URL like `barberbooks.vercel.app`

### Step 5: Share It!
- Send the link to barbers via text, Instagram DM, group chats
- Print a **QR code** (search "QR code generator" on Google, paste your URL)
- Put the QR code at your shop counter

---

## It Works Like an App on Phones!
When someone visits your link on their phone:
- **iPhone**: Tap the Share button → "Add to Home Screen"
- **Android**: Tap the 3-dot menu → "Add to Home Screen"

This installs it as an icon on their phone — no App Store needed!

---

## Optional: Custom Domain
Want `barberbooks.com` instead of `barberbooks.vercel.app`?
1. Buy a domain at **https://namecheap.com** (~$10-12/year)
2. In Vercel dashboard → Settings → Domains → Add your domain
3. Follow the DNS instructions Vercel gives you

---

## Project Structure
```
barberbooks-deploy/
├── index.html          ← Main HTML file
├── package.json        ← Dependencies
├── vite.config.js      ← Build config
├── public/
│   ├── favicon.svg     ← Browser tab icon
│   ├── icon-192.png    ← App icon (small)
│   ├── icon-512.png    ← App icon (large)
│   └── manifest.json   ← PWA config (makes it installable)
└── src/
    ├── main.jsx        ← Entry point
    └── App.jsx         ← The BarberBooks app
```

## Need Help?
If you get stuck, the Vercel docs are great: https://vercel.com/docs
