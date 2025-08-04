# 🌐 Mini-LinkedIn Community Platform

A full-stack professional networking platform built with modern web technologies, featuring real-time interactions, cloud-based image storage, and responsive design.

## 🚀 Live Demo

**🔗 [Live Demo URL](https://frontend-v2-lyart-ten.vercel.app/login)**

**👤 Demo Account:**
- **Email:** `abhijeet@gmail.com`
- **Password:** `12345678`

## 📱 Features

### ✨ Core Features
- 🔐 **User Authentication** - Secure JWT-based login/registration
- 👤 **User Profiles** - Customizable profiles with bio and profile pictures
- 📝 **Post Creation** - Create posts with text and images
- 🖼️ **Image Upload** - Cloud-based image storage with Cloudinary
- 📱 **Responsive Design** - Mobile-first design for all devices
- 🗑️ **Post Management** - Delete your own posts
- 👥 **Community Feed** - View all community posts in real-time

### 🎯 Advanced Features
- ☁️ **Cloud Storage** - Automatic image optimization and CDN delivery
- 🎨 **Smart Image Processing** - Auto-cropping, compression, and format conversion
- 📱 **Mobile Optimized** - Touch-friendly interface with proper tap targets
- 🔒 **Security** - Rate limiting, CORS protection, and input validation
- ⚡ **Performance** - Optimized loading and caching strategies
- 🎭 **User Experience** - Smooth animations and intuitive navigation

## 🛠️ Tech Stack

### Frontend
- **⚛️ Next.js 14** - React framework with App Router
- **📘 TypeScript** - Type-safe development
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **🧩 shadcn/ui** - Modern UI component library
- **🖼️ Next.js Image** - Optimized image handling
- **🔥 React Hot Toast** - Beautiful notifications

### DevOps & Tools
- **🌐 Vercel** - Frontend deployment
- **🚂 Railway/Render** - Backend deployment
- **🔒 Helmet** - Security middleware
- **⚡ Express Rate Limit** - API rate limiting
- **🌍 CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
mini-linkedin-platform/
├── frontend-v2/                 # Next.js React application
│   ├── app/                 # Next.js 14 App Router
│   │   ├── page.tsx         # Home page (feed)
│   │   ├── login/           # Authentication pages
│   │   ├── register/        
│   │   └── profile/[id]/    # Dynamic profile pages
│   ├── components/          # Reusable UI components
│   │   └── ui/             # shadcn/ui components
│   ├── hooks/              # Custom React hooks
│   └── package.json        # Frontend dependencies
├──     README.md               # Project documentation
```

## 🚀 Quick Start

### 1. Clone Repository
\`\`\`bash
git clone https://github.com/Abhi3110200/frontend-v2
cd frontend-v2
\`\`\`

### 2. Frontend Setup
\`\`\`bash
npm install

# Create environment file (optional)
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Start development server
npm run dev
\`\`\`

Frontend will run on: **http://localhost:3000**

## 🌐 Deployment

### Frontend Deployment (Vercel)

1. **Connect to Vercel:**
   \`\`\`bash
   npm i -g vercel
   vercel --prod
   \`\`\`

2. **Set Environment Variables:**
   - `NEXT_PUBLIC_API_URL=http://localhost:8000`

3. **Auto-deploy:** Pushes to main branch deploy automatically

### Authentication Endpoints
```http
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
GET  /api/auth/user        # Get current user

