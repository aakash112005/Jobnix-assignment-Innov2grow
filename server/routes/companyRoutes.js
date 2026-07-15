const express = require('express');
const {
  getCompanies,
  getCompanyById,
  upsertMyCompany,
  deleteCompany,
} = require('../controllers/companyController');
const { protect } = require('../middlewares/auth');
const authorize = require('../middlewares/roleAuth');

const router = express.Router();

router.get('/', getCompanies);
router.get('/:id', getCompanyById);
router.post('/', protect, authorize('employer'), upsertMyCompany);
router.delete('/:id', protect, authorize('admin'), deleteCompany);

module.exports = router;
