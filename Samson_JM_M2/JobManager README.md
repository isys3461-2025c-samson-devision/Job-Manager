# Job Manager System – Full Documentation

This repository contains the **Job Manager system**, consisting of a **Spring Boot backend**, **React frontend**, and **Stripe-based subscription & payment system**.

---

## System URLs

- **Backend:** http://localhost:8080  
- **Frontend:** http://localhost:3000  

---

## Backend API Endpoints

### Authentication & OAuth (Public)

POST   /api/auth/signup  
POST   /api/auth/login  
GET    /api/auth/verify-email  
GET    /oauth2/authorization/{provider}  
GET    /oauth2/success  

---

### Company APIs (ROLE_COMPANY required)

GET    /api/company/me  
PUT    /api/company/me  
GET    /api/company/dashboard  
GET    /api/company/applicants  

---

### Public Company & Job APIs

GET    /api/companies  
GET    /api/companies/{companyId}  

GET    /api/jobposts  
GET    /api/search  

---

### Applicant APIs (Public)

GET    /api/applicants/**  

---

### Integration APIs (API Key based)

POST   /api/integration/companies  
POST   /api/integration/job-posts  

Header required:  
X-API-KEY: <integration-api-key>

---

### Payment & Subscription APIs

POST   /api/payments/checkout  
GET    /api/payments/my  

---

### Stripe Webhook (Public – No JWT)

POST   /api/payments/webhook/stripe  

---

## Frontend Application Routes

/ → Splash Screen  
/signin → Sign In  
/signup → Sign Up  
/verify-email → Verify Email  
/oauth/success → OAuth Success  
/oauth/complete-profile → Complete Profile  

/company/dashboard → Company Dashboard  
/company/applicants → Company Applicants  
/company/profile → Company Profile  
/company/subscription → Subscription Plans  

/subscription/payment → Stripe Checkout  
/subscription/payment/success → Payment Success  
/subscription/payment/cancel → Payment Cancelled  

---

## Running the Backend

./mvnw clean  
./mvnw spring-boot:run  

Backend runs at http://localhost:8080

---

## Running the Frontend

npm install  
npm start  

Frontend runs at http://localhost:3000

---

## Stripe Webhook Setup

stripe listen --forward-to localhost:8080/api/payments/webhook/stripe  

Add webhook signing secret to backend config:

stripe:
  webhook:
    secret: whsec_********

---

## Run Order

1. Backend  
2. Frontend  
3. Stripe CLI  
4. Open frontend  
5. Trigger checkout

---

## Notes

- Stripe webhooks bypass JWT  
- Security via Stripe Signature  
- Subscription enforced by backend  

---

System is fully operational.
