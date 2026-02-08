Below is a **clear, MVP-ready PRD for the Verification Workflow**, designed to plug directly into your existing PRD and implementation plan.

This PRD is intentionally **practical**, **low-ops**, and **abuse-resistant**, not bureaucratic.

---

````md
# Product Requirements Document (PRD)
## Hotel Verification Workflow (MVP)

---

## 1. Purpose

The verification workflow exists to:

- Prevent fake hotels from abusing WhatsApp messaging
- Protect shared messaging infrastructure (Twilio subaccounts)
- Allow legitimate hotels to go live quickly
- Unlock platform capabilities gradually based on trust

**Important principle:**
> Registration ≠ Trust  
> Trust must be earned before messaging and promotions are enabled.

---

## 2. Scope (MVP)

### In Scope
- Trust-based hotel activation
- WhatsApp number ownership verification
- Basic business existence proof
- Capability gating based on trust level

### Out of Scope (MVP)
- Manual document verification
- Government ID or CAC verification
- Automated KYC
- Third-party business verification APIs

---

## 3. Definitions

### Hotel Status
Controls whether the hotel can operate live.

- `pending` – Created but locked
- `active` – Allowed to accept bookings
- `paused` – Temporarily disabled (abuse or admin action)
- `suspended` – Permanently disabled

---

### Trust Level
Controls what the hotel is allowed to do.

| Trust Level | Meaning |
|------------|--------|
| 0 | Untrusted (default) |
| 1 | WhatsApp number verified |
| 2 | Business existence verified |
| 3 | Trusted (good history + payments) |

---

## 4. Verification Flow Overview

### Step 1: Registration (Untrusted)
- User registers
- Hotel is created automatically
- User is assigned as **owner**

**System State**
- `hotels.status = pending`
- `hotels.trust_level = 0`

**Allowed**
- Configure rooms
- Build storefront draft
- View dashboard

**Blocked**
- Messaging
- Publishing storefront
- Accepting bookings
- Promotions

---

### Step 2: Email Verification
Handled by Laravel Starter Kit.

**Requirement**
- Email must be verified before proceeding further

---

### Step 3: WhatsApp Number Ownership Verification (Critical)

**Purpose**
To ensure the hotel controls the WhatsApp number they claim.

**Flow**
1. Owner enters WhatsApp number
2. System sends a one-time code to that number
3. Owner enters code in dashboard
4. Code is validated (expires in 10 minutes)

**On Success**
- `trust_level = 1`
- Hotel becomes eligible for limited live mode

---

### Step 4: Business Existence Verification (Lightweight)

**Purpose**
Reduce fake hotels without heavy ops.

**Requirement (Choose ONE)**
- Google Maps listing URL  
OR
- Instagram business page URL

**Validation**
- URL reachable
- Name loosely matches hotel name
- Stored for audit (manual review only if flagged)

**On Success**
- `trust_level = 2`
- Hotel eligible for full MVP features

---

### Step 5: Go Live

Once minimum requirements are met:

- Email verified
- WhatsApp number verified

**System Updates**
- `hotels.status = active`

---

## 5. Capability Gating by Trust Level

| Capability | TL 0 | TL 1 | TL 2 | TL 3 |
|---------|------|------|------|------|
| Configure profile | ✅ | ✅ | ✅ | ✅ |
| Publish storefront | ❌ | ❌ | ✅ | ✅ |
| Accept bookings | ❌ | ✅ (limited) | ✅ | ✅ |
| WhatsApp messaging | ❌ | ✅ (low caps) | ✅ | ✅ |
| Promotions | ❌ | ❌ | ❌ | ✅ |
| Higher limits | ❌ | ❌ | ❌ | ✅ |

---

## 6. Database Changes (MVP)

### hotels (add columns)

```text
status ENUM(pending, active, paused, suspended)
trust_level TINYINT DEFAULT 0
whatsapp_verified_at TIMESTAMP NULL
business_verification_url TEXT NULL
````

---

### verification_codes

```text
id
hotel_id
channel ENUM(whatsapp)
code
expires_at
used_at
created_at
```

---

## 7. Security & Abuse Rules (Hard)

* Verification codes:

  * Single-use
  * Time-limited
  * Rate-limited per hotel
* Hotels cannot message until `trust_level >= 1`
* Uploaded guests cannot be messaged until `trust_level >= 2`
* Promotions require `trust_level >= 3`
* Admin can pause or downgrade trust level at any time

---

## 8. User Experience Requirements

* Clear onboarding checklist
* Visual progress indicator
* Clear explanation of why verification is required
* Non-blocking tone (not accusatory)

---

## 9. Acceptance Criteria (Must Pass)

### Functional

* Hotel cannot send messages at trust level 0
* WhatsApp verification code expires correctly
* Trust level updates unlock correct capabilities
* Business URL is required before storefront publish

---

### Security

* Verification codes cannot be reused
* Hotel cannot bypass trust gating via API
* Manual role changes do not override trust rules

---

## 10. Success Metrics

* % of hotels completing WhatsApp verification
* % of hotels reaching trust level 2
* Reduction in abuse/spam incidents
* Zero Twilio warnings from unverified hotels

---

## 11. Design Principle

> Trust is not granted at signup.
> Trust is earned through proof and behavior.

This verification workflow is mandatory for MVP launch.

```

---

### What this gives you
- ✅ You can proceed with your implementation plan safely
- ✅ Fake hotels can register, but **cannot cause damage**
- ✅ Real hotels can go live quickly
- ✅ You have a clean upgrade path later (manual review, KYC, etc.)

If you want next, I can:
- map this workflow to **Laravel routes + middleware**
- generate **Inertia pages for verification**
- write **automated tests** for trust gating
```
