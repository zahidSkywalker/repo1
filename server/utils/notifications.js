const nodemailer = require('nodemailer');

// Create transporter for email notifications
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Email templates
const emailTemplates = {
  'threshold-reached': {
    subject: '🎉 Group Order Threshold Reached!',
    html: (order) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">🎉 Great News! Your Group Order Threshold Has Been Reached!</h2>
        <p>Hello there!</p>
        <p>The group order for <strong>${order.itemName}</strong> has reached its minimum threshold and is now locked!</p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Order Details:</h3>
          <ul>
            <li><strong>Item:</strong> ${order.itemName}</li>
            <li><strong>Current Quantity:</strong> ${order.currentQuantity} ${order.unit}</li>
            <li><strong>Target Quantity:</strong> ${order.totalQuantity} ${order.unit}</li>
            <li><strong>Price per Unit:</strong> ৳${order.pricePerUnit}</li>
            <li><strong>Location:</strong> ${order.location.city}, ${order.location.area}</li>
          </ul>
        </div>
        
        <p>The order organizer will now confirm the delivery time and complete the order.</p>
        <p>Stay tuned for updates!</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}/orders/${order._id}" 
             style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
             View Order Details
          </a>
        </div>
        
        <p>Best regards,<br>The GroShare Team</p>
      </div>
    `
  },
  
  'order-locked': {
    subject: '🔒 Group Order Locked - Delivery Time Coming Soon!',
    html: (order) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2196F3;">🔒 Your Group Order Has Been Locked!</h2>
        <p>Hello there!</p>
        <p>The group order for <strong>${order.itemName}</strong> has been locked and is now being processed!</p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Order Status:</h3>
          <ul>
            <li><strong>Status:</strong> <span style="color: #2196F3;">🔒 LOCKED</span></li>
            <li><strong>Final Quantity:</strong> ${order.currentQuantity} ${order.unit}</li>
            <li><strong>Total Participants:</strong> ${order.participants.length}</li>
            <li><strong>Location:</strong> ${order.location.city}, ${order.location.area}</li>
          </ul>
        </div>
        
        <p>The order organizer will confirm the delivery time shortly. You'll receive another notification once the delivery time is set.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}/orders/${order._id}" 
             style="background-color: #2196F3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
             View Order Details
          </a>
        </div>
        
        <p>Best regards,<br>The GroShare Team</p>
      </div>
    `
  },
  
  'order-completed': {
    subject: '✅ Group Order Completed - Delivery Time Confirmed!',
    html: (order) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">✅ Your Group Order Has Been Completed!</h2>
        <p>Hello there!</p>
        <p>The group order for <strong>${order.itemName}</strong> has been completed and the delivery time has been confirmed!</p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Delivery Information:</h3>
          <ul>
            <li><strong>Status:</strong> <span style="color: #4CAF50;">✅ COMPLETED</span></li>
            <li><strong>Delivery Time:</strong> ${new Date(order.deliveryTime).toLocaleString()}</li>
            <li><strong>Final Quantity:</strong> ${order.currentQuantity} ${order.unit}</li>
            <li><strong>Location:</strong> ${order.location.city}, ${order.location.area}</li>
          </ul>
        </div>
        
        <p>Please be ready to receive your order at the specified delivery time.</p>
        <p>If you have any questions, please contact the order organizer.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}/orders/${order._id}" 
             style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
             View Order Details
          </a>
        </div>
        
        <p>Best regards,<br>The GroShare Team</p>
      </div>
    `
  },
  
  'welcome': {
    subject: '🎉 Welcome to GroShare!',
    html: (user) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">🎉 Welcome to GroShare!</h2>
        <p>Hello <strong>${user.name}</strong>!</p>
        <p>Welcome to GroShare - your hyperlocal group-buy grocery platform!</p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">What you can do:</h3>
          <ul>
            <li>🚀 Create group orders for groceries</li>
            <li>👥 Join existing orders from neighbors</li>
            <li>💰 Get wholesale prices through group buying</li>
            <li>📱 Receive real-time updates and notifications</li>
            <li>💳 Pay securely with bKash, Nagad, or cash</li>
          </ul>
        </div>
        
        <p>Start exploring by browsing existing orders or create your first group order!</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}/dashboard" 
             style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
             Get Started
          </a>
        </div>
        
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <p>Happy group buying! 🛒</p>
        
        <p>Best regards,<br>The GroShare Team</p>
      </div>
    `
  }
};

// Send email notification
const sendEmailNotification = async (to, template, data) => {
  try {
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('📧 Email configuration not set up. Skipping email notification.');
      return { success: false, message: 'Email not configured' };
    }

    const transporter = createTransporter();
    const emailTemplate = emailTemplates[template];
    
    if (!emailTemplate) {
      throw new Error(`Email template '${template}' not found`);
    }

    const mailOptions = {
      from: `"GroShare" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: emailTemplate.subject,
      html: emailTemplate.html(data)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email notification sent: ${info.messageId}`);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('📧 Email notification error:', error);
    return { success: false, error: error.message };
  }
};

// Send order notification to all participants
const sendOrderNotification = async (order, notificationType) => {
  try {
    const notifications = [];
    
    // Send to organizer
    if (order.organizer.email && order.organizer.preferences?.notifications?.email) {
      notifications.push(
        sendEmailNotification(order.organizer.email, notificationType, order)
      );
    }
    
    // Send to participants
    for (const participant of order.participants) {
      if (participant.user.email && participant.user.preferences?.notifications?.email) {
        notifications.push(
          sendEmailNotification(participant.user.email, notificationType, order)
        );
      }
    }
    
    // Wait for all notifications to be sent
    const results = await Promise.allSettled(notifications);
    
    const successCount = results.filter(result => 
      result.status === 'fulfilled' && result.value.success
    ).length;
    
    console.log(`📧 Sent ${notificationType} notifications: ${successCount}/${notifications.length} successful`);
    
    return { success: true, sentCount: successCount, totalCount: notifications.length };
  } catch (error) {
    console.error('📧 Order notification error:', error);
    return { success: false, error: error.message };
  }
};

// Send welcome email to new user
const sendWelcomeEmail = async (user) => {
  try {
    if (!user.email) {
      return { success: false, message: 'User has no email' };
    }
    
    return await sendEmailNotification(user.email, 'welcome', user);
  } catch (error) {
    console.error('📧 Welcome email error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEmailNotification,
  sendOrderNotification,
  sendWelcomeEmail
};