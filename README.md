# Online Store with Supabase & Vercel

A modern online store built with Next.js, Supabase for authentication/database, and ready for deployment on Vercel.

## Features

- 🔐 **User Authentication** - Login and registration with Supabase Auth
- 🛍️ **Product Catalog** - Display products with categories and filtering
- 🔍 **Product Search** - Search products by name
- 🎯 **Advanced Filtering** - Filter by category, price range, and sort options
- 🛒 **Shopping Cart** - Add products to cart with local storage persistence
- 💳 **Cash on Delivery (COD)** - Pay when you receive option (no extra fees)
- 💳 **Stripe Integration** - Secure card payments (demo mode)
- 💳 **Multiple Payment Methods** - COD, Credit Card, PayPal (coming soon)
- 📦 **Order Management** - View order history and track orders
- 📧 **Email Notifications** - Order confirmation emails
- 👤 **User Profile** - Manage account information and preferences
- 📊 **Admin Dashboard** - Manage orders, products, and view analytics
- 🎨 **Modern UI** - Responsive design with Tailwind CSS
- 🔄 **Real-time Updates** - Supabase real-time subscriptions
- 🚀 **Vercel Ready** - Optimized for deployment

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Supabase** - Authentication & Database
- **Lucide React** - Icon library
- **Vercel** - Hosting platform

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd online-store
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Enable Authentication in your Supabase project
3. Run the migration from `supabase/migrations/001_initial_schema.sql` to create products table

### 4. Configure environment variables

Copy `.env.local.example` to `.env.local` and update with your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub/GitLab/Bitbucket
2. Import your repository to Vercel
3. Add environment variables in Vercel project settings
4. Deploy!

### Environment Variables in Vercel

Add the following environment variables in your Vercel project:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout with payment
│   ├── orders/            # Order history
│   ├── profile/           # User profile
│   ├── products/          # Products listing
│   ├── categories/        # Categories page
│   ├── about/             # About page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── AuthProvider.tsx   # Authentication context
│   ├── CartProvider.tsx   # Shopping cart context
│   ├── CartIcon.tsx       # Cart icon with badge
│   ├── Navbar.tsx         # Navigation bar with profile dropdown
│   ├── ProductCard.tsx    # Product display card
│   ├── ProductGrid.tsx    # Product grid layout
│   └── Hero.tsx           # Hero section
├── lib/                   # Utility libraries
│   └── supabase.ts        # Supabase client
├── supabase/migrations/   # Database migrations
└── public/                # Static assets
```

## Key Features

### Shopping Cart
- Add/remove products
- Update quantities
- Local storage persistence
- Real-time cart count in navbar

### Checkout Process
1. **Shipping Information** - Collect delivery details
2. **Payment Method** - Choose COD, Credit Card, or PayPal
3. **Order Summary** - Review items and total
4. **Order Confirmation** - Success page with order details

### Cash on Delivery (COD)
- Pay when you receive the order
- Additional $2 COD fee
- Perfect for customers who prefer cash payments

### User Account
- View order history
- Track order status
- Update profile information
- Manage preferences

### Payment Methods
1. **Cash on Delivery (COD)** - Pay with cash upon delivery
2. **Credit/Debit Card** - Secure card payments
3. **PayPal** - PayPal account payments

## Database Schema

The application uses Supabase for:
- **Authentication**: User accounts and sessions
- **Products**: Product catalog with images and pricing
- **Orders**: Order tracking (to be implemented in Supabase)
- **Cart**: User shopping cart (local storage + Supabase sync)

## Next Steps

- [ ] **PayPal API Integration** - Add real PayPal payments
- [ ] **Real Stripe Integration** - Connect to live Stripe account
- [ ] **Supabase Orders** - Connect orders to Supabase database
- [ ] **Product Reviews** - Add customer reviews and ratings
- [ ] **Wishlist** - Save products for later
- [ ] **Real Email Notifications** - Connect to email service
- [ ] **Inventory Management** - Track product stock levels
- [ ] **Shipping Integration** - Connect to shipping carriers
- [ ] **Multi-language Support** - Internationalization
- [ ] **Mobile App** - React Native version

## License

MIT