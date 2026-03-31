const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true },
  rollNumber:   { type: String, required: true, unique: true },
  department:   { type: String, default: '' },
  year:         { type: Number, default: 1 },
  qrCode:       { type: String },          // base64 PNG of QR
  qrToken:      { type: String, unique: true }, // UUID used inside QR payload
  isScanned:    { type: Boolean, default: false },
  scannedAt:    { type: Date },
  scannedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  emailSent:    { type: Boolean, default: false },
  emailSentAt:  { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
