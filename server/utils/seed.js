require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');

const seed = async () => {
  await connectDB();
  console.log('Clearing existing demo data...');
  await Promise.all([User.deleteMany({}), Company.deleteMany({}), Job.deleteMany({})]);

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@jobportal.com',
    password: 'Password123',
    role: 'admin',
  });

  const employer = await User.create({
    name: 'Jordan Employer',
    email: 'employer@jobportal.com',
    password: 'Password123',
    role: 'employer',
  });

  const candidate = await User.create({
    name: 'Alex Candidate',
    email: 'candidate@jobportal.com',
    password: 'Password123',
    role: 'candidate',
    skills: ['React', 'Node.js', 'MongoDB'],
    experience: 3,
  });

  const company = await Company.create({
    name: 'NovaTech Labs',
    industry: 'Software',
    size: '51-200',
    location: 'Remote',
    description: 'We build developer tools used by thousands of engineering teams.',
    owner: employer._id,
  });
  employer.company = company._id;
  await employer.save();

  const jobsData = [
    {
      title: 'Senior Frontend Engineer',
      company: company.name,
      companyRef: company._id,
      location: 'Remote',
      workMode: 'remote',
      employmentType: 'full-time',
      salaryMin: 90000,
      salaryMax: 130000,
      experienceMin: 3,
      experienceMax: 7,
      skills: ['React', 'TypeScript', 'Tailwind CSS'],
      description: 'Own the frontend architecture for our flagship analytics product.',
      benefits: ['Remote-first', 'Health insurance', 'Unlimited PTO'],
      createdBy: employer._id,
    },
    {
      title: 'Backend Engineer (Node.js)',
      company: company.name,
      companyRef: company._id,
      location: 'Bengaluru, India',
      workMode: 'hybrid',
      employmentType: 'full-time',
      salaryMin: 1200000,
      salaryMax: 2000000,
      salaryCurrency: 'INR',
      experienceMin: 2,
      experienceMax: 5,
      skills: ['Node.js', 'Express', 'MongoDB'],
      description: 'Design and scale our core job-matching APIs.',
      benefits: ['Stock options', 'Learning budget'],
      createdBy: employer._id,
    },
    {
      title: 'Product Design Intern',
      company: company.name,
      companyRef: company._id,
      location: 'New York, NY',
      workMode: 'onsite',
      employmentType: 'internship',
      salaryMin: 25,
      salaryMax: 35,
      experienceMin: 0,
      experienceMax: 1,
      skills: ['Figma', 'UI Design'],
      description: 'Support the design team on new candidate-facing features.',
      benefits: ['Mentorship', 'Housing stipend'],
      createdBy: employer._id,
    },
  ];

  await Job.insertMany(jobsData);

  console.log('Seed complete:');
  console.log('  Admin:     admin@jobportal.com / Password123');
  console.log('  Employer:  employer@jobportal.com / Password123');
  console.log('  Candidate: candidate@jobportal.com / Password123');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
