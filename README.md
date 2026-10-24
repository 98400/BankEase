# 🏦 BankEase

A full-stack online banking demo built with **React**, **Express** and **PostgreSQL**.

## ✨ Features
- 🔐 Secure login with JWT and bcrypt-hashed passwords
- 💳 View and freeze/unfreeze debit and credit cards
- 💸 Transfer money between accounts
- 🧾 Pay bills
- 📜 Transaction history
- 👤 Profile page

## 🛠️ Tech Stack
- **Frontend:** React, Vite, React Router
- **Backend:** Node.js, Express, JWT
- **Database:** PostgreSQL

## 🚀 How to Run
1. Clone the repo: `git clone https://github.com/98400/BankEase.git`
2. Create a PostgreSQL database named `bankease`
3. In the `server` folder, create a `.env` file:
   ```
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/bankease
   PORT=5000
   JWT_SECRET=any-long-random-string
   ```
4. Install and start the backend:
   ```
   cd server
   npm install
   node index.js
   ```
5. In a second terminal, from the project root:
   ```
   npm install
   npm run dev
   ```
6. Open the URL Vite prints (usually http://localhost:5173)

Tables and demo users are created automatically on first start.

## 🔑 Demo Login
Customer ID: `BANK123` / Password: `bank@123`

## 👤 Author
Swapnil - [github.com/98400](https://github.com/98400)
