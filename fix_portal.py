import os

files = {
'controllers/portalController.js': '''const db = require('../config/db');

// Kusoma na kuonyesha User Landing Page / Captive Portal
exports.getLandingPage = async (req, res) => {
    try {
        let settings = {};
        let packages = [];

        // Fetch settings
        try {
            const [settingRows] = await db.query('SELECT * FROM portal_settings LIMIT 1');
            if (settingRows && settingRows.length > 0) {
                settings = settingRows[0];
            } else {
                settings = {
                    site_title: 'WIFI POWER',
                    welcome_text: 'Choose a package and start using high-speed internet!',
                    primary_color: '#1d4ed8',
                    support_phone: '255700000000'
                };
            }
        } catch (e) {
            console.error('Settings DB Error:', e.message);
        }

        // Fetch packages
        try {
            const [packageRows] = await db.query('SELECT * FROM packages ORDER BY price ASC');
            if (packageRows) {
                packages = packageRows;
            }
        } catch (e) {
            console.error('Packages DB Error:', e.message);
        }

        res.render('user/index', { settings, packages });
    } catch (err) {
        console.error('Portal Rendering Error:', err.message);
        res.status(500).send('Kuna shida kwenye kupakia ukurasa wa WiFi.');
    }
};

// Admin: Kusoma settings za Page Builder
exports.getPortalSettings = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM portal_settings LIMIT 1');
        const settings = rows[0] || {
            site_title: 'WIFI POWER',
            welcome_text: 'Choose a package and start using high-speed internet!',
            primary_color: '#1d4ed8',
            support_phone: '255700000000'
        };
        res.render('admin/page-builder', { settings });
    } catch (err) {
        console.error('Error fetching admin portal settings:', err.message);
        res.status(500).send('Imeshindikana kupakia Admin Page Builder.');
    }
};

// Admin: Kuhifadhi settings za Page Builder
exports.savePortalSettings = async (req, res) => {
    const { site_title, welcome_text, primary_color, support_phone, logo_url } = req.body;
    try {
        const [existing] = await db.query('SELECT id FROM portal_settings LIMIT 1');
        if (existing && existing.length > 0) {
            await db.query(
                'UPDATE portal_settings SET site_title = ?, welcome_text = ?, primary_color = ?, support_phone = ?, logo_url = ? WHERE id = ?',
                [site_title, welcome_text, primary_color, support_phone, logo_url || '', existing[0].id]
            );
        } else {
            await db.query(
                'INSERT INTO portal_settings (site_title, welcome_text, primary_color, support_phone, logo_url) VALUES (?, ?, ?, ?, ?)',
                [site_title, welcome_text, primary_color, support_phone, logo_url || '']
            );
        }
        res.redirect('/admin/page-builder');
    } catch (err) {
        console.error('Error saving portal settings:', err.message);
        res.status(500).send('Imeshindikana kuhifadhi mipangilio.');
    }
};
'''
}

for path, content in files.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(content)

print('✅ File la portalController.js limerekebishwa kwa usalama!')
