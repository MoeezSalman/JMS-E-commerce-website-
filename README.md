<div align="center">

# 🛍️ JMS — Modern E‑Commerce Store

### A sleek, animated storefront + full admin console. Browse, add to cart, and order in seconds — every order lands straight in your WhatsApp.

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Three.js](https://img.shields.io/badge/Three.js-3D-000000?style=for-the-badge&logo=three.js)](https://threejs.org/)

</div>

---

## ✨ Overview

**JMS** is a production‑style e‑commerce web app with a **beautiful animated storefront** and a **complete admin dashboard**. It ships with a 3D landing hero, dark & light themes, interactive product cards, a WhatsApp‑powered checkout, and real analytics — no payment gateway required.

> 🧾 **How ordering works:** customers fill in their delivery details at checkout, the order is recorded in the database, and a **pre‑filled WhatsApp message** (products, total, address, phone) opens straight to the store's number so the order can be confirmed in one tap.

---

## 🚀 Features

### 🛒 Storefront (customers)
- 🎬 **3D animated landing page** (React Three Fiber shopping bag + floating parcels)
- 🌗 **Dark & light themes** with a smooth toggle
- 🔎 **Search, category filters & sorting** on the shop page
- 🃏 **Interactive product cards** with a 3D tilt effect
- 🖼️ **Product detail** with image/video gallery, stock & price
- 🔐 **Login required to buy** — a sign‑in popup appears on add‑to‑cart
- 🛍️ **Cart** that persists across sessions
- 📲 **WhatsApp checkout** — order details sent to the store instantly
- 👤 **Profile**: change password, theme, avatar (upload/preset), contact info
- 📦 **Purchase history** with the ability to **cancel orders** (cancellation is messaged too)
- 📄 **No‑return policy**, acknowledged at checkout

### 🛠️ Admin console
- 🔑 **Fixed admin login**
- ➕ **Add / edit / delete products** with **image & video uploads**, price, stock & category
- 🗂️ **Create categories** on the fly
- 📊 **Analytics dashboard**: revenue, items sold, orders, average order value
- 📈 **12‑month revenue & orders graphs** (Recharts)
- 🏆 **Sales‑by‑product** breakdown
- 🚫 **Cancellations view** — cancelled orders are automatically excluded from revenue

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript** |
| Styling | **Tailwind CSS v4** · CSS‑variable theming · **Framer Motion** |
| 3D | **React Three Fiber** + **@react-three/drei** |
| Charts | **Recharts** |
| State | **Zustand** (cart) · **next‑themes** (theme) |
| Database | **Prisma 7** + **SQLite** (via `better-sqlite3` driver adapter) |
| Auth | Custom **JWT cookie** sessions (`jose` + `bcryptjs`) |
| Ordering | **WhatsApp** click‑to‑chat deep links |

---

## 🏁 Getting Started

### Prerequisites
- **Node.js 20+**
- **npm**

### 1) Clone & install
```bash
git clone https://github.com/MoeezSalman/JMS-E-commerce-website-.git
cd JMS-E-commerce-website-
npm install
```

### 2) Configure environment
```bash
cp .env.example .env
```
Then edit `.env` (at minimum set a strong `JWT_SECRET`). See [`.env.example`](.env.example) for all variables.

### 3) Set up the database
```bash
npx prisma migrate deploy   # creates dev.db + tables
```

### 4) Run it
```bash
npm run dev
```
Open **http://localhost:3000** 🎉

### 5) Create the admin account
With the dev server running, visit once:
```
http://localhost:3000/api/dev/seed
```
This seeds the fixed admin. Then log in at `/login`.

> **Default admin (change in `.env`):** `admin@jms.com` / `JMS@Admin2026`

---

## 🗄️ Viewing the database

```bash
npx prisma studio
```
Opens a GUI to browse & edit every table. Prisma prints the local URL (e.g. `http://localhost:5555`).

---

## 📁 Project Structure

```
src/
├─ app/                 # routes (storefront, admin, API route handlers)
│  ├─ admin/            # admin dashboard, products, orders
│  ├─ api/              # auth, orders, profile, admin products, uploads
│  ├─ products/         # catalog + product detail
│  ├─ checkout/         # checkout → order → WhatsApp
│  └─ profile/          # account, security, appearance, order history
├─ components/          # UI (navbar, hero, product card, forms, charts…)
├─ lib/                 # db, auth, data access, analytics, whatsapp, cart
└─ generated/prisma/    # generated Prisma client (auto‑built on install)
```

---

## ☁️ Deployment

JMS is a **stateful full‑stack app** — it needs a **writable database** and a place to store **uploaded media**. Two solid paths:

### Option A — Fast, keep SQLite (persistent‑disk host)
Deploy the Node server to **Railway / Fly.io / a VPS** with a **persistent volume**, then set:
```env
DATABASE_URL="file:/data/jms.db"
UPLOAD_DIR="/data/uploads"
JWT_SECRET="<long-random-string>"
```
Build & start:
```bash
npm run build && npm run db:deploy && npm start
```
Uploaded files are served through the built‑in `/uploads/[...]` route from `UPLOAD_DIR`.

### Option B — Serverless (Vercel)
Vercel's filesystem is read‑only/ephemeral, so switch the two stateful pieces to managed services:
- **Database →** a hosted Postgres (e.g. Neon / Vercel Postgres) — change the Prisma datasource + adapter.
- **Uploads →** an object store (e.g. Vercel Blob / Supabase Storage).

Then import the repo on Vercel and add the env vars.

> ℹ️ The database and uploaded files are intentionally **git‑ignored**, so each environment gets its own data.

---

## 📜 License

Released under the **MIT License**.

---

<div align="center">

Built with ❤️ for **JMS** · Orders delivered over WhatsApp 📲

</div>
