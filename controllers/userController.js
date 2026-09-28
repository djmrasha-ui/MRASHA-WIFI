
const db = require('../config/db');

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
    const { code } = req.body;
    let settings = global.mockSettings;
    let packages = global.mockPackages || [];

    // Tafuta vocha kwenye memory store au db
    let voucher = (global.mockVouchers || []).find(v => v.code === code.trim().toUpperCase());

    if (voucher) {
        if (voucher.is_used) {
            return res.render('user/portal', { settings, packages, message: null, error: 'Vocha hii imeshatumika tayari!' });
        }
        voucher.is_used = true;
        return res.render('user/portal', { settings, packages, message: 'Umefanikiwa kuunganishwa na Internet! Tengeneza muunganisho ufurahie huduma.', error: null });
    }

    res.render('user/portal', { settings, packages, message: null, error: 'Kodi ya vocha siyo sahihi. Tafadhali jaribu tena.' });
};
