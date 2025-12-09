# Task Manager Module - Demo Steps

## Overview
This document provides step-by-step instructions to verify the Task Manager module implementation in the portal.

## Features
1. **Task Fields**: value, weight_pct, proofs[], rejection_reason
2. **Proof Validation**: 3 photos OR 1 video OR checklist complete, GPS required, timestamps after task start
3. **Task Submission**: Submit task for review with proofs
4. **Task Approval**: Approve task, update progress, calculate payout
5. **Task Rejection**: Reject task with reason

## Prerequisites
1. Backend server running on `http://localhost:5000`
2. Frontend running on `http://localhost:3000`
3. Valid user account (architect, admin, or client)
4. MongoDB connection established
5. At least one project created

---

## Demo Steps

### Step 1: Create Task with New Fields

**Objective:** Verify that tasks can be created with value, weight_pct, and other new fields.

1. **Login** to the portal as an architect or admin
2. Navigate to **Projects** page (`/projects`)
3. Select a project or create a new one
4. Navigate to **Tasks** section for the project
5. Click **"Add Task"** or **"Create Task"**
6. Fill in task details:
   - **Name**: "Install Windows"
   - **Description**: "Install all windows in the building"
   - **Value**: `50000` (₹50,000)
   - **Weight %**: `15` (15% of project progress)
   - **Start Date**: Select a date
   - **Due Date**: Select a future date
   - **Priority**: "HIGH"
   - **Assigned To**: Select a user
7. Click **"Create Task"**
8. **Verify:**
   - Task is created successfully
   - Task shows value and weight_pct in the task details
   - Task status is "TODO" or "IN_PROGRESS"

**Expected Result:**
- Task created with all new fields
- Value and weight_pct are displayed
- Task appears in the project's task list

---

### Step 2: Add Proofs to Task

**Objective:** Verify that proofs can be added to tasks with GPS and timestamps.

#### 2.1: Add Photos as Proofs
1. Open the task created in Step 1
2. Navigate to **"Proofs"** or **"Evidence"** section
3. Click **"Add Proof"** or **"Upload Photo"**
4. Upload 3 photos:
   - Photo 1: Select image file
   - **GPS Location**: Enter latitude `12.9716`, longitude `77.5946` (or use device GPS)
   - **Timestamp**: Select date/time after task start date
   - Photo 2: Repeat with different image
   - Photo 3: Repeat with different image
5. Click **"Save Proofs"**
6. **Verify:**
   - All 3 photos are uploaded
   - GPS coordinates are saved
   - Timestamps are after task start date

#### 2.2: Add Video as Proof (Alternative)
1. Instead of photos, upload 1 video:
   - Video: Select video file
   - **GPS Location**: Enter coordinates
   - **Timestamp**: After task start date
   - **Thumbnail**: (Optional) Upload thumbnail image
2. Click **"Save Proof"**
3. **Verify:**
   - Video is uploaded
   - GPS and timestamp are saved

#### 2.3: Complete Checklist (Alternative)
1. Navigate to **"Checklist"** section
2. Add checklist items:
   - Item 1: "Measure window dimensions" - Check ✅
   - Item 2: "Prepare installation materials" - Check ✅
   - Item 3: "Install windows" - Check ✅
3. **Verify:**
   - All checklist items are marked as completed
   - Checklist shows as 100% complete

**Expected Result:**
- Proofs can be added with GPS and timestamps
- Multiple proof types are supported (photos, video, checklist)
- All proofs are saved and displayed

---

### Step 3: Submit Task for Review

**Objective:** Verify that tasks can be submitted with proof validation.

#### 3.1: Submit with Valid Proofs (3 Photos)
1. Ensure task has 3 photos with GPS and valid timestamps
2. Click **"Submit for Review"** button
3. **Verify:**
   - Task status changes to "REVIEW"
   - Submission timestamp is recorded
   - Success message appears: "Task submitted for review successfully"

#### 3.2: Submit with Valid Proofs (1 Video)
1. Remove photos, add 1 video with GPS and timestamp
2. Click **"Submit for Review"**
3. **Verify:**
   - Task is submitted successfully
   - Status changes to "REVIEW"

#### 3.3: Submit with Complete Checklist
1. Remove all proofs, complete checklist (all items checked)
2. Click **"Submit for Review"**
3. **Verify:**
   - Task is submitted successfully
   - Status changes to "REVIEW"

#### 3.4: Test Invalid Submission (Less than 3 Photos)
1. Remove proofs, add only 2 photos
2. Click **"Submit for Review"**
3. **Verify:**
   - Error message appears: "Proof validation failed"
   - Error details: "Must provide either 3+ photos, 1+ video, or complete checklist"
   - Task status remains unchanged

#### 3.5: Test Invalid Submission (Missing GPS)
1. Add 3 photos but without GPS coordinates
2. Click **"Submit for Review"**
3. **Verify:**
   - Error message: "GPS coordinates (latitude, longitude) are required"
   - Task is not submitted

#### 3.6: Test Invalid Submission (Invalid Timestamp)
1. Add 3 photos with GPS but timestamp before task start date
2. Click **"Submit for Review"**
3. **Verify:**
   - Error message: "Timestamp must be after task start date"
   - Task is not submitted

**Expected Result:**
- Valid proofs allow submission
- Invalid proofs are rejected with clear error messages
- Task status changes to "REVIEW" only on successful submission

---

### Step 4: Approve Task

**Objective:** Verify that tasks can be approved, progress is calculated, and payout is prepared.

1. **Login** as an architect or admin (approver)
2. Navigate to tasks in "REVIEW" status
3. Open the task submitted in Step 3
4. Review the proofs (photos/video/checklist)
5. Click **"Approve Task"** button
6. **Verify:**
   - Task status changes to "DONE"
   - Approval timestamp is recorded
   - Success message: "Task approved successfully"
   - Project progress is updated (if viewing project dashboard)
   - Payout calculation is prepared

#### 4.1: Verify Progress Calculation
1. Navigate to **Project Dashboard**
2. Check **"Progress"** section
3. **Verify:**
   - Progress percentage increased by task's weight_pct
   - Example: If task had weight_pct=15, progress should increase by 15%

#### 4.2: Verify Payout Calculation
1. Navigate to **Project Financials** or **Payout** section
2. **Verify:**
   - Payout amount includes approved task value
   - Example: If task value=₹50,000, payout should include this amount
   - Payout percentage is calculated correctly

**Expected Result:**
- Task is approved successfully
- Project progress is updated automatically
- Payout calculation includes approved task value
- All calculations are accurate

---

### Step 5: Reject Task

**Objective:** Verify that tasks can be rejected with a reason.

1. **Login** as an architect or admin (approver)
2. Navigate to tasks in "REVIEW" status
3. Open a task that needs rejection
4. Click **"Reject Task"** button
5. Enter **Rejection Reason**: "Proofs are not clear enough. Please retake photos with better lighting."
6. Click **"Confirm Rejection"**
7. **Verify:**
   - Task status changes to "REJECTED"
   - Rejection reason is saved
   - Rejection timestamp is recorded
   - Success message: "Task rejected successfully"

#### 5.1: Test Rejection Without Reason
1. Try to reject a task without entering a reason
2. Click **"Confirm Rejection"**
3. **Verify:**
   - Error message: "Rejection reason is required"
   - Task is not rejected

#### 5.2: View Rejected Task
1. Open the rejected task
2. **Verify:**
   - Status shows "REJECTED"
   - Rejection reason is displayed
   - Task can be resubmitted after fixing issues

**Expected Result:**
- Tasks can be rejected with a reason
- Rejection reason is required
- Rejected tasks show the reason clearly
- Tasks can be resubmitted after rejection

---

### Step 6: Test API Endpoints

**Objective:** Verify API endpoints work correctly.

#### 6.1: Submit Task API
```bash
POST http://localhost:5000/api/tasks/{taskId}/submit
Headers: Authorization: Bearer {token}
Body: {
  "proofs": [
    {
      "type": "photo",
      "url": "https://example.com/photo1.jpg",
      "gps": { "latitude": 12.9716, "longitude": 77.5946 },
      "timestamp": "2024-01-02T10:00:00Z"
    },
    {
      "type": "photo",
      "url": "https://example.com/photo2.jpg",
      "gps": { "latitude": 12.9716, "longitude": 77.5946 },
      "timestamp": "2024-01-02T10:00:00Z"
    },
    {
      "type": "photo",
      "url": "https://example.com/photo3.jpg",
      "gps": { "latitude": 12.9716, "longitude": 77.5946 },
      "timestamp": "2024-01-02T10:00:00Z"
    }
  ]
}
```
**Expected Response:**
```json
{
  "message": "Task submitted for review successfully",
  "task": { ... }
}
```

#### 6.2: Approve Task API
```bash
POST http://localhost:5000/api/tasks/{taskId}/approve
Headers: Authorization: Bearer {token}
```
**Expected Response:**
```json
{
  "message": "Task approved successfully",
  "task": { ... },
  "progress": {
    "progress": 15,
    "completedTasks": 1,
    "totalTasks": 5
  },
  "payout": {
    "totalPayout": 50000,
    "projectTotal": 500000,
    "payoutPercentage": 10
  }
}
```

#### 6.3: Reject Task API
```bash
POST http://localhost:5000/api/tasks/{taskId}/reject
Headers: Authorization: Bearer {token}
Body: {
  "rejection_reason": "Proofs are not clear enough"
}
```
**Expected Response:**
```json
{
  "message": "Task rejected successfully",
  "task": { ... }
}
```

**Expected Result:**
- All API endpoints work correctly
- Proper validation and error handling
- Progress and payout calculations are returned

---

### Step 7: Test Progress Calculation

**Objective:** Verify that project progress is calculated correctly based on task weights.

1. Create a project with multiple tasks:
   - Task 1: weight_pct = 20, value = ₹20,000
   - Task 2: weight_pct = 30, value = ₹30,000
   - Task 3: weight_pct = 50, value = ₹50,000
2. Submit and approve Task 1
3. **Verify:** Project progress = 20%
4. Submit and approve Task 2
5. **Verify:** Project progress = 50% (20 + 30)
6. Submit and approve Task 3
7. **Verify:** Project progress = 100% (20 + 30 + 50)

**Expected Result:**
- Progress is calculated as sum of completed task weights
- Progress updates automatically on task approval
- Progress is capped at 100%

---

### Step 8: Test Payout Calculation

**Objective:** Verify that payout is calculated correctly based on approved task values.

1. Create tasks with different values:
   - Task 1: value = ₹30,000 (approved)
   - Task 2: value = ₹20,000 (approved)
   - Task 3: value = ₹50,000 (not approved)
2. Check payout calculation
3. **Verify:**
   - Total Payout = ₹50,000 (30,000 + 20,000)
   - Project Total = ₹100,000 (30,000 + 20,000 + 50,000)
   - Payout Percentage = 50%

**Expected Result:**
- Payout includes only approved tasks
- Payout percentage is calculated correctly
- Payout updates automatically on task approval

---

## Summary Checklist

- [ ] Tasks can be created with value and weight_pct fields
- [ ] Proofs can be added with GPS and timestamps
- [ ] Task submission validates proofs (3 photos OR 1 video OR checklist)
- [ ] Invalid proofs are rejected with clear errors
- [ ] Tasks can be approved successfully
- [ ] Project progress is calculated correctly
- [ ] Payout calculation is prepared on approval
- [ ] Tasks can be rejected with reason
- [ ] Rejection reason is required
- [ ] API endpoints work correctly
- [ ] Progress calculation is accurate
- [ ] Payout calculation is accurate

---

## Troubleshooting

### Issue: Proof validation fails even with valid proofs
**Solution:** Check that:
- GPS coordinates are valid numbers (latitude: -90 to 90, longitude: -180 to 180)
- Timestamps are after task start date
- Proofs meet the requirement (3 photos OR 1 video OR complete checklist)

### Issue: Progress not updating after approval
**Solution:** 
- Check backend logs for errors
- Verify task weight_pct is set correctly
- Ensure `updateProjectProgress` is called in approve endpoint

### Issue: Payout calculation is incorrect
**Solution:**
- Verify task values are set correctly
- Check that only DONE tasks are included in payout
- Verify `calculatePayout` function logic

### Issue: API returns 401/403 errors
**Solution:**
- Verify authentication token is valid
- Check user has proper permissions (ACL)
- Ensure user is not a vendor (vendors cannot approve/reject)

---

## API Reference

### Submit Task
```
POST /api/tasks/:id/submit
Authorization: Bearer {token}
Body: { proofs: Proof[], checklist?: ChecklistItem[] }
Response: { message: string, task: Task }
```

### Approve Task
```
POST /api/tasks/:id/approve
Authorization: Bearer {token}
Response: { message: string, task: Task, progress: Object, payout: Object }
```

### Reject Task
```
POST /api/tasks/:id/reject
Authorization: Bearer {token}
Body: { rejection_reason: string }
Response: { message: string, task: Task }
```

---

## Notes

- Proof validation is enforced on both frontend and backend
- GPS coordinates are required for all proofs
- Timestamps must be after task start date
- Only non-vendor users can approve/reject tasks
- Progress is calculated as sum of completed task weights
- Payout includes only approved (DONE) tasks
- All state transitions are logged for audit purposes

