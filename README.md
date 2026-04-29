# Insighta Labs+ | Web Portal
Premium Analytics Interface

**Live Portal**: [https://stage-3-web-six.vercel.app](https://stage-3-web-six.vercel.app)

## 🎨 UI/UX Features
- **Modern Aesthetics**: Built with Next.js, featuring glassmorphism, dark mode, and mesh gradients for a premium data intelligence feel.
- **Real-time Feedback**: Custom toast notification system for immediate user feedback on auth and search actions.
- **Resilient Sessions**: Implements a global `fetch` interceptor that handles automatic 401 retries and silent token refreshes via secure cookies.
- **Responsive Design**: Optimized for everything from mobile phones to high-resolution desktop monitors.

## 🔒 Security
- **HTTP-Only Cookies**: JWT tokens are stored in `HttpOnly, Secure, SameSite=None` cookies, preventing XSS-based theft and enabling cross-domain session persistence.
- **CSRF Protection**: Enforced via SameSite cookie policies and mandatory `X-API-Version` header verification.
