# API examples (Postman / curl)

Base URL: `http://localhost:5000`  
Set **Authorization: Bearer `<token>`** for protected routes after login.

All successful JSON responses use `{ success: true, ... }` unless noted.

---

## Health

```http
GET /api/health
```

---

## Auth

### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "patient@example.com",
  "password": "securepass123"
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "patient@example.com",
  "password": "securepass123"
}
```

Response includes `data.token` — use as Bearer token.

---

## Users (protected)

### Get current user

```http
GET /api/users/me
Authorization: Bearer <token>
```

### Update profile (placeholder health fields only)

```http
PATCH /api/users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Ada",
  "lastName": "Lovelace",
  "phone": "+15555550100",
  "healthPlaceholder": "General wellness goals — not for real PHI"
}
```

---

## Products

### List (public)

```http
GET /api/products
GET /api/products?active=false
```

### Get one (public)

```http
GET /api/products/<mongoIdOrSlug>
```

### Create (admin only)

```http
POST /api/products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "New Supplement",
  "slug": "new-supplement",
  "description": "Short description",
  "priceCents": 1999,
  "image": "https://example.com/image.jpg",
  "sku": "SKU-1"
}
```

_Promote a user to `admin` in MongoDB:_

```js
db.users.updateOne({ email: "patient@example.com" }, { $set: { role: "admin" } })
```

---

## Orders (protected)

### My orders

```http
GET /api/orders/my
Authorization: Bearer <token>
```

### All orders (admin)

```http
GET /api/orders/all
Authorization: Bearer <admin_token>
```

### Single order (owner or admin)

```http
GET /api/orders/<orderId>
Authorization: Bearer <token>
```

---

## Payments — Stripe Checkout (protected)

Requires `STRIPE_SECRET_KEY`, `STRIPE_SUCCESS_URL`, `STRIPE_CANCEL_URL` in `.env`.

### Create checkout session

```http
POST /api/payments/create-checkout-session
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    { "productId": "<MongoObjectId>", "quantity": 1 }
  ],
  "shippingSnapshot": {
    "line1": "123 Main St",
    "city": "Austin",
    "state": "TX",
    "postalCode": "78701",
    "country": "US"
  }
}
```

Response: `data.url` — open in browser to complete test payment.

### Webhook (Stripe → your server)

Configure endpoint: `POST /api/payments/webhook` with signing secret `STRIPE_WEBHOOK_SECRET`.  
For local testing use Stripe CLI:

```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```

---

## Subscriptions (protected)

Requires `STRIPE_PRICE_MEMBERSHIP` (recurring Price ID from Stripe Dashboard).

```http
POST /api/subscriptions/create-checkout-session
Authorization: Bearer <token>
```

### My subscriptions

```http
GET /api/subscriptions/my
Authorization: Bearer <token>
```

---

## Appointments (protected)

### Book (medical or spiritual)

```http
POST /api/appointments
Authorization: Bearer <token>
Content-Type: application/json

{
  "scheduledAt": "2026-04-15T14:00:00.000Z",
  "timeSlot": "14:00",
  "notes": "First consultation — demo",
  "category": "spiritual"
}
```

`category`: `medical` | `spiritual`

### My appointments

```http
GET /api/appointments/my
Authorization: Bearer <token>
```

### List all (admin)

```http
GET /api/appointments
Authorization: Bearer <admin_token>
```

### Update status (admin)

```http
PATCH /api/appointments/<appointmentId>/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{ "status": "confirmed" }
```

---

## curl quick test

```bash
curl -s http://localhost:5000/api/health
curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@test.com","password":"password123"}'
```
