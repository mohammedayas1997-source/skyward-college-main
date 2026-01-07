const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Setup email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'YOUR_EMAIL@gmail.com', 
    pass: 'YOUR_APP_PASSWORD'    
  }
});

// 1. FINANCIAL NOTIFICATIONS (With Support for Receipt Attachments)
exports.notifyManagementOnNewVoucher = functions.firestore
  .document('paymentRequests/{requestId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    
    const managementEmails = [
      'rector@school.edu', 
      'accountant@school.edu', 
      'proprietor@school.edu'
    ];

    const mailOptions = {
      from: 'School Finance System <noreply@school.edu>',
      to: managementEmails.join(','),
      subject: 'URGENT: New Financial Voucher for Approval',
      html: `
        <div style="font-family: sans-serif; padding: 25px; border: 1px solid #e5e7eb; border-radius: 15px;">
          <h2 style="color: #1e293b; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px;">Payment Authorization Required</h2>
          <p style="font-size: 14px; color: #4b5563;">A new voucher has been submitted for executive review.</p>
          <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p><strong>Title:</strong> ${data.title}</p>
            <p><strong>Amount:</strong> ₦${Number(data.amount).toLocaleString()}</p>
            <p><strong>Submitted By:</strong> ${data.submittedBy}</p>
            ${data.attachment ? `<p><strong>Attachment:</strong> <a href="${data.attachment}" style="color: #2563eb;">View Receipt/Document</a></p>` : '<p style="color: #94a3b8;">No document attached.</p>'}
          </div>
          <a href="https://your-portal.com" style="background: #0f172a; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">Login to Approve</a>
        </div>`
    };
    return transporter.sendMail(mailOptions);
  });

// 2. UNIVERSAL OTP RESET SYSTEM
exports.sendPasswordResetOTP = functions.firestore
  .document('passwordResets/{userId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const userEmail = data.email;
    const otpCode = data.otp;

    const mailOptions = {
      from: 'Security Center <security@school.edu>',
      to: userEmail,
      subject: 'Verification Code: Password Reset Request',
      html: `
        <div style="font-family: sans-serif; text-align: center; padding: 40px; border: 1px solid #f1f5f9;">
          <h2 style="color: #0f172a;">Password Reset Request</h2>
          <p style="color: #64748b;">Use the security code below to verify your identity. This code is valid for 10 minutes.</p>
          <div style="background: #f1f5f9; padding: 25px; margin: 30px 0; border-radius: 12px;">
            <h1 style="letter-spacing: 15px; color: #b91c1c; font-size: 40px; margin: 0;">${otpCode}</h1>
          </div>
          <p style="font-size: 12px; color: #94a3b8;">If you did not request this, please ignore this email.</p>
        </div>`
    };
    return transporter.sendMail(mailOptions);
  });

// 3. BROADCAST ANNOUNCEMENTS (To all users)
exports.onNewAnnouncement = functions.firestore
  .document('announcements/{id}')
  .onCreate(async (snap, context) => {
    const news = snap.data();
    
    try {
      const usersSnapshot = await admin.firestore().collection('users').get();
      const allEmails = usersSnapshot.docs
        .map(doc => doc.data().email)
        .filter(email => email && email.includes('@'));

      if (allEmails.length === 0) return null;

      const mailOptions = {
        from: 'School News Desk <news@school.edu>',
        to: allEmails.join(','),
        subject: `OFFICIAL ANNOUNCEMENT: ${news.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 30px; line-height: 1.6;">
            <div style="background: #0f172a; color: white; padding: 20px; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 20px;">${news.title}</h1>
            </div>
            <div style="padding: 25px; border: 1px solid #0f172a; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; color: #334155;">${news.content}</p>
              <hr style="margin: 30px 0; border: 0; border-top: 1px solid #e2e8f0;" />
              <p style="font-size: 11px; color: #94a3b8; text-align: center;">This is a system-wide broadcast to all staff of Skyward College.</p>
            </div>
          </div>`
      };
      return transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Broadcast Error:", error);
      return null;
    }
  });

// 4. SECURE AUTH PASSWORD UPDATE (Admin SDK)
exports.handleAdminPasswordUpdate = functions.firestore
  .document('passwordResets/{resetId}')
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const previousData = change.before.data();

    if (previousData.status === 'pending' && newData.status === 'verified' && newData.newPassword) {
      try {
        const userRecord = await admin.auth().getUserByEmail(newData.email);
        
        await admin.auth().updateUser(userRecord.uid, {
          password: newData.newPassword
        });

        // Delete password from Firestore for security after successful Auth update
        return change.after.ref.update({ 
          status: 'completed',
          newPassword: admin.firestore.FieldValue.delete() 
        });
      } catch (error) {
        console.error("Auth Reset Error:", error);
        return null;
      }
    }
    return null;
  });