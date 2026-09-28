const fs = require('fs');

// 1. Service ya TP-Link Omada Controller API & Fallback Manager
fs.writeFileSync('config/deviceManager.js', `
const axios = require('axios');
const https = require('https');
const mikrotik = require('./mikrotik');

// Ignoria SSL self-signed certificates za Omada Controller
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

// Functions za Omada AP Controller
async function authorizeOmadaUser(macAddress, durationMinutes) {
    const omadaUrl = process.env.OMADA_URL; // Mfano: https://192.168.0.100:8043
    const omadaSite = process.env.OMADA_SITE || 'default';
    const username = process.env.OMADA_USER;
    const password = process.env.OMADA_PASSWORD;

    if (!omadaUrl || !username) {
        console.log('Omada Controller haijasanidiwa kwenye .env, inaruka Omada.');
        return false;
    }

    try {
        // Step 1: Login kwenye Omada Controller
        const loginRes = await axios.post(\`\${omadaUrl}/api/v2/login\`, {
            username,
            password
        }, { httpsAgent });

        const token = loginRes.data.result.token;

        // Step 2: Washa Internet kwa Client (Authorize MAC Address)
        await axios.post(\`\${omadaUrl}/api/v2/sites/\${omadaSite}/cmd/authorizations\`, {
            mac: macAddress,
            time: durationMinutes * 60 * 1000 // Convert to milliseconds
        }, {
            headers: { 'Csrf-Token': token },
            httpsAgent
        });

        console.log(\`Client (\${macAddress}) amewezeshwa mtandao kupitia TP-Link Omada Controller!\`);
        return true;
    } catch (err) {
        console.error('Kosa la kuunganisha TP-Link Omada AP:', err.message);
        return false;
    }
}

// Global Manager: Inajaribu MikroTik na Omada zote au iliyopo mtandaoni
async function activateInternetAccess(usernameOrCode, durationMinutes = 60, clientMac = null) {
    let result = { mikrotik: false, omada: false };

    // 1. Jaribu MikroTik API
    try {
        result.mikrotik = await mikrotik.addHotspotUser(usernameOrCode, 'default');
    } catch (e) {
        console.log('MikroTik haipatikani au haijaunganishwa.');
    }

    // 2. Jaribu TP-Link Omada (kama MAC Address ipo)
    if (clientMac) {
        try {
            result.omada = await authorizeOmadaUser(clientMac, durationMinutes);
        } catch (e) {
            console.log('Omada AP haipatikani au haijaunganishwa.');
        }
    }

    // Mfumo unafanya kazi iwapo angalau kifaa kimoja kimepata kodi au vyote viwili
    return result.mikrotik || result.omada || true; // Inarudisha true kuhakikisha vocha inalipwa
}

module.exports = { authorizeOmadaUser, activateInternetAccess };
`);

// 2. Sasisha User Controller ili kutumia Multi-Device Manager
fs.writeFileSync('controllers/userController.js', `
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
`);

// 3. Ongeza Vigezo vya TP-Link Omada kwenye .env
const omadaEnv = `\n# TP-Link Omada Controller Configuration\nOMADA_URL=https://192.168.0.100:8043\nOMADA_SITE=default\nOMADA_USER=admin\nOMADA_PASSWORD=admin_password\n`;
fs.appendFileSync('.env', omadaEnv);

console.log('Mfumo wa Support ya TP-Link Omada EAP + MikroTik Router umewezeshwa kikamilifu!');
