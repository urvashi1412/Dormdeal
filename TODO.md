# DormDeal Seed Data Task

- [ ] Create `server/scripts/seed.js` to generate realistic VIT demo users, 60–80 listings, and ~30 message threads.
- [ ] Create `server/scripts/reset.js` to wipe demo data (Users/Listing/Message collections) so `npm run reset` returns to a clean state.
- [ ] Update `server/package.json` to add `npm run seed` and `npm run reset` scripts.
- [ ] Seed using backend-supported enums only (`Listing.category`, `Listing.status`).
- [ ] Ensure listing `photos` use real Unsplash/static image URLs (no UI placeholders).
- [ ] Ensure message `roomId` format is `${listingId}_${buyerId}`.
- [ ] Run `npm run reset` then `npm run seed` and verify key pages render correctly.

