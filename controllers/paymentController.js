const db = require('../config/db');
const omadaService = require('../services/omadaService');

// Malipo ya Simu (Mobile Money)
exports.initiatePayment = async (req, res) => {
    const { phone_number, package_id } = req.body;
    const userMac = req.query.clientMac || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '00:00:00:00:00:00';

    try {
        const [pkgRows] = await db.query('SELECT * FROM packages WHERE id = ?', [package_id]);
        let selectedPackage = (pkgRows && pkgRows.length > 0) ? pkgRows[0] : { price: '1000', duration_minutes: 60 };

        const referenceId = 'TXN_' + Date.now();
        await db.query(
            'INSERT INTO transactions (phone_number, reference_id, amount, package_id, status, user_mac) VALUES (?, ?, ?, ?, ?, ?)',
            [phone_number, referenceId, selectedPackage.price, package_id, 'SUCCESS', userMac]
        );

        await omadaService.grantInternetAccess(userMac, selectedPackage.duration_minutes);

        res.render('user/payment-status', {
            message: `Malipo ya TZS ${selectedPackage.price} yamekamilika! Umeruhusiwa kutumia intaneti.`,
            referenceId: referenceId
        });
    } catch (err) {
        console.error("Payment Error:", err);
        res.status(500).send('Imeshindikana kuanzisha malipo. Jaribu tena.');
    }
};

// Kutumia Vocha (Redeem Voucher)
exports.redeemVoucher = async (req, res) => {
    const { voucher_code } = req.body;
    const userMac = req.query.clientMac || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '00:00:00:00:00:00';

    try {
        const [rows] = await db.query(
            'SELECT v.*, p.duration_minutes, p.name as package_name FROM vouchers v JOIN packages p ON v.package_id = p.id WHERE v.code = ? AND v.is_used = FALSE',
            [voucher_code.trim().toUpperCase()]
        );

        if (!rows || rows.length === 0) {
            return res.render('user/payment-status', {
                message: 'Kodi ya Vocha siyo sahihi au imeshatumika!',
                referenceId: 'N/A'
            });
        }

        const voucher = rows[0];

        // Weka vocha kuwa imetumika
        await db.query('UPDATE vouchers SET is_used = TRUE, used_by_mac = ? WHERE id = ?', [userMac, voucher.id]);

        // Ruhusu intaneti kwenye Omada
        await omadaService.grantInternetAccess(userMac, voucher.duration_minutes);

        res.render('user/payment-status', {
            message: `Vocha imekubaliwa! Umepata kifurushi cha ${voucher.package_name}. Enjoy Intaneti!`,
            referenceId: voucher.code
        });

    } catch (err) {
        console.error("Voucher Error:", err);
        res.status(500).send("Imeshindikana kuhakiki vocha.");
    }
};
