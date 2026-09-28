const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const paymentController = require('../controllers/paymentController');

router.get('/portal', userController.getPortalPage);
router.post('/pay', paymentController.initiatePayment);
router.post('/redeem-voucher', paymentController.redeemVoucher);

module.exports = router;
