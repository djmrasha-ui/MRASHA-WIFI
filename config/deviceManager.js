
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
        const loginRes = await axios.post(`${omadaUrl}/api/v2/login`, {
            username,
            password
        }, { httpsAgent });

        const token = loginRes.data.result.token;

        await axios.post(`${omadaUrl}/api/v2/sites/${omadaSite}/cmd/authorizations`, {
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
