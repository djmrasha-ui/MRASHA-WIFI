
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const packageController = require('../controllers/packageController');
const voucherController = require('../controllers/voucherController');
const portalController = require('../controllers/portalController');

router.get('/login', authController.getLoginPage);
router.post('/login', authController.postLogin);
router.get('/dashboard', (req, res) => res.render('admin/dashboard'));

// Package Routes
router.get('/packages', packageController.getPackages);
router.post('/packages', packageController.createPackage);
router.post('/packages/update/:id', packageController.updatePackage);
router.post('/packages/delete/:id', packageController.deletePackage);

// Voucher Routes
router.get('/vouchers', voucherController.getVouchers);
router.post('/vouchers/generate', voucherController.generateVouchers);

// Page Builder Routes
router.get('/page-builder', portalController.getPortalSettings);
router.post('/page-builder', portalController.updatePortalSettings);

module.exports = router;
