# Notifications Module - Demo Steps

## Overview
This document provides step-by-step instructions to verify the Notifications module implementation. The module handles email, SMS, and push notifications for various events in the system.

## Features
1. **Email Adapter**: Mock email provider for development/testing
2. **SMS Adapter**: Mock SMS provider for development/testing
3. **Push Adapter**: Firebase Cloud Messaging (FCM) integration
4. **Event Triggers**: Automatic notifications for:
   - Task submitted
   - Task approved
   - Task rejected
   - Escrow deposit received
   - RFQ response received

## Prerequisites
- [ ] Backend server running on `http://localhost:5000`
- [ ] Frontend running on `http://localhost:3000`
- [ ] Valid user account (architect, admin, or client)
- [ ] MongoDB connection established
- [ ] Firebase configured (for push notifications)

---

## Demo Steps

### ✅ Step 1: Verify Notification Service Structure

**Objective:** Verify that notification service and adapters are properly set up.

- [ ] Check `backend/services/notificationService.js` exists
- [ ] Check `backend/services/adapters/emailAdapter.js` exists
- [ ] Check `backend/services/adapters/smsAdapter.js` exists
- [ ] Check `backend/services/adapters/pushAdapter.js` exists
- [ ] Verify adapters export `send()` function

**Expected Result:**
- All notification service files are present
- Adapters follow consistent interface pattern

---

### ✅ Step 2: Test Email Adapter (Mock)

**Objective:** Verify that email adapter logs notifications correctly.

#### 2.1: Check Console Output
1. **Submit a task** for review (see Step 3)
2. **Check backend console** for email adapter logs
3. **Verify** output shows:
   ```
   📧 [EMAIL ADAPTER] Sending email:
      To: architect@example.com
      Subject: Task Submitted for Review
      Body: Task "Install Windows" has been submitted for review.
   ```

**Expected Result:**
- [ ] Email adapter is called
- [ ] Console shows email details
- [ ] Mock email "sent" successfully

---

### ✅ Step 3: Test Task Submitted Notification

**Objective:** Verify notification is triggered when task is submitted.

1. **Login** as an architect or assigned user
2. Navigate to **Projects** → Select a project
3. Navigate to **Tasks** section
4. Create or open a task
5. Add proofs (3 photos OR 1 video OR complete checklist)
6. Click **"Submit for Review"**

**Expected Result:**
- [ ] Task is submitted successfully
- [ ] Backend console shows email notification log
- [ ] Notification sent to project architect/owner
- [ ] Notification includes task name and project name

#### 3.1: Verify via API
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

**Check Backend Console:**
- [ ] Email adapter log appears
- [ ] Notification includes correct task and project data

---

### ✅ Step 4: Test Task Approved Notification

**Objective:** Verify notification is triggered when task is approved.

1. **Login** as project architect or admin
2. Navigate to tasks in **"REVIEW"** status
3. Open a submitted task
4. Review proofs
5. Click **"Approve Task"**

**Expected Result:**
- [ ] Task is approved successfully
- [ ] Backend console shows email notification log
- [ ] Notification sent to task assignee
- [ ] Notification includes payout information (if available)

#### 4.1: Verify Notification Content
**Check console output:**
```
📧 [EMAIL ADAPTER] Sending email:
   To: assigned-user@example.com
   Subject: Task Approved
   Body: Task "Install Windows" has been approved.
   HTML: <h2>Task Approved</h2>...
```

**Expected Content:**
- [ ] Subject: "Task Approved"
- [ ] Includes task name
- [ ] Includes project name
- [ ] Includes approved by information
- [ ] Includes payable amount (if available)

---

### ✅ Step 5: Test Task Rejected Notification

**Objective:** Verify notification is triggered when task is rejected.

1. **Login** as project architect or admin
2. Navigate to tasks in **"REVIEW"** status
3. Open a submitted task
4. Click **"Reject Task"**
5. Enter rejection reason: "Proofs are not clear enough"
6. Click **"Confirm Rejection"**

**Expected Result:**
- [ ] Task is rejected successfully
- [ ] Backend console shows email notification log
- [ ] Notification sent to task assignee
- [ ] Notification includes rejection reason

#### 5.1: Verify Notification Content
**Check console output:**
```
📧 [EMAIL ADAPTER] Sending email:
   To: assigned-user@example.com
   Subject: Task Rejected
   Body: Task "Install Windows" has been rejected.
   HTML: <h2>Task Rejected</h2>...
```

**Expected Content:**
- [ ] Subject: "Task Rejected"
- [ ] Includes task name
- [ ] Includes rejection reason
- [ ] Includes rejected by information

---

### ✅ Step 6: Test SMS Adapter (Mock)

**Objective:** Verify that SMS adapter logs notifications correctly.

#### 6.1: Test SMS Notification
1. Trigger any notification event (task submitted, approved, etc.)
2. Ensure recipient has phone number
3. **Check backend console** for SMS adapter logs
4. **Verify** output shows:
   ```
   📱 [SMS ADAPTER] Sending SMS:
      To: +911234567890
      Message: Task "Install Windows" submitted for review. Project: Test Project
   ```

**Expected Result:**
- [ ] SMS adapter is called (if phone number provided)
- [ ] Console shows SMS details
- [ ] Mock SMS "sent" successfully

**Note:** SMS notifications are only sent if recipient has a phone number configured.

---

### ✅ Step 7: Test Escrow Deposit Received Notification

**Objective:** Verify notification is triggered when escrow deposit is received.

#### 7.1: Simulate Escrow Deposit
1. **Create a project** from a signed quote
2. **Simulate deposit webhook** (or use admin interface to add deposit)
3. **Check backend console** for notification logs

**Expected Result:**
- [ ] Deposit is processed successfully
- [ ] Backend console shows email notification log
- [ ] Notification sent to project architect
- [ ] Notification includes deposit amount and project name

#### 7.2: Verify via Wallet Service
The notification is automatically triggered in `walletService.depositWebhook()` when a deposit is processed.

**Check console output:**
```
📧 [EMAIL ADAPTER] Sending email:
   To: architect@example.com
   Subject: Escrow Deposit Received
   Body: Escrow deposit of ₹500,000 received for project "Test Project".
```

---

### ✅ Step 8: Test RFQ Response Notification

**Objective:** Verify notification is triggered when RFQ response is received.

1. **Login** as a vendor/supplier
2. Navigate to **RFQ** page
3. Open an RFQ
4. **Submit a response** with quotes
5. **Check backend console** for notification logs

**Expected Result:**
- [ ] RFQ response is submitted successfully
- [ ] Backend console shows email notification log
- [ ] Notification sent to project architect
- [ ] Notification includes supplier name and total amount

#### 8.1: Verify via API
```bash
POST http://localhost:5000/api/rfq/{rfqId}/responses
Headers: Authorization: Bearer {token}
Body: {
  "supplierId": "{supplierId}",
  "responses": [
    {
      "materialId": "{materialId}",
      "name": "Material Name",
      "price": 1000,
      "quantity": 10,
      "remarks": ""
    }
  ],
  "tax": 18
}
```

**Check Backend Console:**
- [ ] Email adapter log appears
- [ ] Notification includes RFQ and supplier information

---

### ✅ Step 9: Test Push Notifications

**Objective:** Verify push notifications are sent via FCM.

#### 9.1: Setup Push Token
1. **Login** to frontend application
2. **Grant notification permissions** when prompted
3. **Check browser console** for FCM token
4. **Note** the token for testing

#### 9.2: Trigger Push Notification
1. **Submit a task** or trigger any notification event
2. **Ensure recipient has push token** configured
3. **Check backend console** for push adapter logs
4. **Verify** push notification is sent

**Expected Result:**
- [ ] Push adapter is called
- [ ] FCM notification is sent
- [ ] Device receives push notification (if token is valid)

**Note:** Push notifications require valid FCM tokens and Firebase configuration.

---

### ✅ Step 10: Test Multiple Channels

**Objective:** Verify that notifications can be sent via multiple channels simultaneously.

#### 10.1: Test Email + SMS + Push
1. Trigger a notification event
2. Ensure recipient has:
   - Email address
   - Phone number
   - Push token
3. **Check backend console** for all adapter logs

**Expected Result:**
- [ ] Email adapter is called
- [ ] SMS adapter is called
- [ ] Push adapter is called
- [ ] All channels send successfully

---

### ✅ Step 11: Test Error Handling

**Objective:** Verify that notification failures don't break the main flow.

#### 11.1: Simulate Adapter Failure
1. **Temporarily break** email adapter (or remove email from recipient)
2. **Submit a task** for review
3. **Verify** task submission still succeeds
4. **Check** error is logged but doesn't fail the request

**Expected Result:**
- [ ] Task submission succeeds
- [ ] Error is logged in console
- [ ] Error is included in notification result
- [ ] Other channels still work (if available)

---

### ✅ Step 12: Verify Notification Content

**Objective:** Verify that notification content is correctly generated for each event type.

#### 12.1: Task Submitted Content
- [ ] Title: "Task Submitted for Review"
- [ ] Includes task name
- [ ] Includes project name
- [ ] Includes submitter information

#### 12.2: Task Approved Content
- [ ] Title: "Task Approved"
- [ ] Includes task name
- [ ] Includes payable amount (if available)
- [ ] Includes approver information

#### 12.3: Task Rejected Content
- [ ] Title: "Task Rejected"
- [ ] Includes task name
- [ ] Includes rejection reason
- [ ] Includes rejector information

#### 12.4: Escrow Deposit Content
- [ ] Title: "Escrow Deposit Received"
- [ ] Includes project name
- [ ] Includes deposit amount (formatted)
- [ ] Includes depositor information

#### 12.5: RFQ Response Content
- [ ] Title: "RFQ Response Received"
- [ ] Includes RFQ name/ID
- [ ] Includes supplier name
- [ ] Includes total amount

---

## Summary Checklist

- [ ] Email adapter (mock) is working
- [ ] SMS adapter (mock) is working
- [ ] Push adapter (FCM) is working
- [ ] Task submitted notification is triggered
- [ ] Task approved notification is triggered
- [ ] Task rejected notification is triggered
- [ ] Escrow deposit notification is triggered
- [ ] RFQ response notification is triggered
- [ ] Multiple channels work simultaneously
- [ ] Error handling works correctly
- [ ] Notification content is correct for all events
- [ ] Notifications don't break main flow

---

## API Reference

### Notification Service Functions

```javascript
// Send generic notification
await sendNotification({
  eventType: 'task_submitted',
  recipient: {
    email: 'user@example.com',
    phone: '+911234567890',
    pushToken: 'fcm-token-123',
  },
  data: { taskName: 'Task Name' },
  channels: ['email', 'sms', 'push'],
});

// Task-specific notifications
await notifyTaskSubmitted({ task, project, submittedBy, recipient });
await notifyTaskApproved({ task, project, approvedBy, payout, recipient });
await notifyTaskRejected({ task, project, rejectedBy, rejectionReason, recipient });
await notifyEscrowDepositReceived({ project, amount, depositedBy, recipient });
await notifyRFQResponse({ rfq, supplier, totalAmount, recipient });
```

---

## Troubleshooting

### Issue: Notifications not being sent
**Solution:**
- Check backend console for errors
- Verify adapters are imported correctly
- Ensure recipient has required contact info (email/phone/token)
- Check that notification service is called in controllers

### Issue: Email adapter not logging
**Solution:**
- Verify `emailAdapter.js` exists in `backend/services/adapters/`
- Check that `send()` function is exported
- Ensure notification service imports adapter correctly

### Issue: Push notifications not working
**Solution:**
- Verify Firebase is configured
- Check FCM token is valid
- Ensure `sendFCM` utility is working
- Check Firebase service account key exists

### Issue: Notification breaks main flow
**Solution:**
- Verify notifications are wrapped in try-catch
- Check that errors are logged but don't throw
- Ensure notification failures don't affect API responses

---

## Notes

- **Email Adapter**: Mock provider - logs to console. Replace with real provider (SendGrid, AWS SES) in production.
- **SMS Adapter**: Mock provider - logs to console. Replace with real provider (Twilio, AWS SNS) in production.
- **Push Adapter**: Uses Firebase Cloud Messaging (FCM) - requires Firebase configuration.
- **Notifications are non-blocking**: Failures don't affect main operations.
- **Multiple channels**: Can send via email, SMS, and push simultaneously.
- **Event-driven**: Notifications are automatically triggered by system events.
- **Content templates**: Each event type has predefined content templates.
- **Recipient info**: Notifications require appropriate recipient contact information.

---

## Example Console Output

### Task Submitted Notification
```
📧 [EMAIL ADAPTER] Sending email:
   To: architect@example.com
   Subject: Task Submitted for Review
   Body: Task "Install Windows" has been submitted for review.
   HTML: <h2>Task Submitted for Review</h2>...
   Data: {
     "taskName": "Install Windows",
     "projectName": "Test Project",
     "submittedBy": "John Doe"
   }
✅ [EMAIL ADAPTER] Email sent successfully
```

### Task Approved Notification
```
📧 [EMAIL ADAPTER] Sending email:
   To: assigned-user@example.com
   Subject: Task Approved
   Body: Task "Install Windows" has been approved.
   HTML: <h2>Task Approved</h2>...
   Data: {
     "taskName": "Install Windows",
     "projectName": "Test Project",
     "finalPayable": 81600
   }
✅ [EMAIL ADAPTER] Email sent successfully
```

### Escrow Deposit Notification
```
📧 [EMAIL ADAPTER] Sending email:
   To: architect@example.com
   Subject: Escrow Deposit Received
   Body: Escrow deposit of ₹500,000 received for project "Test Project".
   HTML: <h2>Escrow Deposit Received</h2>...
   Data: {
     "projectName": "Test Project",
     "amount": 500000,
     "depositedBy": "Client Name"
   }
✅ [EMAIL ADAPTER] Email sent successfully
```

