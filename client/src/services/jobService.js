import api from './api';

export const jobService = {
  async getJobs(params) {
    const { data } = await api.get('/jobs', { params });
    return data; // { data, pagination }
  },
  async getJobById(id) {
    const { data } = await api.get(`/jobs/${id}`);
    return data.data;
  },
  async createJob(payload) {
    const { data } = await api.post('/jobs', payload);
    return data.data;
  },
  async updateJob(id, payload) {
    const { data } = await api.put(`/jobs/${id}`, payload);
    return data.data;
  },
  async deleteJob(id) {
    const { data } = await api.delete(`/jobs/${id}`);
    return data;
  },
  async closeJob(id) {
    const { data } = await api.put(`/jobs/${id}/close`);
    return data.data;
  },
  async getMyJobs() {
    const { data } = await api.get('/jobs/mine');
    return data.data;
  },
  async applyToJob(id, formData) {
    const { data } = await api.post(`/jobs/${id}/apply`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
  async getApplicants(id) {
    const { data } = await api.get(`/jobs/${id}/applicants`);
    return data.data;
  },
  async saveJob(id) {
    const { data } = await api.post(`/jobs/${id}/save`);
    return data;
  }, 
  async unsaveJob(id) {
    const { data } = await api.delete(`/jobs/${id}/save`);
    return data;
  },
  async getSavedJobs() {
    const { data } = await api.get('/profile/saved-jobs');
    return data.data;
  },
  
};

export const applicationService = {
  async getApplications(params) {
    const { data } = await api.get('/applications', { params });
    return data;
  },
  async updateStatus(id, payload) {
    const { data } = await api.put(`/applications/${id}`, payload);
    return data.data;
  },
  async withdrawApplication(id) {
  const { data } = await api.put(`/applications/${id}/withdraw`);
  return data; 
},
};

export const dashboardService = {
  async getDashboard() {
    const { data } = await api.get('/dashboard');
    return data.data;
  },
};

export const companyService = {
  async getCompanies(params) {
    const { data } = await api.get('/companies', { params });
    return data;
  },
  async upsertMyCompany(payload) {
    const { data } = await api.post('/companies', payload);
    return data.data;
  },
  async getCompanyById(id) {
  const { data } = await api.get(`/companies/${id}`);
  return data.data;
  },
};

export const scraperService = {
  async triggerScrape(search) {
    const { data } = await api.post('/scrape/jobs', { search });
    return data.data;
  },
};
