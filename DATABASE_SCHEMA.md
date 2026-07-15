# Database Schema — AI-Ready Job Portal (MongoDB / Mongoose)

MongoDB was chosen per the project brief. Below is each collection's shape,
its indexes, and how collections relate to one another.

## Collections

### Users
| Field | Type | Notes |
|---|---|---|
| name | String | required |
| email | String | required, unique, indexed |
| password | String | bcrypt-hashed, `select: false` |
| role | enum: admin / employer / candidate | default `candidate` |
| avatar, phone, bio | String | optional profile fields |
| skills | [String] | candidate only |
| experience | Number | years, candidate only |
| resumeUrl | String | candidate only |
| company | ObjectId → Companies | employer only |
| savedJobs | [ObjectId → Jobs] | denormalized convenience list (source of truth is `SavedJobs`) |
| isActive | Boolean | admin can deactivate accounts |
| refreshTokens | [String] | rotated JWT refresh tokens, up to 5 devices |
| resetPasswordToken / Expires | String / Date | forgot-password flow |

**Indexes:** `email` (unique), `role`.

### Companies
| Field | Type | Notes |
|---|---|---|
| name | String | required |
| logo, website, industry, size, location, description | String | |
| owner | ObjectId → Users | required, the employer who owns this profile |
| isVerified | Boolean | admin-controlled |

**Indexes:** `name` (text).

### Jobs
| Field | Type | Notes |
|---|---|---|
| title, company, location | String | required |
| companyRef | ObjectId → Companies | optional link to a verified company |
| workMode | enum: remote / onsite / hybrid | required |
| employmentType | enum: full-time / part-time / contract / internship / freelance | required |
| salaryMin, salaryMax, salaryCurrency | Number / String | |
| experienceMin, experienceMax | Number | years |
| skills | [String] | |
| description | String | required |
| benefits | [String] | |
| deadline | Date | |
| createdBy | ObjectId → Users | optional — null for scraped jobs |
| status | enum: open / closed / draft | default `open` |
| applicantsCount, views | Number | denormalized counters |
| source, sourceUrl, externalId | String | scraper metadata |
| postedDate | Date | |

**Indexes:** text index on `title, description, skills`; single-field indexes on `location`, `workMode`, `employmentType`, `status`, `createdAt`; a **unique compound index on `(source, externalId)`** — this is what prevents duplicate scraped jobs.

### Applications
| Field | Type | Notes |
|---|---|---|
| job | ObjectId → Jobs | required |
| candidate | ObjectId → Users | required |
| resumeUrl | String | required |
| coverLetter | String | |
| status | enum: applied / under-review / shortlisted / rejected / hired | default `applied` |
| matchScore | Number (0–100) | AI resume-matching score |
| notes | String | employer's private notes |

**Indexes:** unique compound `(job, candidate)` — one application per candidate per job; `candidate`; `status`.

### SavedJobs
| Field | Type | Notes |
|---|---|---|
| candidate | ObjectId → Users | required |
| job | ObjectId → Jobs | required |

**Indexes:** unique compound `(candidate, job)`.

## Relationships

```
Users (employer) 1───1 Companies
Users (employer) 1───N Jobs            (createdBy)
Companies        1───N Jobs            (companyRef)
Users (candidate)1───N Applications
Jobs             1───N Applications
Users (candidate)1───N SavedJobs
Jobs             1───N SavedJobs
```

## Design notes

- **Roles** are stored as an enum field on `Users` rather than a separate
  `Roles` collection, since the assignment defines exactly three fixed
  roles with no per-role custom permissions — a normalized roles table
  would add a join with no real benefit. Role-based access is enforced in
  the `authorize()` middleware, not the schema.
- **Duplicate prevention for scraped jobs** relies on MongoDB's unique
  compound index on `(source, externalId)` rather than application-level
  checks alone, so the guarantee holds even under concurrent scrape runs.
- **Refresh tokens** are stored per-user (last 5) rather than in a separate
  collection to keep the "logged in devices" model simple; this is a
  reasonable tradeoff for the assignment's scope.
