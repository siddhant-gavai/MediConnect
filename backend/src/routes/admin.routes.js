const express = require('express');
const { getAllUsers, verifyDoctor, getStats } = require('../controllers/admin.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

const router = express.Router();

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/users', getAllUsers);
router.put('/doctor/:id/verify', verifyDoctor);
router.get('/stats', getStats);

module.exports = router;
