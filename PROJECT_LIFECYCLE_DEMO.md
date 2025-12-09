# Project Lifecycle State Machine - Demo Steps

## Overview
This document provides step-by-step instructions to verify the Project Lifecycle State Machine implementation in the portal.

## State Machine Flow
```
NEW → BRIEFED → QUOTED → CONTRACT_PENDING → CONTRACT_SIGNED → 
READY_TO_START → IN_PROGRESS → QA → COMPLETED → CLOSED
```

## Prerequisites
1. Backend server running on `http://localhost:5000`
2. Frontend running on `http://localhost:3000`
3. Valid user account (architect, admin, or client)
4. MongoDB connection established

---

## Demo Steps

### Step 1: Verify Initial State for New Projects

**Objective:** Confirm that new projects start with `NEW` status.

1. **Login** to the portal as an architect or admin
2. Navigate to **Projects** page (`/projects`)
3. Click **"Add Project"** button
4. Fill in project details:
   - Project Name: "Demo Project 1"
   - Client: "Test Client"
   - Location: "Test Location"
   - Category: "RESIDENTIAL"
   - **Status:** Should default to `NEW` (or select from dropdown)
5. Click **"Create Project"**
6. **Verify:** Project is created with status `NEW` (gray badge)

**Expected Result:**
- Project appears in the projects list
- Status badge shows `NEW` with gray color
- Project can be viewed and edited

---

### Step 2: Test Valid State Transitions

**Objective:** Verify that valid state transitions work correctly.

#### 2.1: NEW → BRIEFED
1. Find the project created in Step 1
2. Click **Edit** (pencil icon)
3. Change status from `NEW` to `BRIEFED`
4. Click **Save**
5. **Verify:** Status updates to `BRIEFED` (blue badge)

#### 2.2: BRIEFED → QUOTED
1. Edit the same project
2. Change status from `BRIEFED` to `QUOTED`
3. Click **Save**
4. **Verify:** Status updates to `QUOTED` (yellow badge)

#### 2.3: QUOTED → CONTRACT_PENDING
1. Edit the same project
2. Change status from `QUOTED` to `CONTRACT_PENDING`
3. Click **Save**
4. **Verify:** Status updates to `CONTRACT_PENDING` (orange badge)

#### 2.4: CONTRACT_PENDING → CONTRACT_SIGNED
1. Edit the same project
2. Change status from `CONTRACT_PENDING` to `CONTRACT_SIGNED`
3. Click **Save**
4. **Verify:** Status updates to `CONTRACT_SIGNED` (purple badge)

#### 2.5: Continue through remaining states
- `CONTRACT_SIGNED` → `READY_TO_START` (indigo badge)
- `READY_TO_START` → `IN_PROGRESS` (green badge)
- `IN_PROGRESS` → `QA` (pink badge)
- `QA` → `COMPLETED` (emerald badge)
- `COMPLETED` → `CLOSED` (dark gray badge)

**Expected Result:**
- All transitions complete successfully
- Status badges update with correct colors
- No error messages appear

---

### Step 3: Test Invalid State Transitions (Blocked)

**Objective:** Verify that invalid transitions are rejected.

#### 3.1: Skip Required States
1. Create a new project with status `NEW`
2. Try to change status directly to `QUOTED` (skipping `BRIEFED`)
3. Click **Save**
4. **Verify:** 
   - Error message appears: "Invalid state transition: Cannot transition from NEW to QUOTED"
   - Status remains `NEW`
   - Project is not updated

#### 3.2: Backward Transition
1. Create a project and transition it to `BRIEFED`
2. Try to change status back to `NEW`
3. Click **Save**
4. **Verify:**
   - Error message appears
   - Status remains `BRIEFED`

#### 3.3: Jump to Terminal State
1. Create a project with status `NEW`
2. Try to change status directly to `CLOSED`
3. Click **Save**
4. **Verify:**
   - Error message appears
   - Status remains `NEW`

#### 3.4: Transition from Terminal State
1. Create a project and transition it through all states to `CLOSED`
2. Try to change status from `CLOSED` to any other state
3. Click **Save**
4. **Verify:**
   - Error message appears
   - Status remains `CLOSED` (terminal state)

**Expected Result:**
- All invalid transitions are blocked
- Clear error messages explain why the transition is invalid
- Project status remains unchanged

---

### Step 4: Test Project Creation from Quote

**Objective:** Verify that projects created from quotes start at `CONTRACT_SIGNED`.

1. **Login** as an architect
2. Navigate to **Quotes** page (`/quote`)
3. Find an existing quote or create a new one
4. Click **"Start Project"** or **"Sign Contract"** button
5. Complete the contract signing process
6. **Verify:**
   - Project is created successfully
   - Project status is `CONTRACT_SIGNED` (purple badge)
   - Project appears in the projects list
   - Next valid states are: `READY_TO_START`

**Expected Result:**
- Projects from quotes start at `CONTRACT_SIGNED`
- Can transition to `READY_TO_START` next

---

### Step 5: Test State Transition API Endpoint

**Objective:** Verify the dedicated state transition endpoint.

#### 5.1: Using API (via Postman or curl)

1. **Get Valid Next States:**
   ```bash
   GET http://localhost:5000/api/projects/{projectId}/next-states
   Headers: Authorization: Bearer {token}
   ```
   **Expected Response:**
   ```json
   {
     "currentState": "NEW",
     "validNextStates": ["BRIEFED"]
   }
   ```

2. **Transition State:**
   ```bash
   POST http://localhost:5000/api/projects/{projectId}/transition
   Headers: Authorization: Bearer {token}
   Body: { "newState": "BRIEFED" }
   ```
   **Expected Response:**
   ```json
   {
     "message": "Project state transitioned from NEW to BRIEFED",
     "project": { ... }
   }
   ```

3. **Test Invalid Transition:**
   ```bash
   POST http://localhost:5000/api/projects/{projectId}/transition
   Body: { "newState": "COMPLETED" }
   ```
   **Expected Response:**
   ```json
   {
     "message": "Invalid state transition: Cannot transition from NEW to COMPLETED..."
   }
   ```

**Expected Result:**
- API returns valid next states
- Valid transitions succeed
- Invalid transitions return 400 error with clear message

---

### Step 6: Test State Colors and UI

**Objective:** Verify that status badges display correct colors.

1. Navigate to **Projects** page
2. Create or view projects in different states
3. **Verify** status badge colors:
   - `NEW`: Gray (`bg-gray-500`)
   - `BRIEFED`: Blue (`bg-blue-500`)
   - `QUOTED`: Yellow (`bg-yellow-500`)
   - `CONTRACT_PENDING`: Orange (`bg-orange-500`)
   - `CONTRACT_SIGNED`: Purple (`bg-purple-500`)
   - `READY_TO_START`: Indigo (`bg-indigo-500`)
   - `IN_PROGRESS`: Green (`bg-green-500`)
   - `QA`: Pink (`bg-pink-500`)
   - `COMPLETED`: Emerald (`bg-emerald-500`)
   - `CLOSED`: Dark Gray (`bg-gray-700`)

**Expected Result:**
- All status badges display with correct colors
- Colors are consistent across the application

---

### Step 7: Test ACL with State Transitions

**Objective:** Verify that ACL checks work with state transitions.

1. **Login** as a **client/homeowner**
2. Try to view a project that belongs to another client
3. **Verify:** Access is denied (403 error)

4. **Login** as an **architect**
5. Try to transition a project you don't own
6. **Verify:** Access is denied (403 error)

7. **Login** as **admin**
8. Try to transition any project
9. **Verify:** Access is granted, transition succeeds

**Expected Result:**
- ACL checks prevent unauthorized state transitions
- Only authorized users can change project states

---

### Step 8: Test Edge Cases

**Objective:** Verify edge cases and error handling.

#### 8.1: Same State Transition (No-op)
1. Edit a project with status `NEW`
2. Try to set status to `NEW` again
3. Click **Save**
4. **Verify:** No error, update succeeds (no-op)

#### 8.2: Invalid State Value
1. Try to set status to an invalid value (e.g., "INVALID")
2. Click **Save**
3. **Verify:** 
   - Validation error appears
   - Status remains unchanged

#### 8.3: Missing State
1. Try to update project without providing status
2. Click **Save**
3. **Verify:** 
   - If status is required, validation error appears
   - Otherwise, status remains unchanged

**Expected Result:**
- Edge cases are handled gracefully
- Clear error messages guide users

---

## Summary Checklist

- [ ] New projects default to `NEW` status
- [ ] All valid state transitions work correctly
- [ ] Invalid transitions are blocked with clear error messages
- [ ] Projects from quotes start at `CONTRACT_SIGNED`
- [ ] State transition API endpoint works
- [ ] Status badges display correct colors
- [ ] ACL checks prevent unauthorized transitions
- [ ] Edge cases are handled gracefully

---

## Troubleshooting

### Issue: State transition fails silently
**Solution:** Check browser console and backend logs for error messages. Verify that the state machine service is properly imported.

### Issue: Invalid transitions are allowed
**Solution:** Verify that `validateTransition` is called in the controller before updating the project.

### Issue: Status colors not displaying
**Solution:** Check that `getStatusColor` function in frontend matches the state values.

### Issue: API returns 401/403 errors
**Solution:** Verify authentication token is valid and user has proper permissions (ACL).

---

## API Reference

### Get Valid Next States
```
GET /api/projects/:id/next-states
Authorization: Bearer {token}
Response: { currentState: string, validNextStates: string[] }
```

### Transition Project State
```
POST /api/projects/:id/transition
Authorization: Bearer {token}
Body: { newState: string }
Response: { message: string, project: Project }
```

### Update Project (with state validation)
```
PATCH /api/projects/:id
Authorization: Bearer {token}
Body: { status: string, ... }
Response: { project: Project }
```

---

## Notes

- State transitions are validated on both frontend and backend
- Terminal state (`CLOSED`) cannot transition to any other state
- Projects created from quotes automatically start at `CONTRACT_SIGNED`
- All state transitions are logged for audit purposes
- ACL checks ensure only authorized users can change project states

