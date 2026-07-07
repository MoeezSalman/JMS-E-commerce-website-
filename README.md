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
| Database | **Prisma 7** + **PostgreSQL** · **Vercel Blob** for uploaded media |
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
Point `DATABASE_URL` at a Postgres database (a free [Neon](https://neon.tech) DB works great), then push the schema:
```bash
npx prisma db push
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

## ☁️ Deployment (Vercel)

JMS is built to run on **Vercel** with a **serverless Postgres** database and **Vercel Blob** for uploaded media.

1. **Import the repo** on Vercel → _New Project_ → select this GitHub repo.
2. **Add a database:** project → **Storage** → **Create** → **Postgres (Neon)** → connect. This auto‑injects `DATABASE_URL`.
3. **Add Blob storage:** project → **Storage** → **Create** → **Blob** → connect. This auto‑injects `BLOB_READ_WRITE_TOKEN`.
4. **Add the remaining env vars** (Settings → Environment Variables):
   `JWT_SECRET`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_STORE_NAME`, `NEXT_PUBLIC_CURRENCY`.
5. **Create the tables** once (with `DATABASE_URL` pointing at the new DB):
   ```bash
   npx prisma db push
   ```
6. **Redeploy**, then open `/api/dev/seed` once to create the admin account.

> ℹ️ The database and uploaded media live in managed cloud services — nothing sensitive is committed to git.

---

## 📜 License

Released under the **MIT License**.

---

<div align="center">

Built with ❤️ for **JMS** · Orders delivered over WhatsApp 📲

</div>
