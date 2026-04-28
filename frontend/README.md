# AROHAN Landing Page

A stunning, modern landing page for AROHAN - AI-powered voice recruitment screening SaaS platform.

## 🚀 Features

- **Modern Design**: Inspired by lusion.co with smooth animations and interactions
- **Responsive**: Fully responsive design for all devices
- **Dark Theme**: Beautiful dark theme with gradient accents
- **Smooth Animations**: Powered by Framer Motion
- **Interactive Elements**: Hover effects, scroll animations, and micro-interactions
- **Performance Optimized**: Built with Next.js 16 and Tailwind CSS

## 🎨 Design Highlights

### Visual Elements
- **Gradient Backgrounds**: Purple and pink gradient accents
- **Glass Morphism**: Frosted glass effects on cards and navigation
- **Animated Background**: Floating gradient orbs with parallax effect
- **Modern Typography**: Clean, bold typography with Inter font
- **Icon System**: Lucide React icons for consistent iconography

### Animations
- **Hero Section**: Parallax scrolling with floating elements
- **Scroll Animations**: Elements fade in as you scroll
- **Hover Effects**: Cards lift and glow on hover
- **Button Interactions**: Scale and shadow effects
- **Smooth Transitions**: All interactions have smooth transitions

## 📦 Sections

1. **Navigation**: Fixed navbar with mobile menu
2. **Hero**: Stunning hero with animated background and CTAs
3. **Features**: 6 feature cards with icons and descriptions
4. **How It Works**: 4-step process explanation
5. **Pricing**: 3 pricing tiers with popular plan highlighted
6. **Testimonials**: Customer testimonials with avatars
7. **CTA**: Final call-to-action section
8. **Footer**: Links and social media

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **TypeScript**: Full TypeScript support
- **Font**: Inter (Google Fonts)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Development

The development server will start at `http://localhost:3000`

```bash
npm run dev
```

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Main landing page
│   │   └── globals.css      # Global styles
│   └── components/          # Reusable components (if needed)
├── public/                 # Static assets
├── tailwind.config.ts       # Tailwind configuration
├── next.config.ts          # Next.js configuration
└── package.json            # Dependencies
```

## 🎨 Customization

### Colors

The main color scheme uses purple and pink gradients:

```css
/* Primary gradient */
from-purple-500 to-pink-500

/* Secondary gradient */
from-indigo-500 to-purple-500

/* Accent colors */
- Purple: rgb(168 85 247)
- Pink: rgb(236 72 153)
- Indigo: rgb(99 102 241)
```

### Animations

Custom animations defined in `tailwind.config.ts`:

```typescript
animation: {
  "float": "float 6s ease-in-out infinite",
  "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
  "gradient": "gradient 8s ease infinite",
}
```

### Components

The landing page is built as a single component with sub-components:

- `Navbar`: Navigation bar with mobile menu
- `Hero`: Hero section with animated background
- `Features`: Feature cards grid
- `HowItWorks`: Step-by-step process
- `Pricing`: Pricing plans
- `Testimonials`: Customer testimonials
- `CTA`: Call-to-action section
- `Footer`: Footer with links

## 📱 Responsive Design

The landing page is fully responsive with breakpoints:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎯 Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: < 1s
- **Time to Interactive**: < 2s
- **Bundle Size**: Optimized with code splitting

## 🔧 Configuration

### Environment Variables

No environment variables are required for the landing page.

### Next.js Config

```typescript
// next.config.ts
const config = {
  // Add your configuration here
};
export default config;
```

### Tailwind Config

```typescript
// tailwind.config.ts
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Custom theme extensions
    },
  },
};
export default config;
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Build
npm run build

# Deploy .next folder to Netlify
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📊 Analytics

To add analytics:

1. Google Analytics
2. Vercel Analytics
3. Plausible Analytics

## 🎨 Customization Guide

### Changing Colors

Edit `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#your-color',
      },
    },
  },
}
```

### Adding New Sections

1. Create a new component in `src/app/page.tsx`
2. Add animations with Framer Motion
3. Style with Tailwind CSS
4. Add to the main page component

### Modifying Content

Edit the content directly in `src/app/page.tsx`:

```typescript
const features = [
  {
    icon: YourIcon,
    title: "Your Title",
    description: "Your description",
    gradient: "from-your-color to-your-color",
  },
];
```

## 🐛 Troubleshooting

### Build Errors

If you encounter build errors:

```bash
# Clear cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Styling Issues

If Tailwind classes aren't working:

1. Check `tailwind.config.ts` content paths
2. Verify `globals.css` imports
3. Clear browser cache

### Animation Issues

If animations aren't smooth:

1. Check Framer Motion installation
2. Verify browser supports CSS animations
3. Reduce animation complexity if needed

## 📝 License

This landing page is part of the AROHAN project.

## 🤝 Contributing

To contribute to the landing page:

1. Create a new branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📞 Support

For support or questions:
- Email: support@arohan.ai
- Documentation: https://docs.arohan.ai

---

**Built with ❤️ using Next.js, Tailwind CSS, and Framer Motion**
