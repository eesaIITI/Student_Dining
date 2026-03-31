const router  = require('express').Router();
const Student = require('../models/Student');
const { auth } = require('../middleware/auth');

// POST /api/scan
// Body: { qrPayload: "<json string from QR>" }
router.post('/', auth, async (req, res) => {
  try {
    const { qrPayload } = req.body;
    let parsed;
    try {
      parsed = JSON.parse(qrPayload);
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid QR format' });
    }

    const { studentId, token } = parsed;
    const student = await Student.findById(studentId);

    if (!student)
      return res.status(404).json({ success: false, message: 'Student not found' });

    if (student.qrToken !== token)
      return res.status(400).json({ success: false, message: 'QR token mismatch — invalid QR' });

    if (student.isScanned)
      return res.status(409).json({
        success: false,
        message: 'Already scanned',
        student: { name: student.name, rollNumber: student.rollNumber, scannedAt: student.scannedAt },
      });

    student.isScanned  = true;
    student.scannedAt  = new Date();
    student.scannedBy  = req.user.id;
    await student.save();

    res.json({
      success: true,
      message: 'Access granted',
      student: { name: student.name, rollNumber: student.rollNumber, department: student.department },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/scan/stats
router.get('/stats', auth, async (req, res) => {
  try {
    const total   = await Student.countDocuments();
    const scanned = await Student.countDocuments({ isScanned: true });
    res.json({ total, scanned, remaining: total - scanned });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
