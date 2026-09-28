const fs = require('fs');
const path = require('path');

// Hakikisha folda la config lipo
if (!fs.existsSync('config')) {
    fs.mkdirSync('config');
}

// 1. Tengeneza config/mikrotik.js
fs.writeFileSync('config/mikrotik.js', `
const { RouterOSAPI } = require('node-routeros');

async function addHotspotUser(username, profileName = 'default', limitBytesTotal = 0) {
    const conn = new RouterOSAPI({
        host: process.env.MIKROTIK_HOST || '192.168.88.1',
        user: process.env.MIKROTIK_USER || 'admin',
        password: process.env.MIKROTIK_PASSWORD || '',
        port: parseInt(process.env.MIKROTIK_PORT || '8728'),
        timeout: 5
    });

    try {
        await conn.connect();
        
        const existingUsers = await conn.write('/ip/hotspot/user/print', [
            '?.name=' + username
        ]);

        if (existingUsers.length === 0) {
            await conn.write('/ip/hotspot/user/add', [
                '=name=' + username,
                '=password=' + username,
                '=profile=' + profileName
            ]);
            console.log('Mtumiaji wa MikroTik ' + username + ' ametengenezwa kikamilifu.');
        }

        await conn.close();
        return true;
    } catch (err) {
        console.error('Kosa la MikroTik:', err.message);
        return false;
    }
}

module.exports = { addHotspotUser };
`);

// 2. Tengeneza config/deviceManager.js
fs.writeFileSync('config/deviceManager.js', `
const axios = require('axios');
const https = require('https');
const mikrotik = require('./mikrotik');

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

async function authorizeOmadaUser(macAddress, durationMinutes) {
    const omadaUrl = process.env.OMADA_URL;
    const omadaSite = process.env.OMADA_SITE || 'default';
    const username = process.env.OMADA_USER;
    const password = process.env.OMADA_PASSWORD;

    if (!omadaUrl || !username) {
        return false;
    }

    try {
        const loginRes = await axios.post(\`\${omadaUrl}/api/v2/login\`, {
            username,
            password
        }, { httpsAgent });

        const token = loginRes.data.result.token;

        await axios.post(\`\${omadaUrl}/api/v2/sites/\${omadaSite}/cmd/authorizations\`, {
            mac: macAddress,
            time: durationMinutes * 60 * 1000
        }, {
            headers: { 'Csrf-Token': token },
            httpsAgent
        });

        return true;
    } catch (err) {
        console.error('Kosa la TP-Link Omada AP:', err.message);
        return false;
    }
}

async function activateInternetAccess(usernameOrCode, durationMinutes = 60, clientMac = null) {
    let result = { mikrotik: false, omada: false };

    try {
        result.mikrotik = await mikrotik.addHotspotUser(usernameOrCode, 'default');
    } catch (e) {}

    if (clientMac) {
        try {
            result.omada = await authorizeOmadaUser(clientMac, durationMinutes);
        } catch (e) {}
    }

    return true;
}

module.exports = { authorizeOmadaUser, activateInternetAccess };
`);

console.log('Mafaili ya config/mikrotik.js na config/deviceManager.js yametengenezwa vizuri!');
