const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    company: { type: String, required: [true, 'Company is required'], trim: true },
    companyRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    location: { type: String, required: [true, 'Location is required'], trim: true },
    workMode: {
      type: String,
      enum: ['remote', 'onsite', 'hybrid'],
      required: true,
    },
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
      required: true,
    },
    salaryMin: { type: Number, default: 0 },
    salaryMax: { type: Number, default: 0 },
    salaryCurrency: { type: String, default: 'USD' },
    experienceMin: { type: Number, default: 0 }, // years
    experienceMax: { type: Number, default: 0 },
    skills: [{ type: String, trim: true }],
    description: { type: String, required: [true, 'Description is required'] },
    benefits: [{ type: String }],
    deadline: { type: Date },
    // Not required: scraped jobs (source !== 'internal') have no owning user
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['open', 'closed', 'draft'],
      default: 'open',
    },
    applicantsCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },

    // Scraper metadata
    source: { type: String, default: 'internal' }, // e.g. "internal", "remotive"
    sourceUrl: { type: String, default: '' },
    externalId: { type: String, default: '' }, // used for de-duplication
    postedDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

jobSchema.index({ title: 'text', description: 'text', skills: 'text' });
jobSchema.index({ location: 1 });
jobSchema.index({ workMode: 1 });
jobSchema.index({ employmentType: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ createdAt: -1 });
// Prevents duplicate scraped jobs from the same source
jobSchema.index({ source: 1, externalId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Job', jobSchema);
