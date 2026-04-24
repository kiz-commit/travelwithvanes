# Travel With Vanes

A modern travel blogger website themed around Brazil and Australia. Built with Next.js, Firebase, Stripe, and Tailwind CSS.

## Features

- **Curated Itineraries** — Browse and purchase travel itinerary packages with day-by-day breakdowns
- **Product Shop** — Shop travel essentials with Stripe-powered checkout
- **UGC Content** — Rich blog/vlog content feed with tags and media galleries
- **Admin Dashboard** — Protected CMS for managing itineraries, products, and UGC posts
- **Rich Text Editing** — Tiptap editor for content creation
- **Responsive Design** — Fully mobile-friendly with a Brazil/Australia color theme

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS v4 + shadcn/ui (base-nova)
- **Backend**: Firebase (Firestore, Auth, Storage)
- **Payments**: Stripe Checkout
- **Rich Text**: Tiptap editor
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 20+
- A Firebase project with Firestore, Authentication, and Storage enabled
- A Stripe account

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy the example env file and fill in your values:

```bash
cp .env.local.example .env.local
```

Required variables:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase project API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain (e.g., `project.firebaseapp.com`) |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |
| `STRIPE_SECRET_KEY` | Stripe secret key (starts with `sk_`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (starts with `pk_`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (starts with `whsec_`) |
| `NEXT_PUBLIC_BASE_URL` | Your site URL (e.g., `http://localhost:3000`) |

### 3. Set up Firebase

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Firestore Database** (start in test mode for development)
3. Enable **Authentication** with Email/Password provider
4. Enable **Storage**
5. Create an admin user in Firebase Auth (email/password)
6. Copy your Firebase config values into `.env.local`

### 4. Set up Stripe

1. Get your API keys from [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
2. For local webhook testing, use the Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
3. Copy the webhook signing secret into `.env.local`

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 6. Access the admin dashboard

Navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login) and sign in with the admin credentials you created in Firebase Auth.

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── layout.tsx                  # Root layout with Navbar, Footer, AuthProvider
│   ├── about/page.tsx              # About page
│   ├── itineraries/
│   │   ├── page.tsx                # Itinerary listing
│   │   └── [slug]/page.tsx         # Itinerary detail + Stripe checkout
│   ├── shop/
│   │   ├── page.tsx                # Product listing
│   │   └── [slug]/page.tsx         # Product detail + Stripe checkout
│   ├── ugc/
│   │   ├── page.tsx                # UGC content feed
│   │   └── [slug]/page.tsx         # Individual post
│   ├── admin/
│   │   ├── layout.tsx              # Auth guard + admin nav
│   │   ├── login/page.tsx          # Admin login
│   │   ├── page.tsx                # Admin dashboard
│   │   ├── itineraries/page.tsx    # Itinerary CRUD
│   │   ├── products/page.tsx       # Product CRUD
│   │   └── ugc/page.tsx            # UGC CRUD
│   ├── checkout/success/page.tsx   # Payment success page
│   └── api/stripe/
│       ├── checkout/route.ts       # Create Stripe session
│       └── webhook/route.ts        # Handle Stripe webhooks
├── components/
│   ├── ui/                         # shadcn/ui primitives
│   ├── layout/                     # Navbar, Footer
│   └── admin/                      # TiptapEditor
├── lib/
│   ├── firebase.ts                 # Firebase client SDK init
│   ├── firestore.ts                # Firestore CRUD helpers
│   ├── stripe.ts                   # Stripe server SDK init
│   ├── auth-context.tsx            # React auth context + provider
│   └── utils.ts                    # Utility functions (cn)
└── types/
    └── index.ts                    # TypeScript interfaces
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import the repo in [vercel.com](https://vercel.com)
3. Add all environment variables in the Vercel dashboard
4. Deploy

### Stripe Webhook for Production

Create a webhook endpoint in the Stripe dashboard pointing to:
```
https://your-domain.com/api/stripe/webhook
```

Subscribe to the `checkout.session.completed` event.

## Color Theme

The site uses a Brazil x Australia inspired palette:

| Color | Hex | Usage |
|---|---|---|
| Brazil Green | `#009C3B` | Primary / CTAs |
| Gold | `#FFD700` | Accent / highlights |
| Brazil Blue | `#002776` | Deep accents |
| Outback Ochre | `#C1440E` | Warm accents |
| Sandy Beige | `#F5E6C8` | Backgrounds |
| Sky Blue | `#4DACD4` | Secondary accents |
