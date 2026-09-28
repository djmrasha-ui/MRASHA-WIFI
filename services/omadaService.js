const axios = require('axios');
const https = require('https');

const agent = new https.Agent({ rejectUnauthorized: false });

exports.grantInternetAccess = async (macAddress, durationMinutes) => {
    const omadaBaseUrl = process.env.OMADA_URL || 'https://192.168.0.100:8043';
    const omadaSiteId = process.env.OMADA_SITE_ID || 'default';
    const username = process.env.OMADA_USER || 'admin';
    const password = process.env.OMADA_PASSWORD || 'admin123';

    try {
        const loginRes = await axios.post(`${omadaBaseUrl}/api/v2/login`, {
            username: username,
            password: password
        }, { httpsAgent: agent });

        const token = loginRes.data.result.token;
        const cookie = loginRes.headers['set-cookie'];

        await axios.post(
            `${omadaBaseUrl}/api/v2/sites/${omadaSiteId}/cmd/authorizations`,
            {
                mac: macAddress,
                time: durationMinutes * 60,
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

        console.log(`[Omada Controller] Mtumiaji mwenye MAC: ${macAddress} ameruhusiwa intaneti kwa dakika ${durationMinutes}.`);
        return true;

    } catch (err) {
        console.error('[Omada API Info]: Controller haijawahi kuunganishwa bado, lakini muamala umekamilika.');
        return false;
    }
};
