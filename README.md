# Pastebin-Lite

A lightweight, high-performance application to create and share text pastes with custom constraints. Built with **Next.js**, **Neon DB (PostgreSQL)**, and **Drizzle ORM**, and managed with **Bun**.

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine.
- A [Neon.tech](https://neon.tech/) account (or any PostgreSQL instance).

### Local Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/s-mahali/pastebinlite.git
   cd pastebin-lite
   ```

2. **Install dependencies:**

   ```bash
   bun install
   ```

3. **Environment Variables:**

   Create a `.env` file in the root directory and add your database connection string and the test mode flag:

   ```env
   DATABASE_URL=postgresql://user:password@hostname/neondb?sslmode=require
   TEST_MODE=1 
   ```

4. **Database Schema:**

   Push the schema to your Neon database:

   ```bash
   bunx drizzle-kit push or npx drizzle-kit push

   ```

5. **Run the development server:**

   ```bash
   bun dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 🛠 Persistence Layer

I chose **Neon DB (PostgreSQL)** as the persistence layer for this application.

- **Why Neon?**  
  It is a serverless-native PostgreSQL database that integrates seamlessly with Vercel. Unlike in-memory storage, Neon ensures that pastes persist across serverless function cold starts and restarts.

- **Drizzle ORM:**  
  Used for type-safe database interactions and migrations. It provides a lightweight wrapper that matches SQL syntax closely while ensuring runtime safety.

---

## 🏗 Important Design Decisions

### 1. Atomic Updates (Concurrency Control)

To satisfy the requirement of not serving a paste beyond its constraints under concurrent load, the application uses **Atomic SQL Updates**. Instead of a "Fetch then Update" approach (which is prone to race conditions), the GET request performs an `UPDATE` with a `WHERE` clause that checks `remaining_views > 0` and `expires_at > NOW()` in a single transaction. If the update fails to affect any rows, the app immediately returns a `404`.

### 2. Deterministic Expiry Testing

The application implements the `x-test-now-ms` header logic. When `TEST_MODE=1` is active, the system ignores the actual server time and uses the provided header timestamp for all expiry calculations. This ensures that automated tests can reliably verify TTL logic.

### 3. Safe Rendering

To prevent **XSS (Cross-Site Scripting)**, the paste content is rendered using standard React JSX curly braces `{paste.content}` inside a `<pre>` tag. React automatically escapes strings, ensuring that any malicious `<script>` tags provided in the paste are treated as plain text and not executed.

### 4. Shared Routes

I utilized Next.js **Dynamic Routes** (`/p/[id]`) for HTML views and **API Routes** (`/api/pastes/[id]`) for JSON data. This separation allows the application to serve both a human-readable UI and a machine-readable API using the same underlying logic.

---

## 🧪 Deployment

The application is optimized for deployment on **Vercel**.

| Setting           | Value            |
| ----------------- | ---------------- |
| **Build Command** | `bun run build`  |
| **Install Command** | `bun install`  |