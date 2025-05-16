# 🏠 ZariBuySell - Fullstack Marketplace for Renting, Buying & Selling

**ZariBuySell** is a powerful and scalable fullstack web platform that allows users to **rent**, **buy**, or **sell** products and services. Whether it's real estate, electronics, vehicles, or personal items, ZariBuySell connects customers and vendors in a modern and intuitive environment with robust admin management and secure backend services.

## 🌐 Live Links

- 🛍️ **Main Marketplace:** [https://www.zaribuysell.com/](https://www.zaribuysell.com/)
- 🔧 **Admin Dashboard:** [https://admin.zaribuysell.com/](https://admin.zaribuysell.com/)
- ⚙️ **Backend API:** [https://api.zaribuysell.com/](https://api.zaribuysell.com/)

---

## 📦 Key Features

### 🛍️ Main Site (Customer View)
- Explore listings for **sale**, **rent**, and **buy requests**
- Product and service filtering by category, type (rent/sell), location, and price
- Rich product pages with galleries, descriptions, and contact options
- Add items for rent or sale (if authenticated)
- Messaging or inquiry system 
- User dashboard: manage listings, profile, saved items

### 🧑‍💼 Admin Dashboard
- Secure login for admins
- Manage all listings (approve/reject)
- CRUD for users, categories, and items
- Dashboard insights: total users, listings, views, etc.
- Reports and analytics

### 🔧 Backend (API)
- RESTful API for all marketplace operations
- Authentication & Authorization using JWT and cookies
- Role-based access 
- Secure and validated endpoints for:
  - Listings (add, update, delete)
  - Image uploads
  - User profile management
  - Admin moderation tools
- MongoDB as the database
- Cloud storage support for images

---

## 🛠️ Tech Stack

| Layer     | Technology                   |
|-----------|------------------------------|
| Frontend  | React (Client & Admin)       |
| Backend   | Node.js, Express             |
| Database  | MongoDB                      |
| Auth      | JWT, Cookies/Sessions        |
| File Uploads | Multer, S3                |
| Deployment | AWS, Railway, VPS, Nginx    |
| UI        | TailwindCSS, Shadcn UI       |

---

## 🚀 Getting Started Locally

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/zaribuysell.git
cd zaribuysell
```

