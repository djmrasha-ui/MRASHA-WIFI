const fs = require('fs');

// 1. User/Portal Controller
fs.writeFileSync('controllers/userController.js', `
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
`);

// 2. Portal Controller update kwa ajili ya memory storage
fs.writeFileSync('controllers/portalController.js', `
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
`);

// 3. View ya Mteja (User Captive Portal Page)
fs.writeFileSync('views/user/portal.ejs', `
<!DOCTYPE html>
<html lang="sw">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= settings.site_title %></title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <!-- Header Banner -->
        <div style="background-color: <%= settings.primary_color %>;" class="p-8 text-white text-center">
            <h1 class="text-3xl font-black tracking-wide"><%= settings.site_title %></h1>
            <p class="text-sm opacity-90 mt-2"><%= settings.welcome_text %></p>
        </div>

        <div class="p-6 space-y-6">
            <!-- Messages -->
            <% if (error) { %>
                <div class="p-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded-lg text-center font-medium">
                    <%= error %>
                </div>
            <% } %>

            <% if (message) { %>
                <div class="p-3 bg-emerald-100 border border-emerald-300 text-emerald-700 text-sm rounded-lg text-center font-medium">
                    <%= message %>
                </div>
            <% } %>

            <!-- Form ya Ingiza Vocha -->
            <form action="/connect" method="POST" class="space-y-4">
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Kodi ya Vocha (Voucher Code)</label>
                    <input type="text" name="code" placeholder="Mfano: X8K9L2" required class="w-full text-center text-xl font-mono uppercase tracking-widest p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500">
                </div>
                <button type="submit" style="background-color: <%= settings.primary_color %>;" class="w-full py-3.5 text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition">
                    Unganisha WiFi
                </button>
            </form>

            <!-- Orodha ya Vifurushi vinavyopatikana -->
            <div class="border-t pt-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wider text-center mb-3">Vifurushi Vinavyopatikana</p>
                <div class="grid grid-cols-2 gap-2">
                    <% (packages || []).forEach(pkg => { %>
                        <div class="p-2.5 bg-gray-50 rounded-lg border text-center">
                            <p class="text-xs font-bold text-gray-800"><%= pkg.name %></p>
                            <p class="text-sm font-black text-blue-600"><%= pkg.price %> TZS</p>
                        </div>
                    <% }) %>
                </div>
            </div>

            <!-- Namba ya Msaada -->
            <% if (settings.support_phone) { %>
                <div class="text-center pt-2">
                    <p class="text-xs text-gray-500">Msaada / Huduma kwa Wateja:</p>
                    <p class="text-sm font-bold text-gray-700"><%= settings.support_phone %></p>
                </div>
            <% } %>
        </div>
    </div>
</body>
</html>
`);

// 4. Update Server.js Kuweka Njia za User Portal
fs.writeFileSync('server.js', `
const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Admin Routes
const adminRoutes = require('./routes/adminRoutes');
app.use('/admin', adminRoutes);

// User / Captive Portal Routes
const userController = require('./controllers/userController');
app.get('/', userController.getPortalPage);
app.post('/connect', userController.connectVoucher);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(\`Server ina-run kwenye port \${PORT}\`);
});
`);

console.log('User Captive Portal imewezeshwa vizuri!');
