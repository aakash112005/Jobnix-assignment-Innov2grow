const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    logo: { type: String, default: '' },
    website: { type: String, default: '' },
    industry: { type: String, default: '' },
    size: { type: String, default: '' }, // e.g. "1-10", "51-200"
    location: { type: String, default: '' },
    description: { type: String, default: '' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

companySchema.index({ name: 'text' });

module.exports = mongoose.model('Company', companySchema);
