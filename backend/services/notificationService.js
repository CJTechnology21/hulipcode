/**
 * Notification Service
 * Centralized notification system with adapter pattern
 * Supports Email, SMS, and Push notifications
 */

const emailAdapter = require('./adapters/emailAdapter');
const smsAdapter = require('./adapters/smsAdapter');
const pushAdapter = require('./adapters/pushAdapter');

/**
 * Notification event types
 */
const NOTIFICATION_EVENTS = {
  TASK_SUBMITTED: 'task_submitted',
  TASK_APPROVED: 'task_approved',
  TASK_REJECTED: 'task_rejected',
  ESCROW_DEPOSIT_RECEIVED: 'escrow_deposit_received',
  RFQ_RESPONSE: 'rfq_response',
};

/**
 * Notification channels
 */
const CHANNELS = {
  EMAIL: 'email',
  SMS: 'sms',
  PUSH: 'push',
};

/**
 * Send notification via specified channels
 * @param {Object} params - Notification parameters
 * @param {string} params.eventType - Event type (from NOTIFICATION_EVENTS)
 * @param {Object} params.recipient - Recipient information
 * @param {string} params.recipient.email - Email address
 * @param {string} params.recipient.phone - Phone number
 * @param {string} params.recipient.pushToken - Push notification token
 * @param {Object} params.data - Event data
 * @param {Array<string>} params.channels - Channels to use (default: ['email', 'push'])
 * @returns {Promise<Object>} Notification results
 */
const sendNotification = async ({
  eventType,
  recipient,
  data = {},
  channels = [CHANNELS.EMAIL, CHANNELS.PUSH],
}) => {
  const results = {
    eventType,
    recipient,
    channels: {},
    success: true,
    errors: [],
  };

  // Validate event type
  if (!Object.values(NOTIFICATION_EVENTS).includes(eventType)) {
    throw new Error(`Invalid event type: ${eventType}`);
  }

  // Generate notification content based on event type
  const content = generateNotificationContent(eventType, data);

  // Send via each requested channel
  for (const channel of channels) {
    try {
      let channelResult;

      switch (channel) {
        case CHANNELS.EMAIL:
          if (!recipient.email) {
            results.errors.push('Email address not provided');
            continue;
          }
          channelResult = await emailAdapter.send({
            to: recipient.email,
            subject: content.subject,
            body: content.body,
            html: content.html,
            data,
          });
          results.channels.email = channelResult;
          break;

        case CHANNELS.SMS:
          if (!recipient.phone) {
            results.errors.push('Phone number not provided');
            continue;
          }
          channelResult = await smsAdapter.send({
            to: recipient.phone,
            message: content.smsMessage || content.body,
            data,
          });
          results.channels.sms = channelResult;
          break;

        case CHANNELS.PUSH:
          if (!recipient.pushToken) {
            results.errors.push('Push token not provided');
            continue;
          }
          channelResult = await pushAdapter.send({
            token: recipient.pushToken,
            title: content.title,
            body: content.body,
            data,
          });
          results.channels.push = channelResult;
          break;

        default:
          results.errors.push(`Unknown channel: ${channel}`);
      }
    } catch (error) {
      console.error(`Error sending ${channel} notification:`, error);
      results.errors.push(`${channel}: ${error.message}`);
      results.success = false;
    }
  }

  return results;
};

/**
 * Generate notification content based on event type
 * @param {string} eventType - Event type
 * @param {Object} data - Event data
 * @returns {Object} Notification content
 */
const generateNotificationContent = (eventType, data) => {
  const templates = {
    [NOTIFICATION_EVENTS.TASK_SUBMITTED]: {
      title: 'Task Submitted for Review',
      subject: 'Task Submitted for Review',
      body: `Task "${data.taskName || 'Unknown'}" has been submitted for review.`,
      smsMessage: `Task "${data.taskName || 'Unknown'}" submitted for review. Project: ${data.projectName || 'Unknown'}`,
      html: `
        <h2>Task Submitted for Review</h2>
        <p><strong>Task:</strong> ${data.taskName || 'Unknown'}</p>
        <p><strong>Project:</strong> ${data.projectName || 'Unknown'}</p>
        <p><strong>Submitted by:</strong> ${data.submittedBy || 'Unknown'}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        <p>Please review the task and approve or reject it.</p>
      `,
    },
    [NOTIFICATION_EVENTS.TASK_APPROVED]: {
      title: 'Task Approved',
      subject: 'Task Approved',
      body: `Task "${data.taskName || 'Unknown'}" has been approved.`,
      smsMessage: `Task "${data.taskName || 'Unknown'}" approved. Project: ${data.projectName || 'Unknown'}`,
      html: `
        <h2>Task Approved</h2>
        <p><strong>Task:</strong> ${data.taskName || 'Unknown'}</p>
        <p><strong>Project:</strong> ${data.projectName || 'Unknown'}</p>
        <p><strong>Approved by:</strong> ${data.approvedBy || 'Unknown'}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        ${data.finalPayable ? `<p><strong>Payable Amount:</strong> ₹${data.finalPayable.toLocaleString()}</p>` : ''}
        <p>Great work! The task has been approved and payment will be processed.</p>
      `,
    },
    [NOTIFICATION_EVENTS.TASK_REJECTED]: {
      title: 'Task Rejected',
      subject: 'Task Rejected',
      body: `Task "${data.taskName || 'Unknown'}" has been rejected.`,
      smsMessage: `Task "${data.taskName || 'Unknown'}" rejected. Reason: ${data.rejectionReason || 'See details'}`,
      html: `
        <h2>Task Rejected</h2>
        <p><strong>Task:</strong> ${data.taskName || 'Unknown'}</p>
        <p><strong>Project:</strong> ${data.projectName || 'Unknown'}</p>
        <p><strong>Rejected by:</strong> ${data.rejectedBy || 'Unknown'}</p>
        <p><strong>Reason:</strong> ${data.rejectionReason || 'No reason provided'}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        <p>Please review the feedback and resubmit the task.</p>
      `,
    },
    [NOTIFICATION_EVENTS.ESCROW_DEPOSIT_RECEIVED]: {
      title: 'Escrow Deposit Received',
      subject: 'Escrow Deposit Received',
      body: `Escrow deposit of ₹${data.amount?.toLocaleString() || 'Unknown'} received for project "${data.projectName || 'Unknown'}".`,
      smsMessage: `Escrow deposit ₹${data.amount?.toLocaleString() || 'Unknown'} received. Project: ${data.projectName || 'Unknown'}`,
      html: `
        <h2>Escrow Deposit Received</h2>
        <p><strong>Project:</strong> ${data.projectName || 'Unknown'}</p>
        <p><strong>Amount:</strong> ₹${data.amount?.toLocaleString() || 'Unknown'}</p>
        <p><strong>Deposited by:</strong> ${data.depositedBy || 'Unknown'}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        <p>The funds have been securely deposited into the escrow account.</p>
      `,
    },
    [NOTIFICATION_EVENTS.RFQ_RESPONSE]: {
      title: 'RFQ Response Received',
      subject: 'RFQ Response Received',
      body: `New response received for RFQ "${data.rfqName || 'Unknown'}".`,
      smsMessage: `RFQ response received. RFQ: ${data.rfqName || 'Unknown'}, Supplier: ${data.supplierName || 'Unknown'}`,
      html: `
        <h2>RFQ Response Received</h2>
        <p><strong>RFQ:</strong> ${data.rfqName || 'Unknown'}</p>
        <p><strong>Supplier:</strong> ${data.supplierName || 'Unknown'}</p>
        <p><strong>Total Amount:</strong> ₹${data.totalAmount?.toLocaleString() || 'Unknown'}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        <p>Please review the response and make a decision.</p>
      `,
    },
  };

  return templates[eventType] || {
    title: 'Notification',
    subject: 'Notification',
    body: 'You have a new notification.',
    smsMessage: 'You have a new notification.',
    html: '<p>You have a new notification.</p>',
  };
};

/**
 * Trigger notification for task submitted event
 * @param {Object} params - Event parameters
 */
const notifyTaskSubmitted = async (params) => {
  const { task, project, submittedBy, recipient } = params;

  return await sendNotification({
    eventType: NOTIFICATION_EVENTS.TASK_SUBMITTED,
    recipient,
    data: {
      taskName: task?.name,
      projectName: project?.name,
      submittedBy: submittedBy?.name || submittedBy?.email,
      taskId: task?._id,
      projectId: project?._id,
    },
  });
};

/**
 * Trigger notification for task approved event
 * @param {Object} params - Event parameters
 */
const notifyTaskApproved = async (params) => {
  const { task, project, approvedBy, payout, recipient } = params;

  return await sendNotification({
    eventType: NOTIFICATION_EVENTS.TASK_APPROVED,
    recipient,
    data: {
      taskName: task?.name,
      projectName: project?.name,
      approvedBy: approvedBy?.name || approvedBy?.email,
      finalPayable: payout?.financials?.finalPayable,
      taskId: task?._id,
      projectId: project?._id,
    },
  });
};

/**
 * Trigger notification for task rejected event
 * @param {Object} params - Event parameters
 */
const notifyTaskRejected = async (params) => {
  const { task, project, rejectedBy, rejectionReason, recipient } = params;

  return await sendNotification({
    eventType: NOTIFICATION_EVENTS.TASK_REJECTED,
    recipient,
    data: {
      taskName: task?.name,
      projectName: project?.name,
      rejectedBy: rejectedBy?.name || rejectedBy?.email,
      rejectionReason,
      taskId: task?._id,
      projectId: project?._id,
    },
  });
};

/**
 * Trigger notification for escrow deposit received event
 * @param {Object} params - Event parameters
 */
const notifyEscrowDepositReceived = async (params) => {
  const { project, amount, depositedBy, recipient } = params;

  return await sendNotification({
    eventType: NOTIFICATION_EVENTS.ESCROW_DEPOSIT_RECEIVED,
    recipient,
    data: {
      projectName: project?.name,
      amount,
      depositedBy: depositedBy?.name || depositedBy?.email,
      projectId: project?._id,
    },
  });
};

/**
 * Trigger notification for RFQ response event
 * @param {Object} params - Event parameters
 */
const notifyRFQResponse = async (params) => {
  const { rfq, supplier, totalAmount, recipient } = params;

  return await sendNotification({
    eventType: NOTIFICATION_EVENTS.RFQ_RESPONSE,
    recipient,
    data: {
      rfqName: rfq?.name || rfq?.id,
      supplierName: supplier?.name || supplier?.email,
      totalAmount,
      rfqId: rfq?._id,
    },
  });
};

module.exports = {
  sendNotification,
  notifyTaskSubmitted,
  notifyTaskApproved,
  notifyTaskRejected,
  notifyEscrowDepositReceived,
  notifyRFQResponse,
  NOTIFICATION_EVENTS,
  CHANNELS,
};

