/**
 * Reusable Mongoose query builder that powers job search, filtering,
 * sorting and pagination from a single req.query object.
 */
class ApiFeatures {
  constructor(query, queryString) {
    this.query = query; // Mongoose Query
    this.queryString = queryString; // req.query
  }

  search(fields = []) {
    if (this.queryString.search) {
      const regex = new RegExp(this.queryString.search, 'i');
      this.query = this.query.find({
        $or: fields.map((field) => ({ [field]: regex })),
      });
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excluded = ['search', 'page', 'sort', 'limit', 'fields'];
    excluded.forEach((el) => delete queryObj[el]);

    const filters = {};

    if (queryObj.location) filters.location = new RegExp(queryObj.location, 'i');
    if (queryObj.company) filters.company = new RegExp(queryObj.company, 'i');
    if (queryObj.workMode) filters.workMode = queryObj.workMode;
    if (queryObj.employmentType) filters.employmentType = queryObj.employmentType;
    if (queryObj.status) filters.status = queryObj.status;

    if (queryObj.skills) {
      const skillsArr = queryObj.skills.split(',').map((s) => s.trim());
      filters.skills = { $in: skillsArr.map((s) => new RegExp(`^${s}$`, 'i')) };
    }

    if (queryObj.experienceMin || queryObj.experienceMax) {
      filters.experienceMin = {};
      if (queryObj.experienceMin) filters.experienceMin.$gte = Number(queryObj.experienceMin);
      if (queryObj.experienceMax) filters.experienceMin.$lte = Number(queryObj.experienceMax);
    }

    if (queryObj.salaryMin || queryObj.salaryMax) {
      filters.salaryMax = {};
      if (queryObj.salaryMin) filters.salaryMax.$gte = Number(queryObj.salaryMin);
      if (queryObj.salaryMax) filters.salaryMin = { $lte: Number(queryObj.salaryMax) };
    }

    this.query = this.query.find(filters);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt'); // Newest first by default
    }
    return this;
  }

  paginate() {
    const page = Math.max(parseInt(this.queryString.page, 10) || 1, 1);
    const limit = Math.min(parseInt(this.queryString.limit, 10) || 10, 100);
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    this.pagination = { page, limit };
    return this;
  }
}

module.exports = ApiFeatures;
