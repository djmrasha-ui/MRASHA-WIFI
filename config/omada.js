const axios = require('axios');
const https = require('https');

// Omada Controller hutumia Self-Signed SSL
const agent = new https.Agent({ rejectUnauthorized: false });

const grantInternetAccess = async (macAddress, durationMinutes) => {
    const omadaBaseUrl = process.env.OMADA_URL || 'https://192.168.0.100:8043';
    const omadaSiteId = process.env.OMADA_SITE_ID || 'default';
    const username = process.env.OMADA_USER || 'admin';
    const password = process.env.OMADA_PASSWORD || 'admin123';

    try {
        // 1. Login kwenye Omada Controller
        const loginRes = await axios.post(`${omadaBaseUrl}/api/v2/login`, {
            username: username,
            password: password
        }, { httpsAgent: agent });

        const token = loginRes.data.result.token;
        const cookie = loginRes.headers['set-cookie'];

        // 2. Tuma ombi la Authorize Client kwa MAC Address
        await axios.post(
            `${omadaBaseUrl}/api/v2/sites/${omadaSiteId}/cmd/authorizations`,
            {
                mac: macAddress,
                time: durationMinutes * 60, // Muda kwa sekunde
                auth_type: 4
            },
            {
                headers: {
                    'Csrf-Token': token,
                    'Cookie': cookie
                },
                httpsAgent: agent
            }
        );

        console.log(`[Omada API] MAC: ${macAddress} ameruhusiwa intaneti kwa dakika ${durationMinutes}.`);
        return true;
    } catch (err) {
        console.error('[Omada API Error]:', err.response ? err.response.data : err.message);
        return false;
    }
};

module.exports = { grantInternetAccess };
