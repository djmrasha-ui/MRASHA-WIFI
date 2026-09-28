
const db = require('../config/db');
const deviceManager = require('../config/deviceManager');

global.mockSettings = global.mockSettings || {
    site_title: 'MRASHA WiFi Hotspot',
    welcome_text: 'Karibu! Ingiza kodi ya vocha yako hapa chini kuanza kutumia internet yenye kasi kubwa.',
    primary_color: '#2563eb',
    support_phone: '+255 700 000 000'
};

exports.getPortalPage = async (req, res) => {
    let settings = global.mockSettings;
    let packages = global.mockPackages || [];

    try {
        const [sRows] = await db.query('SELECT * FROM portal_settings LIMIT 1');
        if (sRows && sRows.length > 0) settings = sRows[0];
        
        const [pRows] = await db.query('SELECT * FROM packages WHERE is_active = TRUE');
        if (pRows && pRows.length > 0) packages = pRows;
    } catch (err) {}

    res.render('user/portal', { settings, packages, message: null, error: null });
};

exports.connectVoucher = async (req, res) => {
    const { code, client_mac } = req.body;
    let settings = global.mockSettings;
    let packages = global.mockPackages || [];

    const voucherCode = code.trim().toUpperCase();
    let voucher = (global.mockVouchers || []).find(v => v.code === voucherCode);

    if (voucher) {
        if (voucher.is_used) {
            return res.render('user/portal', { settings, packages, message: null, error: 'Vocha hii imeshatumika tayari!' });
        }
        
        voucher.is_used = true;

        // Washa internet kwenye MikroTik, Omada EAP 225/255, au zote kwa pamoja!
        await deviceManager.activateInternetAccess(voucherCode, voucher.duration_minutes || 60, client_mac || null);

        return res.render('user/portal', { 
            settings, 
            packages, 
            message: 'Umefanikiwa kuunganishwa na Internet! Vocha (' + voucherCode + ') ipo tayari kwenye MikroTik & TP-Link Omada AP.', 
            error: null 
        });
    }

    res.render('user/portal', { settings, packages, message: null, error: 'Kodi ya vocha siyo sahihi. Tafadhali jaribu tena.' });
};
