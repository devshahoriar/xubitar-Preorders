# Getting Started

## Setup

1. **Clone or extract** the project files.
2. **Install dependencies**:
   ```bash
   pnpm install
   ```
3. **Set up the database**:
   ```bash
   pnpm db:push
   pnpm db:generate
   ```

## Running the Application

To start the development server:
```bash
pnpm dev
```

## Database Seeding

To seed the database with initial/mock data:
```bash
pnpm db:seed
```



Requirements
1. Preorder List Page (refer to UI-1.png)
The page should list all preorders. The following must be handled on the backend (from the database), not on the client only:
- Filters: All, Active, Inactive ✅
- Sort (the sort options are shown in UI-2.png) ✅
- Pagination ✅
If no preorders are found, you may display an empty state in the table in whatever way you see fit.

2. Status Switch and Delete 
- The status switch (Active / Inactive) should update the record directly in the database and reflect the change with clear feedback on the frontend.✅
- The delete button should remove the record from the database and reflect in the list.✅

3. Selection Checkboxes
- The row checkbox should work.✅
- The select all checkbox should also work.✅
- No action buttons need for selection✅ (I show selected count in footer)

4. Update Preorder (refer to UI-3.png)
- Clicking the pencil icon on a preorder should open the Update Preorder page.✅
- All fields must be pre-filled with that preorder's existing values.✅
- Saving should update the preorder in the database accordingly.✅

5. Create Preorder
- Clicking Create Preorder on the list page (UI-1.png) should open the create page (UI-3.png).✅
- This page should be able to create a new preorder record in the database.✅

6. Navigation and Loading States (on the create and update page, UI-3.png)
- The Cancel button and the Save Changes button should redirect to the list page (UI-1.png) after a successful database update.✅
- A loader state must be shown while saving.✅
- The Back button should also redirect to the list page (UI-1.png).✅