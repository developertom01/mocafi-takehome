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
- Server -> Client communication will rely on https/tls encryption to keep payload secured.
  **Out of scope:** End to end encryption can be implemented to ensure an additional layer of security for payload if it is needed

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

4. Run test (Best suggestion is to run test in the running docker container)

```sh
   npm run test:container
```

After this run `npm run dev` if you want to run the application manually to recreate application database (Test drops database)

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

4. Run test

```sh
 npm run test
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

**Development issue:**

To understand thought process during development and how I resolved issues, checkout these issues on the PR

- [Auto-Encryption with MongoDB Client Encryption Not Working](https://github.com/developertom01/mocafi-takehome/issues/2)
- [MongoDB Client-Side Field Level Encryption (CSFLE) Failure](https://github.com/developertom01/mocafi-takehome/issues/1)

## Technologies Used

- DB: Mongodb
- Language: Typescript (server and client) running on Nodejs 20.x.x or later
- Docker & Docker compose
- Http Server: Expressjs
- Frontend Library: React

**Conclusion:**

The application meets the basic requirements for **PCI-DSS compliance** and offers a straightforward experience for users.
