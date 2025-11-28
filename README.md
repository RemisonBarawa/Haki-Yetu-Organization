
# Haki Yetu Organization - Human Rights Platform

A comprehensive web platform for Haki Yetu Organization, championing human rights for marginalized communities across Kenya's coastal counties through legal advocacy, community empowerment, and transformative justice.

## 🌟 About Haki Yetu

Since 2008, Haki Yetu Organization has been at the forefront of defending human rights in Kenya's coastal region, focusing on land rights, gender justice, governance, and community empowerment across Mombasa, Kilifi, and Kwale counties.

## 🚀 Live Platform

**Production URL**: https://lovable.dev/projects/498a5a44-2785-4409-81d4-93266e1e53c4

## 📋 System Overview

### Core Features

#### 🏠 Public Portal
- **Homepage**: Interactive hero section with organizational mission and impact statistics
- **Articles**: Legal insights, case studies, and human rights content
- **Gallery**: Visual documentation of community work and events
- **Resources**: Legal documents, guides, and educational materials
- **Community Voice**: Citizen engagement platform for public feedback

#### 👥 Community Engagement
- **Citizen Forum**: Lightweight authentication for community participation
- **Post Creation**: Citizens can share concerns, suggestions, and questions
- **Categorization**: Posts organized by land rights, gender issues, governance, legal aid
- **Interaction System**: Like and comment functionality for community engagement
- **Location Tagging**: Geographic context for community issues

#### 🔐 Staff Management
- **Role-Based Access**: Admin and Staff roles with different permissions
- **Content Management System (CMS)**: Full CRUD operations for content
- **Dashboard**: Analytics and system overview
- **Multi-Step Authentication**: Comprehensive signup workflow

### Technical Architecture

#### Frontend Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom animations and responsive design
- **UI Components**: shadcn/ui component library
- **State Management**: TanStack React Query for server state
- **Routing**: React Router DOM for client-side navigation
- **Icons**: Lucide React for consistent iconography

#### Backend & Database
- **Backend-as-a-Service**: Supabase
- **Database**: PostgreSQL with real-time subscriptions
- **Authentication**: Supabase Auth with role-based permissions
- **Storage**: Supabase Storage for media files
- **Real-time**: WebSocket connections for live updates

#### Key Dependencies
```json
{
  "@supabase/supabase-js": "^2.50.0",
  "@tanstack/react-query": "^5.56.2",
  "react": "^18.3.1",
  "react-router-dom": "^6.26.2",
  "tailwindcss": "latest",
  "lucide-react": "^0.462.0",
  "date-fns": "^3.6.0"
}
```

## 🗄️ Database Schema

### Core Tables

#### `profiles`
- User profile information for staff members
- Links to Supabase auth.users

#### `user_roles`
- Role-based access control (admin, staff)
- Permissions management

#### `citizens`
- Lightweight citizen registration
- Name and email only for community engagement

#### `citizen_posts`
- Community forum posts with categories
- Status management (draft, published, responded)
- Location and photo support

#### `post_comments` & `post_interactions`
- Community engagement features
- Like and comment functionality

#### Content Tables
- `articles`: Legal insights and case studies
- `resources`: Educational materials and documents
- `gallery_items`: Photo documentation
- `events`: Organizational events and activities

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ and npm
- Git for version control

### Installation Steps

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase credentials

# Start development server
npm run dev
```

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🚀 Deployment

### Lovable Platform (Recommended)
1. Open [Lovable Project](https://lovable.dev/projects/498a5a44-2785-4409-81d4-93266e1e53c4)
2. Click Share → Publish
3. Custom domain available in Project Settings → Domains

### Alternative Deployment Options
- **Vercel**: Connect GitHub repo for automatic deployments
- **Netlify**: Static site deployment with form handling
- **GitHub Pages**: Free hosting for static sites

## 👨‍💻 Development Guidelines

### Code Structure
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── auth/            # Authentication components
│   ├── citizen-forum/   # Community engagement
│   ├── cms/             # Content management
│   └── navigation/      # Navigation components
├── pages/               # Route components
├── hooks/               # Custom React hooks
├── integrations/        # External service integrations
└── lib/                 # Utility functions
```

### Best Practices
- **Component Size**: Keep components under 50 lines when possible
- **File Organization**: One component per file with descriptive names
- **TypeScript**: Strict typing for all props and data structures
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: WCAG 2.1 compliance for inclusive design

### Styling Guidelines
- **Consistent Colors**: Green (#16a34a) and Blue (#2563eb) theme
- **Typography**: Clear hierarchy with proper contrast ratios
- **Animations**: Subtle transitions for enhanced UX
- **Dark Theme**: Primary dark background with accent colors

## 🔐 Authentication & Authorization

### User Types
1. **Public Users**: Browse content, view community posts
2. **Citizens**: Create posts, comment, like (lightweight auth)
3. **Staff**: Content management, moderate community
4. **Admin**: Full system access, user management

### Permission Matrix
| Feature | Public | Citizen | Staff | Admin |
|---------|--------|---------|-------|-------|
| View Content | ✅ | ✅ | ✅ | ✅ |
| Create Posts | ❌ | ✅ | ✅ | ✅ |
| Moderate Posts | ❌ | ❌ | ✅ | ✅ |
| CMS Access | ❌ | ❌ | ✅ | ✅ |
| User Management | ❌ | ❌ | ❌ | ✅ |

## 📊 Analytics & Monitoring

### Key Metrics
- Community engagement rates
- Post interaction statistics
- Content performance analytics
- User registration trends

### Performance Optimization
- **Code Splitting**: Dynamic imports for route-based splitting
- **Image Optimization**: WebP format with lazy loading
- **Caching**: React Query for intelligent data caching
- **Bundle Size**: Regular analysis and optimization

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Code Review Process
- All changes require PR review
- Automated testing on PR submission
- Manual testing for UI/UX changes
- Documentation updates for new features

## 🆘 Support & Maintenance

### Common Issues & Solutions
- **Build Errors**: Check dependency versions and TypeScript types
- **Database Issues**: Verify Supabase connection and schema
- **Authentication Problems**: Check environment variables and Supabase config
- **Performance Issues**: Use React DevTools and Lighthouse for analysis

### Monitoring
- Real-time error tracking
- Performance monitoring
- User feedback collection
- Regular security audits

## 📞 Contact & Support

- **Organization**: Haki Yetu Organization
- **Focus Areas**: Land Rights, Gender Justice, Governance, Legal Aid
- **Service Areas**: Mombasa, Kilifi, Kwale Counties, Kenya
- **Technical Support**: Via Lovable platform or GitHub issues

## 📜 License

This project is developed for Haki Yetu Organization's mission of defending human rights and empowering marginalized communities in Kenya.

---

*Built with ❤️ for human rights advocacy and community empowerment*
