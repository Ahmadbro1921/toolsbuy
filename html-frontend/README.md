# ToolsBuy - Standalone Pure HTML5, CSS3 & JavaScript Frontend

This directory contains the **complete, standalone static frontend** for **ToolsBuy** (modeled after AmazonToolsBuy). It has **zero dependencies**, requires no Node.js build process, and can be hosted anywhere or opened directly on any computer.

---

## 📁 File Structure

- `index.html` — Homepage featuring the hero section, live stats counters, animated tools marquee, pre-made packages, "Why Choose Us" grid, 3-step workflow, interactive FAQ accordion, floating WhatsApp button, and footer.
- `plans.html` — Pricing packages (Basic PKR 3,500, Standard PKR 4,000, Premium PKR 5,000) and the **Interactive Custom Package Builder** with live price calculation and combo discounts.
- `checkout.html` — Manual payment checkout with copyable EasyPaisa, JazzCash, Meezan Bank, and USDT details, TID submission, and instant order confirmation modal.
- `dashboard.html` — User Dashboard with the **1-Click Tool Launch Station** (simulated cloud browser session), active 30-day subscription countdown, order history table, referral link generator, and support ticket widget.
- `admin.html` — Admin Operations Desk with revenue metrics, pending payment verifications (1-click Approve / Reject), packages management, and support ticket replies.
- `css/style.css` — Ultra-premium Vanilla CSS design system (dark ink `#0b0f17`, emerald green `#10a37f`, glassmorphism, responsive grid, micro-animations).
- `js/app.js` — Client-side database script (`localStorage`) that syncs orders between checkout, user dashboard, and admin desk.

---

## 🚀 How to Run

### Method 1: Double-Click (Offline in Browser)
Simply double-click `index.html` to open it directly in Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari.

### Method 2: Live Server / Local Web Server
If you use VS Code, right-click `index.html` and choose **"Open with Live Server"**.

Alternatively, you can run Python's built-in web server from this directory:
```bash
python -m http.server 8080
```
Then visit: `http://localhost:8080`

### Method 3: Deploy to GitHub Pages / cPanel / Netlify
1. Upload the files inside this `html-frontend/` folder directly to the root of your `public_html` (on cPanel) or push to a GitHub Pages repository branch.
2. It will instantly serve with 100% functionality and fast global CDN performance.
