
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getPortalPage);
router.post('/connect', userController.connectVoucher);

router.post('/buy-package', (req, res) => {
    const { phone, provider, package_id } = req.body;
    // Hapa tutaunganisha na Payment Gateway (kama AzamPay / Selcom / Lipa Namba API)
    res.render('user/portal', { 
        settings: global.mockSettings, 
        packages: global.mockPackages || [], 
        message: 'Ombi la malipo limetumwa kwenye namba ' + phone + '. Weka PIN ya ' + provider.toUpperCase() + ' kukamilisha!', 
        error: null 
    });
});

module.exports = router;
