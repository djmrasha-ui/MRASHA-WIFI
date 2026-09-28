const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const packageController = require('../controllers/packageController');
const portalController = require('../controllers/portalController');

// Authentication Routes
router.get('/login', authController.getLoginPage);
router.post('/login', authController.postLogin);

// Dashboard Route
router.get('/dashboard', (req, res) => res.render('admin/dashboard'));

// Packages Routes
router.get('/packages', packageController.getPackagesPage);
router.post('/packages/add', packageController.addPackage);
router.get('/packages/delete/:id', packageController.deletePackage);

// Vouchers Route
router.get('/vouchers', (req, res) => res.render('admin/vouchers', { vouchers: [] }));

// Routers & Access Points Route
router.get('/routers', (req, res) => res.render('admin/routers', { routers: [] }));

// Page Builder / Settings Routes
router.get('/settings', portalController.getPortalSettings || ((req, res) => res.render('admin/settings', { settings: {} })));
router.post('/settings', portalController.updatePortalSettings || ((req, res) => res.redirect('/admin/settings')));

module.exports = router;
