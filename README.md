# Dental Clinic Management Server

Dental Clinic Management Server is the developer-friendly backend for Dental Clinic Management. It powers authentication, clinic management, services, appointments, and admin workflows through a modular Express + Prisma API.

## Live URLs

- Production API Root: [https://dental-clinic-management-server.vercel.app](https://dental-clinic-management-server.vercel.app)
- Versioned API Base: [https://dental-clinic-management-server.vercel.app/api/v1](https://dental-clinic-management-server.vercel.app/api/v1)
- Production Client: [https://dental-clinic-management-client.vercel.app](https://dental-clinic-management-client.vercel.app)

## Features

- Better Auth based auth system with email/password and Google login
- JWT access and refresh token flow
- Prisma-powered PostgreSQL data layer
- Modular route structure for auth, users, clinics, dentists, services, appointments, and admins
- Cloudinary-based media upload pipeline
- OTP email verification and password reset flow
- Clinic membership, dentist management, and appointment scheduling
- TypeScript-first codebase with validation and reusable utilities

## Technologies Used

- Node.js
- Express 5
- TypeScript
- Prisma
- PostgreSQL
- Better Auth
- Zod
- Cloudinary
- Nodemailer
- JWT
- Vercel

## Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Create your environment file

Copy `.env.example` to `.env` and update the values.

Required variables include:

```env
PORT=5000
DATABASE_URL=your_database_url
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password
EMAIL_FROM="Acadex <your_email@gmail.com>"
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SUPER_ADMIN_EMAIL=your_super_admin_email
SUPER_ADMIN_PASSWORD=your_super_admin_password
```

### 3. Start the development server

```bash
npm run dev
```

The API will run at [http://localhost:5000](http://localhost:5000).

### 4. Build the server

```bash
npm run build
```

### 5. Run the server

```bash
npm run start
```

## API Modules

- `/api/v1/auth`
- `/api/v1/users`
- `/api/v1/clinics`
- `/api/v1/dentists`
- `/api/v1/services`
- `/api/v1/appointments`
- `/api/v1/admins`
