# Online Store Deployment Guide

## Prerequisites
1. **Supabase Account** - [supabase.com](https://supabase.com)
2. **Vercel Account** - [vercel.com](https://vercel.com)
3. **GitHub/GitLab/Bitbucket Account** (for code hosting)

## Step 1: Set Up Supabase

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Enter project details:
   - Name: `online-store`
   - Database Password: (choose secure password)
   - Region: Choose closest to your customers
4. Click "Create new project"

### 1.2 Get Supabase Credentials
After project creation, go to:
1. **Project Settings** → **API**
2. Copy:
   - **Project URL** → Use for `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → Use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 1.3 Run Database Migrations
1. Go to **SQL Editor** in Supabase dashboard
2. Create new query
3. Copy and run the SQL from `supabase/migrations/001_initial_schema.sql`
4. Then run `supabase/migrations/002_orders_schema.sql`

### 1.4 Enable Authentication
1. Go to **Authentication** → **Providers**
2. Enable "Email" provider
3. Configure email settings if needed

## Step 2: Prepare Your Code

### 2.1 Update Environment Variables
Edit `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2.2 Test Locally
```bash
npm install
npm run dev
```
Visit `http://localhost:3000` to test everything works.

## Step 3: Deploy to Vercel

### 3.1 Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/online-store.git
git push -u origin main
```

### 3.2 Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = (your Supabase URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (your Supabase anon key)
6. Click "Deploy"

### 3.3 Configure Custom Domain (Optional)
1. In Vercel project settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Step 4: Post-Deployment Setup

### 4.1 Update Supabase URL
If using custom domain, update Supabase Auth redirect URLs:
1. Go to Supabase → Authentication → URL Configuration
2. Add your Vercel URL to:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: `https://your-app.vercel.app/**`

### 4.2 Test Live Site
1. Visit your Vercel URL
2. Test:
   - User registration/login
   - Product browsing
   - Adding to cart
   - Checkout process
   - Admin dashboard

## Step 5: Add Payment Processing (Optional)

### 5.1 Stripe Integration
1. Create Stripe account: [stripe.com](https://stripe.com)
2. Get publishable key from Stripe Dashboard
3. Add to Vercel environment variables:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = (your Stripe key)

### 5.2 PayPal Integration
1. Create PayPal Developer account
2. Create app for API credentials
3. Add to environment variables

## Troubleshooting

### Common Issues:

1. **Authentication not working**
   - Check Supabase URL and anon key
   - Verify redirect URLs in Supabase Auth settings
   - Check CORS settings in Supabase

2. **Database connection errors**
   - Verify SQL migrations ran successfully
   - Check table permissions in Supabase

3. **Build failures on Vercel**
   - Check build logs in Vercel dashboard
   - Verify all environment variables are set
   - Ensure `package.json` has correct dependencies

4. **Images not loading**
   - Check `next.config.js` for image domains
   - Verify Unsplash URLs are correct

## Support
- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs

## Security Notes
1. Never commit `.env.local` to git
2. Use strong passwords for Supabase database
3. Regularly update dependencies
4. Monitor Vercel logs for errors
5. Set up proper CORS in Supabase

Your online store is now ready for production! 🚀