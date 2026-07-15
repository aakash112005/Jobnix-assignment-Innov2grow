const mongoose = require('mongoose');
 
const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resumeUrl: { type: String, required: true },
    coverLetter: { type: String, default: '' },
    status: {
      type: String,
      enum: ['applied', 'under-review', 'shortlisted', 'rejected', 'hired', 'withdrawn'],
      default: 'applied',
    },
    matchScore: { type: Number, default: null }, // AI resume-matching score (0-100)
    notes: { type: String, default: '' }, // employer's private notes
  },
  { timestamps: true }
);

// A candidate can only apply once per job
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });
applicationSchema.index({ candidate: 1 });
applicationSchema.index({ status: 1 });

module.exports = mongoose.model('Application', applicationSchema);
