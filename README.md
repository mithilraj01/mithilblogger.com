# GEOFORGE Enterprise

**AI Search Visibility & GEO/AEO Optimization Platform**

A production-ready, full-stack SaaS application for optimizing content visibility across AI search engines like ChatGPT and Gemini.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🚀 Features

### Core Modules

1. **GEO Content Optimizer** - Transform content for higher AI search rankings
2. **AEO Answer Engine** - Generate perfect answers for AI assistants
3. **AI Visibility Score Engine** - Track performance across ChatGPT and Gemini
4. **Competitor GEO Rewrite Engine** - Analyze and outrank competitor content
5. **Auto-Publish** - Push optimized content to WordPress and custom webhooks
6. **Subscription Billing** - Stripe-powered plan management
7. **Admin Analytics Panel** - Comprehensive business metrics

### Technical Highlights

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript with strict type safety
- **Styling**: Tailwind CSS with glassmorphism design
- **UI Components**: Custom-built shadcn/ui components
- **Animations**: Framer Motion for smooth interactions
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: NextAuth with credential provider
- **Payments**: Stripe integration (test and production ready)
- **AI**: OpenAI GPT-4 and Google Gemini integration
- **Security**: Input validation, rate limiting, plan enforcement

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **MongoDB Atlas** account and cluster
- **OpenAI API** key
- **Google Gemini API** key
- **Stripe** account (test mode keys)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mithilblogger.com
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Configure the following environment variables:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/geoforge?retryWrites=true&w=majority

# Authentication
NEXTAUTH_SECRET=your-secret-key-here-minimum-32-characters-long
NEXTAUTH_URL=http://localhost:3000

# AI Providers
OPENAI_API_KEY=sk-your-openai-api-key
GEMINI_API_KEY=your-gemini-api-key

# Stripe (Test Mode)
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
STRIPE_PRICE_STARTER=price_starter_id
STRIPE_PRICE_GROWTH=price_growth_id
STRIPE_PRICE_AGENCY=price_agency_id

# Application
APP_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Copy the output and use it as `NEXTAUTH_SECRET`.

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🚢 Production Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Configure environment variables in Vercel dashboard

4. Set up Stripe webhook:
   - Go to Stripe Dashboard → Developers → Webhooks
   - Add endpoint: `https://your-domain.vercel.app/api/billing/webhook`
   - Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

## 📁 Project Structure

```
/
├── app/                        # Next.js App Router
│   ├── (marketing)/           # Marketing pages (landing, pricing)
│   ├── (auth)/                # Authentication pages
│   ├── (dashboard)/           # Protected dashboard routes
│   ├── api/                   # API routes
│   │   ├── auth/             # Authentication endpoints
│   │   ├── geo/              # GEO optimization
│   │   ├── aeo/              # AEO generation
│   │   ├── score/            # Visibility scoring
│   │   ├── competitor/       # Competitor analysis
│   │   ├── publish/          # Content publishing
│   │   ├── billing/          # Stripe integration
│   │   └── admin/            # Admin endpoints
│   └── dashboard/            # Dashboard pages
├── components/                # React components
│   ├── ui/                   # Base UI components
│   └── ...                   # Feature components
├── lib/                       # Utilities and services
│   ├── ai.ts                 # AI service layer (OpenAI + Gemini)
│   ├── auth.ts               # NextAuth configuration
│   ├── billing.ts            # Stripe utilities
│   ├── db.ts                 # MongoDB connection
│   ├── planLimits.ts         # Usage tracking
│   └── rateLimit.ts          # Rate limiting
├── models/                    # Mongoose schemas
│   ├── User.ts
│   ├── Website.ts
│   ├── Content.ts
│   ├── Optimization.ts
│   ├── VisibilityScore.ts
│   ├── Subscription.ts
│   └── UsageLog.ts
├── config/                    # Configuration files
│   ├── plans.ts              # Subscription plans
│   └── constants.ts          # App constants
└── types/                     # TypeScript types
    └── index.ts              # Shared type definitions
```

## 🔐 Security

See [SECURITY.md](./SECURITY.md) for detailed security information.

### Key Security Features

- Input validation with Zod
- Rate limiting on all API routes
- Plan-based usage limits
- Password hashing with bcryptjs
- Secure session management
- Stripe webhook signature verification
- Environment variable protection
- No hardcoded secrets

## 📊 Subscription Plans

### Starter - $49/month
- 30 AI optimizations/month
- 1 website
- GEO & AEO tools
- Basic analytics
- Email support

### Growth - $199/month (Most Popular)
- 200 AI optimizations/month
- 5 websites
- Advanced competitor analysis
- Auto-publish to WordPress
- Priority support
- API access

### Agency - $499/month
- Unlimited optimizations
- Unlimited websites
- White-label options
- Dedicated account manager
- Custom integrations
- Full API access

## 🧪 API Routes

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login (via NextAuth)
- `GET /api/auth/me` - Current user info

### GEO Optimization
- `POST /api/geo/optimize` - Optimize content for AI search

### AEO Generation
- `POST /api/aeo/generate` - Generate AI-ready answers

### Visibility Scoring
- `POST /api/score/test` - Calculate AI visibility score

### Competitor Analysis
- `POST /api/competitor/scan` - Analyze competitor content

### Publishing
- `POST /api/publish/push` - Publish to WordPress/webhook

### Billing
- `POST /api/billing/create-checkout-session` - Create Stripe checkout
- `POST /api/billing/webhook` - Stripe webhook handler
- `GET /api/billing/subscription` - Current subscription info

### Admin
- `GET /api/admin/metrics` - Admin analytics (admin only)

## 🎨 Design System

### Glassmorphism Theme
- Dark background with gradient overlays
- Semi-transparent glass panels
- Backdrop blur effects
- Gradient borders and glows
- Smooth animations with Framer Motion

### Color Palette
- Primary: Cyan (#00D4FF)
- Secondary: Purple (#A855F7)
- Accent: Emerald (#10B981)
- Background: Near-black (#0a0a0f)

## 🧩 Tech Stack Details

| Category | Technology |
|----------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | Custom (inspired by shadcn/ui) |
| Animations | Framer Motion |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Auth | NextAuth.js |
| Payments | Stripe |
| AI - LLM | OpenAI GPT-4 |
| AI - Multimodal | Google Gemini |
| Validation | Zod |
| Icons | Lucide React |
| Deployment | Vercel |

## 📝 Development Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@geoforge.enterprise or open an issue in the repository.

## 🎯 Roadmap

- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] API documentation with Swagger
- [ ] Webhook event logs
- [ ] Content scheduling
- [ ] Team collaboration features
- [ ] White-label customization
- [ ] Additional CMS integrations

---

**Built with ❤️ for the AI-first future**
