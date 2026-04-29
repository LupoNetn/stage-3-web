# Insighta Labs+ | Web Portal
Premium Analytics Interface

## 🎨 UI/UX Features
- **Modern Aesthetics**: Built with Next.js, featuring glassmorphism, dark mode, and mesh gradients.
- **Real-time Feedback**: Custom toast notification system for all status updates.
- **Resilient Sessions**: Implements a global `fetch` interceptor that handles automatic 401 retries and silent token refreshes.

## 🔒 Security
- **HTTP-Only Cookies**: Tokens are never accessible via JavaScript, preventing XSS-based theft.
- **CSRF Protection**: Enforced via SameSite cookie policies and custom header verification.
