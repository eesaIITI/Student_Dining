const router  = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const QRCode  = require('qrcode');
const Student = require('../models/Student');
const { auth, adminOnly } = require('../middleware/auth');

// Generate QR for one student
async function generateQR(student) {
  const token = uuidv4();
  const payload = JSON.stringify({ studentId: student._id.toString(), token });
  const qrBase64 = await QRCode.toDataURL(payload, { errorCorrectionLevel: 'H', width: 300 });
  student.qrToken = token;
  student.qrCode  = qrBase64;
  await student.save();
  return student;
}

// GET /api/students  — list all
router.get('/', auth, async (req, res) => {
  try {
    const students = await Student.find().sort({ name: 1 }).select('-qrCode');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/students/:id  — single student (with QR)
router.get('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/students  — add single student
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const student = new Student(req.body);
    await generateQR(student);
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/students/bulk  — CSV bulk import
router.post('/bulk', auth, adminOnly, async (req, res) => {
  try {
    const { students: list } = req.body; // array of {name, email, rollNumber, ...}
    const created = [];
    for (const s of list) {
      const student = new Student(s);
      await generateQR(student);
      created.push(student);
    }
    await Student.insertMany(created);
    res.status(201).json({ count: created.length, message: `${created.length} students added` });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/students/:id
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/students/:id/regenerate-qr
router.post('/:id/regenerate-qr', auth, adminOnly, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Not found' });
    student.isScanned = false;
    student.scannedAt = null;
    await generateQR(student);
    res.json({ message: 'QR regenerated', qrCode: student.qrCode });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
