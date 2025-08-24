# TinyURL Frontend

A modern, Web3-inspired frontend for the TinyURL shortening service built with Next.js, TypeScript, and shadcn/ui.

## 🚀 Features

- **Modern UI**: Web3-inspired cyberpunk design with neon colors and glass morphism
- **Responsive Design**: Mobile-first responsive design that works on all devices
- **URL Shortening**: Intuitive interface for creating shortened URLs with custom aliases
- **Analytics Dashboard**: Comprehensive analytics with interactive charts and insights
- **Link Management**: Full CRUD operations for managing your shortened URLs
- **Real-time Updates**: Dynamic updates and smooth animations using Framer Motion
- **Dark Theme**: Cyberpunk-inspired dark theme with neon accents

## 🎨 Design System

The application features a unique Web3-inspired design system with:

- **Color Palette**: Neon cyan, purple, green, and pink accents on dark backgrounds
- **Typography**: JetBrains Mono for that authentic cyberpunk feel
- **Animations**: Smooth transitions and micro-interactions using Framer Motion
- **Glass Morphism**: Translucent cards with backdrop blur effects
- **Neural Network**: Animated background with particle connections

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom Web3 theme
- **UI Components**: shadcn/ui with custom cyberpunk variants
- **Animations**: Framer Motion
- **Charts**: Recharts for analytics visualization
- **Icons**: Lucide React
- **State Management**: React hooks and Context API
- **API**: Axios for HTTP requests

## 📦 Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd tinyurl/frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. **Run the development server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page with URL shortening
│   ├── dashboard/         # Link management dashboard
│   ├── analytics/         # Analytics and insights
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── web3/             # Web3-inspired custom components
│   ├── layout/           # Layout components
│   ├── url/              # URL-related components
│   └── analytics/        # Analytics components
├── lib/                  # Utilities and configurations
│   ├── utils.ts          # Common utilities
│   └── api.ts            # API client and services
└── types/                # TypeScript type definitions
```

## 🎯 Key Components

### Web3 Components
- **CyberBackground**: Animated neural network background
- **NeonButton**: Glowing neon buttons with hover effects
- **CyberCard**: Glass morphism cards with cyber borders

### Features
- **ShortenForm**: Main URL shortening interface
- **Dashboard**: Link management with search and filters
- **ClickChart**: Interactive analytics charts
- **Navbar**: Responsive navigation with Web3 styling

## 🎨 Customization

### Colors
The Web3 color palette can be customized in `tailwind.config.ts`:

```typescript
colors: {
  neon: {
    cyan: "#00D4FF",
    purple: "#B845ED", 
    green: "#39FF14",
    pink: "#FF10F0",
    yellow: "#FFED4A",
  }
}
```

### Animations
Custom animations are defined in the CSS classes:
- `animate-glow`: Pulsing glow effect
- `animate-pulse-neon`: Neon pulse animation
- `animate-slide-in`: Slide in from left
- `cyber-grid`: Animated grid background

## 🔧 Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

## 🌐 API Integration

The frontend integrates with the TinyURL backend API:

- **URL Shortening**: `POST /v1/shorten`
- **Link Management**: `GET/PUT/DELETE /v1/urls`
- **Analytics**: `GET /v1/analytics/{id}`
- **Redirects**: `GET /{shortCode}`

API client is configured in `src/lib/api.ts` with automatic token handling.

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Collapsible navigation
- Touch-optimized interactions
- Adaptive layouts for all screen sizes

## ⚡ Performance

- **Code Splitting**: Automatic code splitting with Next.js
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Analyze bundle with `npm run analyze`
- **Lazy Loading**: Components loaded on demand

## 🔒 Security

- **API Token Management**: Automatic token storage and refresh
- **XSS Protection**: Sanitized inputs and outputs
- **CORS**: Configured for secure API communication
- **Environment Variables**: Sensitive data in environment variables

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🎉 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the excellent component library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Lucide](https://lucide.dev/) for beautiful icons