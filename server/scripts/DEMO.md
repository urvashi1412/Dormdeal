# DormDeal Demo Data

Populate the database with realistic VIT Chennai marketplace data for demos and portfolio showcases.

## Setup

1. Copy `env.example` to `.env` and set `MONGO_URI`
2. From the `server/` directory:

```bash
npm run reset   # clear all data
npm run seed    # populate demo data
```

## Demo login (recommended)

| Field    | Value            |
|----------|------------------|
| Email    | `demo@vit.ac.in` |
| Password | `Demo@2026`      |

This account has **5 active + 3 sold** listings, inbox conversations, and unread messages.

## Other student accounts

All use password: `Password@123`

- `priya22@vit.ac.in`
- `rahul.cs@vit.ac.in`
- `megha.s@vit.ac.in`
- `isha04@vit.ac.in`
- …and 7 more (see `scripts/seedData.js`)

## What's seeded

| Data        | Count |
|-------------|-------|
| Users       | 12 VIT students |
| Listings    | 78 (books, electronics, furniture, clothes, kitchen, cycles, stationery, sports, other) |
| Messages    | ~30 conversation threads with realistic dialogue |
| Photos      | Curated Unsplash URLs per item type |

## Search examples

- `chair` → office chair, study table
- `python` → Python Crash Course
- `laptop` → MacBook, HP Pavilion

## Notes

- **Wishlist** is stored client-side (localStorage). Wishlist listing IDs are saved in the `demo_meta` MongoDB collection for reference.
- **Notifications** UI uses the messages unread count; demo seed leaves a few unread messages for the demo user.
- **Reserved/Draft** statuses are not in the schema — listings use `active` or `sold` only.
- Seed is idempotent: running `npm run seed` clears and repopulates everything.
