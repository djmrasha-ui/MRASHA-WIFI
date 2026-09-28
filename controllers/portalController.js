
const db = require('../config/db');

exports.getPortalSettings = async (req, res) => {
    let settings = global.mockSettings || {
        site_title: 'MRASHA WiFi Hotspot',
        welcome_text: 'Karibu! Ingiza kodi ya vocha yako hapa chini.',
        primary_color: '#2563eb',
        support_phone: '+255 700 000 000'
    };
    try {
        const [rows] = await db.query('SELECT * FROM portal_settings LIMIT 1');
        if (rows && rows.length > 0) settings = rows[0];
    } catch (err) {}
    res.render('admin/page_builder', { settings });
};

exports.updatePortalSettings = async (req, res) => {
    const { site_title, welcome_text, primary_color, support_phone } = req.body;
    global.mockSettings = { site_title, welcome_text, primary_color, support_phone };
    
    try {
        const [rows] = await db.query('SELECT * FROM portal_settings LIMIT 1');
        if (rows.length > 0) {
            await db.query(
                'UPDATE portal_settings SET site_title = ?, welcome_text = ?, primary_color = ?, support_phone = ? WHERE id = ?',
                [site_title, welcome_text, primary_color, support_phone, rows[0].id]
            );
        } else {
            await db.query(
                'INSERT INTO portal_settings (site_title, welcome_text, primary_color, support_phone) VALUES (?, ?, ?, ?)',
                [site_title, welcome_text, primary_color, support_phone]
            );
        }
    } catch (err) {}

    res.redirect('/admin/page-builder');
};
