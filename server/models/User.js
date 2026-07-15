const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true, 
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'employer', 'candidate'],
      default: 'candidate',
    },
    avatar: { type: String, default: '' },
    phone: { type: String, default: '' },
    bio: { type: String, default: '' },
    skills: [{ type: String }],
    experience: { type: Number, default: 0 }, // years, candidate only
    resumeUrl: { type: String, default: '' },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }, // employer only
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },

    // Refresh token rotation (multiple devices)
    refreshTokens: [{ type: String, select: false }],

    // Forgot password
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function matchPassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.createResetPasswordToken = function createResetPasswordToken() {
  const rawToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  this.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
  return rawToken;
};

userSchema.methods.toSafeObject = function toSafeObject() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshTokens;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
