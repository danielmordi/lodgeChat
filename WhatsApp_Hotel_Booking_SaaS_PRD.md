# Product Requirements Document (PRD)
## WhatsApp Hotel Booking SaaS (B2B)

**Status:** MVP – Authoritative  
**Primary Goal:** Seamless hotel reservations via WhatsApp  
**Secondary Goal:** Safe, controlled promotions to past guests  
**Design Philosophy:** Constrained, compliant, scalable

---

## 1. Product Overview

Most hotels (especially in Nigeria and similar markets) do not have websites or online booking systems, but **WhatsApp is already their primary booking channel**.

This SaaS product helps hotels:
- Accept reservations via WhatsApp
- Guide guests through a structured booking flow
- Collect payment to hold reservations
- Manage bookings and conversations in a dashboard
- (Paid add-on) Send controlled promotional broadcasts to past guests

---

## 2. Target Users

### Primary (B2B)
- Small–mid size hotels
- Guest houses
- Short-let apartments

### Geography
- Initial focus: **Nigeria**
- Designed for global rollout

---

## 3. Core Product Principles (Locked)

- WhatsApp-first
- Reservations > everything else
- No AI in MVP
- No cold messaging
- No free-form bulk messaging
- Hotels never touch messaging infrastructure
- Logical multi-tenancy only (Phase 1)

---

## 4. Phase 1: Logical Multi-Tenancy (MVP)

### Architecture
- Single database
- Shared tables
- Logical isolation via `hotel_id`
- No subdomains
- No separate databases per hotel
- No third-party tenancy packages

This minimizes complexity while ensuring safe data separation.

---

### Tenant Definition
A **Hotel is a tenant**.

Each hotel has:
- One or more users (owner, staff)
- One WhatsApp number
- One Twilio subaccount (owned by platform)
- Its own guests, bookings, conversations, analytics, broadcasts

---

## 5. Authentication & Access Control

- Laravel Starter Kit authentication is used
- Each authenticated user belongs to **exactly one hotel**

```text
users
- id
- hotel_id
- role (owner, staff)
```

### Authorization Rules

- Users may only access records where:

```php
hotel_id = auth()->user()->hotel_id
```

- Cross-hotel access is strictly forbidden

---

## 6. Query Scoping (Mandatory)

- All reads and writes **must** be scoped by `hotel_id`
- Applies to:
  - controllers
  - jobs
  - webhooks
  - commands
- Optional global Eloquent scopes may be used to prevent leaks

---

## 7. Messaging Architecture (Authoritative – Phase 1)

### Ownership & Control Model

- The platform owns **one primary Twilio account**
- Multiple **Twilio subaccounts** exist under the primary account
- Each hotel is assigned **exactly one subaccount**
- Hotels never see or configure Twilio credentials
- Hotels interact with WhatsApp only through the SaaS dashboard

---

### WhatsApp / Twilio Isolation

- Each hotel maps to:
  - one WhatsApp number
  - one Twilio subaccount
- All messages, conversations, and webhooks:
  - resolve to a hotel
  - are scoped by `hotel_id`
- Messaging limits and abuse controls are enforced **per hotel**

> Even though Twilio infrastructure is shared at the parent level, hotels are fully isolated at the application and subaccount level.

---

### Message Composition Rules (Strict)

Hotels **cannot**:

- Send free-form bulk messages
- Paste arbitrary marketing text
- Upload contacts and immediately message them
- Run automated follow-ups

All outbound messages must be:

- Template-based
- Contextual
- Event-triggered or gated
- Queued and rate-limited

---

## 8. Promotions & Broadcasts (Paid Add-On)

- Broadcasts only to **past guests of the same hotel**
- Guest lists are tenant-scoped
- Guest upload allowed **once during onboarding**
- Promotions are:
  - paid
  - campaign-based
  - rate-limited
  - optionally manually approved

No hotel can view or message another hotel's guests.

---

## 9. Database Schema (MVP)

### hotels

| column            | type   |
| ----------------- | ------ |
| id                | bigint |
| name              | string |
| slug              | string |
| phone             | string |
| address           | text   |
| timezone          | string |
| status            | enum   |
| twilio_account_id | bigint |

---

### users

| column   | type   |
| -------- | ------ |
| id       | bigint |
| hotel_id | bigint |
| name     | string |
| email    | string |
| password | string |
| role     | enum   |

---

### room_types

| column          | type    |
| --------------- | ------- |
| id              | bigint  |
| hotel_id        | bigint  |
| name            | string  |
| price_per_night | decimal |
| max_guests      | int     |
| active          | boolean |

---

### guests

| column   | type    |
| -------- | ------- |
| id       | bigint  |
| hotel_id | bigint  |
| name     | string  |
| phone    | string  |
| source   | enum    |
| opted_in | boolean |

---

### conversations

| column        | type   |
| ------------- | ------ |
| id            | bigint |
| hotel_id      | bigint |
| guest_id      | bigint |
| status        | enum   |
| current_state | string |

---

### messages

| column              | type   |
| ------------------- | ------ |
| id                  | bigint |
| hotel_id            | bigint |
| conversation_id     | bigint |
| direction           | enum   |
| body                | text   |
| provider_message_id | string |

---

### bookings

| column       | type    |
| ------------ | ------- |
| id           | bigint  |
| hotel_id     | bigint  |
| guest_id     | bigint  |
| room_type_id | bigint  |
| check_in     | date    |
| nights       | int     |
| amount       | decimal |
| status       | enum    |

---

### payments

| column     | type    |
| ---------- | ------- |
| id         | bigint  |
| hotel_id   | bigint  |
| booking_id | bigint  |
| provider   | enum    |
| reference  | string  |
| amount     | decimal |
| status     | enum    |

---

### broadcasts

| column       | type      |
| ------------ | --------- |
| id           | bigint    |
| hotel_id     | bigint    |
| title        | string    |
| message      | text      |
| scheduled_at | timestamp |
| price        | decimal   |

---

### twilio_accounts

| column      | type   |
| ----------- | ------ |
| id          | bigint |
| name        | string |
| account_sid | string |
| auth_token  | string |
| status      | enum   |

---

## 10. 🧱 Hard Guarantees (Non-Negotiable)

### Tenancy

- Every tenant table **must** include `hotel_id`
- No query may bypass tenant scoping
- Background jobs and webhooks must enforce tenant context

### Messaging

- No outbound message without resolved hotel + subaccount
- No synchronous sends
- Pausing one hotel must not affect others
- Abuse must fail **closed**

### Promotions

- No cross-hotel messaging
- No immediate messaging after uploads
- Cooldowns and caps enforced in code

---

## 11. 📦 Twilio → WhatsApp Cloud API Migration Checklist

### Pre-Migration

- Messaging provider abstraction exists
- Webhooks resolve hotel independently of provider
- Templates documented
- Provider flag on hotel record

### Cloud API Setup

- Meta Business Account
- WABA created
- Phone numbers registered
- Webhooks verified
- Tokens encrypted

### Dual-Run

- Enable Cloud API per hotel
- Verify inbound/outbound
- Monitor delivery & replies

### Cutover

- Stop new Twilio onboardings
- Migrate in batches
- Decommission subaccounts

---

## 12. 🧪 Tenancy & Messaging Abuse Test Cases

### Tenancy

- Cross-hotel access impossible
- ID guessing blocked
- Jobs enforce tenant scope

### Messaging

- Cannot exceed per-hotel caps
- Cannot exceed per-guest caps
- Paused hotel cannot send
- Subaccount failure isolated

### Abuse

- Volume spikes auto-pause hotel
- Low reply rate flags account
- Manual review required to re-enable

---

## 13. Success Metrics (MVP)

- Active hotels
- Successful bookings
- Payment conversion rate
- Zero Twilio warnings
- Hotel retention

---

## 14. Design Principle (Final)

> **Messaging is a shared risk surface.
> The system must always fail closed.**

This PRD is authoritative for MVP development.
