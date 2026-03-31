const router      = require('express').Router();
const nodemailer  = require('nodemailer');
const Student     = require('../models/Student');
const { auth, adminOnly } = require('../middleware/auth');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail', // or 'SendGrid', etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendQREmail(student, eventName) {
  // Strip data URL prefix to get raw base64
  const base64 = student.qrCode.replace(/^data:image\/png;base64,/, '');

  await transporter.sendMail({
    from: `"${process.env.EMAIL_FROM_NAME || 'EE Dept Dining'}" <${process.env.EMAIL_USER}>`,
    to: student.email,
    subject: `Your Dining Pass — ${eventName}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px">
        <h2 style="color:#1a1a2e">Hi ${student.name},</h2>
        <p>Your personal QR dining pass for <strong>${eventName}</strong> is attached below.</p>
        <p><strong>Show this QR code at the entrance to receive your meal.</strong></p>
        <div style="text-align:center;margin:24px 0">
          <img src="cid:qrcode" alt="QR Code" style="width:220px;height:220px;border:1px solid #ddd;border-radius:8px"/>
        </div>
        <p style="color:#666;font-size:13px">Roll No: ${student.rollNumber} &nbsp;|&nbsp; Department: ${student.department}</p>
        <p style="color:#999;font-size:12px;margin-top:24px">This QR code is unique to you. Do not share it.</p>
      </div>
    `,
    attachments: [{
      filename: 'dining-pass.png',
      content:  base64,
      encoding: 'base64',
      cid:      'qrcode',
    }],
  });
}

// POST /api/email/send-all  — send to all students who haven't received email yet
router.post('/send-all', auth, adminOnly, async (req, res) => {
  try {
    const { eventName } = req.body;
    if (!eventName) return res.status(400).json({ message: 'eventName is required' });

    const students = await Student.find({ emailSent: false, qrCode: { $exists: true } });
    if (!students.length) return res.json({ message: 'No pending emails', sent: 0 });

    let sent = 0, failed = 0;
    for (const student of students) {
      try {
        await sendQREmail(student, eventName);
        student.emailSent   = true;
        student.emailSentAt = new Date();
        await student.save();
        sent++;
      } catch {
        failed++;
      }
    }
    res.json({ message: `Emails sent: ${sent}, failed: ${failed}`, sent, failed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/email/send/:id  — resend to one student
router.post('/send/:id', auth, adminOnly, async (req, res) => {
  try {
    const { eventName } = req.body;
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    await sendQREmail(student, eventName || 'Dining Event');
    student.emailSent   = true;
    student.emailSentAt = new Date();
    await student.save();
    res.json({ message: `Email sent to ${student.email}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
