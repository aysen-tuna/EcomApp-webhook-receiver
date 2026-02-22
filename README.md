🔔 EcomApp Webhook Receiver
Stripe webhook receiver built with Express + TypeScript + Firebase Admin.

This service securely listens to Stripe events and updates Firestore after successful payments.

✨ What This Service Does

When a payment succeeds:
	1.	Stripe sends webhook
	2.	Signature is verified
	3.	Order is saved to Firestore
	4.	Product stock is decreased
	5.	User can see order in My Orders

🧱 Tech Stack
	•	Node.js
	•	Express
	•	TypeScript
	•	Stripe SDK
	•	Firebase Admin
	•	Firestore

⚙️ Environment Variables

Create a .env file:
PORT=8000
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SIGNING_SECRET=whsec_...
FIREBASE_SERVICE_ACCOUNT={...full JSON...}

**Never commit .env to GitHub

🚀 Getting Started
npm install
npm run dev
http://localhost:8000

🔌 Stripe Webhook Setup
Stripe Dashboard → Developers → Webhooks → “Add endpoint”
Events: checkout.session.completed
Endpoint URL: https://....vercel.app/v1/stripe/webhooks


Real checkout flow
	1.	Complete a test payment in EcomApp
	2.	Wait for redirect
	3.	Check:
	•	Firestore → users/{uid}/orders
	•	Firestore → products stock
	•	My Orders page
