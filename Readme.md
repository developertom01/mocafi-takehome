# MOCAFI Account Management

A simple application that allows Mocafi users to enter their credit card information to retrieve the account information.

## Key Considerations for the App

- **Ease of Use (Simplicity):** Focused on a user-friendly interface.
- **Data Security:** Designed to be **PCI-DSS compliant** to ensure data protection.

## Directions for Use

- Provide account information (**card number and PIN**) to retrieve account details.

## Security Features

- **Credit Card Encryption:** All credit card information is **encrypted** in the database using [MongoDB Client-Side Field Level Encryption (CSFLE)](https://www.mongodb.com/docs/manual/core/queryable-encryption/about-qe-csfle/).
- **PIN Hashing:** PINs are **hashed** on the server since they only need to be compared and not decrypted.

---

## Development Setup

### Server

#### Requirements

- **Docker**
- **Node.js 20.x.x or later** (Optional for local development)

#### Server Scripts

1. Navigate to the Server folder:

```sh
cd server
```

2. Set up environment variables:

```sh
cp .env.example .env
```

3. Start the development server:

```sh
npm run dev
```

**Purpose of Script:**

- **Encryption Setup:**
  - Creates **encryption master key** if it does not exist (`master.txt`).
  - Sets up **Data Encryption Key (DEK)** for **MongoDB Client-Side Field Level Encryption (CSFLE)**.
- **Database Initialization:**
  - Creates **collections** with the required schema.
  - Establishes **indexes** and **constraints**.
- **Development Server Launch:**
  - Starts the Express.js development server.

**Available Endpoints:**

1. **Swagger API Documentation:**
   ```
   http://localhost:3000/api-doc
   ```
2. **MongoDB Visualizer:**
   ```
   http://localhost:8081
   ```

### Client

#### Requirements

- **Node.js 20.x.x or later**

#### Client Scripts

1. Navigate to the Client folder:

```sh
cd client
```

2. Install dependencies:

```sh
npm install
```

3. Start the development server:

```sh
npm start
```

**Access the Client:**

```
http://localhost:3001
```

---

## Manual Test Experience

On application startup, **sample data** is seeded in the database (see `server/bin/seed.ts`).

### Test Credentials:

1. **PIN:** "1234"  
   **Card Number:** "0234567890724456"

2. **PIN:** "1234"  
   **Card Number:** "1734567890103458"

3. **PIN:** "1234"  
   **Card Number:** "1834567890103456"

**Conclusion:**
The application meets the basic requirements for **PCI-DSS compliance** and offers a straightforward experience for users.
