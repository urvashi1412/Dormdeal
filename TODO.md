# TODO: Migrate to shared Axios instance

## Completed
- [x] 1. Create `client/src/api.js` with shared Axios instance
- [x] 2. Fix `AuthContext.js` — replace `axios.post` → `api.post`
- [x] 3. Update `HomePage.js` — import api, replace axios.get → api.get
- [x] 4. Update `CreateListing.js` — import api, replace axios.post → api.post
- [x] 5. Update `ListingPage.js` — import api, replace axios.get/delete/patch → api.get/delete/patch
- [x] 6. Update `MessagesPage.js` — import api, replace axios.get/post → api.get/post
- [x] 7. Update `MyListings.js` — import api, replace axios.get → api.get
- [x] 8. Update `ProfilePage.js` — import api, replace axios.get/patch → api.get/patch
- [x] 9. Remove `"proxy"` from `client/package.json`
- [x] 10. Delete old `client/api.js`

