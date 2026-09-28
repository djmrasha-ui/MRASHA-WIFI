const fs = require('fs');
const path = require('path');

// Make directories
['controllers', 'routes', 'views/admin'].forEach(dir => {
    fs.mkdirSync(dir, { recursive: true });
});

// 1. Package Controller
fs.writeFileSync('controllers/packageController.js', `
const db = require('../config/db');

exports.getPackages = async (req, res) => {
    try {
        const [packages] = await db.query('SELECT * FROM packages ORDER BY created_at DESC');
        res.render('admin/packages', { packages: packages || [] });
    } catch (err) {
        console.error(err);
        res.render('admin/packages', { packages: [] });
    }
};

exports.createPackage = async (req, res) => {
    const { name, price, duration_minutes } = req.body;
    try {
        await db.query('INSERT INTO packages (name, price, duration_minutes) VALUES (?, ?, ?)', [name, price, duration_minutes]);
        res.redirect('/admin/packages');
    } catch (err) {
        console.error(err);
        res.status(500).send('Imefeli kuhifadhi kifurushi');
    }
};
`);

// 2. Portal Controller
fs.writeFileSync('controllers/portalController.js', `
const db = require('../config/db');

exports.getPortalSettings = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM portal_settings LIMIT 1');
        const settings = rows[0] || {};
        res.render('admin/page_builder', { settings });
    } catch (err) {
        console.error(err);
        res.render('admin/page_builder', { settings: {} });
    }
};

exports.updatePortalSettings = async (req, res) => {
    const { site_title, welcome_text, primary_color, background_color, support_phone } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM portal_settings LIMIT 1');
        if (rows.length > 0) {
            await db.query(
                'UPDATE portal_settings SET site_title = ?, welcome_text = ?, primary_color = ?, background_color = ?, support_phone = ? WHERE id = ?',
                [site_title, welcome_text, primary_color, background_color, support_phone, rows[0].id]
            );
        } else {
            await db.query(
                'INSERT INTO portal_settings (site_title, welcome_text, primary_color, background_color, support_phone) VALUES (?, ?, ?, ?, ?)',
                [site_title, welcome_text, primary_color, background_color, support_phone]
            );
        }
        res.redirect('/admin/page-builder');
    } catch (err) {
        console.error(err);
        res.status(500).send('Imefeli kuhifadhi Mipangilio');
    }
};
`);

// 3. Admin Routes
fs.writeFileSync('routes/adminRoutes.js', `
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const packageController = require('../controllers/packageController');
const portalController = require('../controllers/portalController');

router.get('/login', authController.getLoginPage);
router.post('/login', authController.postLogin);
router.get('/dashboard', (req, res) => res.render('admin/dashboard'));

// Package Routes
router.get('/packages', packageController.getPackages);
router.post('/packages', packageController.createPackage);

// Voucher Routes
router.get('/vouchers', (req, res) => res.render('admin/vouchers', { vouchers: [] }));

// Page Builder Routes
router.get('/page-builder', portalController.getPortalSettings);
router.post('/page-builder', portalController.updatePortalSettings);

module.exports = router;
`);

// 4. View: Packages
fs.writeFileSync('views/admin/packages.ejs', `
<!DOCTYPE html>
<html lang="sw">
<head>
    <meta charset="UTF-8">
    <title>Vifurushi - MRASHA WiFi</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen flex">
    <div class="w-64 bg-slate-900 text-white min-h-screen p-6 flex flex-col justify-between">
        <div>
            <h1 class="text-2xl font-bold text-blue-400 mb-8">MRASHA WiFi</h1>
            <nav class="space-y-3">
                <a href="/admin/dashboard" class="block py-2.5 px-4 rounded hover:bg-slate-800">Dashboard</a>
                <a href="/admin/packages" class="block py-2.5 px-4 rounded bg-blue-600 font-semibold">Vifurushi (Packages)</a>
                <a href="/admin/vouchers" class="block py-2.5 px-4 rounded hover:bg-slate-800">Vocha (Vouchers)</a>
                <a href="/admin/page-builder" class="block py-2.5 px-4 rounded hover:bg-slate-800">Page Builder (Portal)</a>
            </nav>
        </div>
        <a href="/admin/login" class="block py-2.5 px-4 rounded text-red-400 hover:bg-slate-800">Ondoka (Logout)</a>
    </div>

    <div class="flex-1 p-10">
        <h2 class="text-3xl font-bold text-gray-800 mb-6">Usimamizi wa Vifurushi</h2>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="bg-white p-6 rounded-xl shadow-md lg:col-span-1">
                <h3 class="text-xl font-bold text-gray-800 mb-4">Tengeneza Kifurushi</h3>
                <form action="/admin/packages" method="POST" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Jina la Kifurushi</label>
                        <input type="text" name="name" required class="w-full mt-1 p-2 border rounded-md">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Bei (TZS)</label>
                        <input type="number" name="price" required class="w-full mt-1 p-2 border rounded-md">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Muda (Dakika)</label>
                        <input type="number" name="duration_minutes" required class="w-full mt-1 p-2 border rounded-md">
                    </div>
                    <button type="submit" class="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">Hifadhi Kifurushi</button>
                </form>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-md lg:col-span-2">
                <h3 class="text-xl font-bold text-gray-800 mb-4">Orodha ya Vifurushi</h3>
                <table class="w-full text-left border-collapse">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="p-3 text-sm font-semibold text-gray-600">Jina</th>
                            <th class="p-3 text-sm font-semibold text-gray-600">Bei</th>
                            <th class="p-3 text-sm font-semibold text-gray-600">Muda</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <% if (packages && packages.length > 0) { %>
                            <% packages.forEach(pkg => { %>
                                <tr>
                                    <td class="p-3 text-sm font-medium text-gray-800"><%= pkg.name %></td>
                                    <td class="p-3 text-sm text-gray-600"><%= pkg.price %> TZS</td>
                                    <td class="p-3 text-sm text-gray-600"><%= pkg.duration_minutes %> Dakika</td>
                                </tr>
                            <% }) %>
                        <% } else { %>
                            <tr><td colspan="3" class="p-3 text-sm text-gray-500 text-center">Hakuna vifurushi bado.</td></tr>
                        <% } %>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</body>
</html>
`);

// 5. View: Vouchers
fs.writeFileSync('views/admin/vouchers.ejs', `
<!DOCTYPE html>
<html lang="sw">
<head>
    <meta charset="UTF-8">
    <title>Vocha - MRASHA WiFi</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen flex">
    <div class="w-64 bg-slate-900 text-white min-h-screen p-6 flex flex-col justify-between">
        <div>
            <h1 class="text-2xl font-bold text-blue-400 mb-8">MRASHA WiFi</h1>
            <nav class="space-y-3">
                <a href="/admin/dashboard" class="block py-2.5 px-4 rounded hover:bg-slate-800">Dashboard</a>
                <a href="/admin/packages" class="block py-2.5 px-4 rounded hover:bg-slate-800">Vifurushi (Packages)</a>
                <a href="/admin/vouchers" class="block py-2.5 px-4 rounded bg-blue-600 font-semibold">Vocha (Vouchers)</a>
                <a href="/admin/page-builder" class="block py-2.5 px-4 rounded hover:bg-slate-800">Page Builder (Portal)</a>
            </nav>
        </div>
        <a href="/admin/login" class="block py-2.5 px-4 rounded text-red-400 hover:bg-slate-800">Ondoka (Logout)</a>
    </div>

    <div class="flex-1 p-10">
        <h2 class="text-3xl font-bold text-gray-800 mb-6">Usimamizi wa Vocha</h2>
        <div class="bg-white p-6 rounded-xl shadow-md">
            <p class="text-gray-600">Sehemu ya kuzalisha (generate) Vocha kwa ajili ya wateja.</p>
        </div>
    </div>
</body>
</html>
`);

// 6. View: Page Builder
fs.writeFileSync('views/admin/page_builder.ejs', `
<!DOCTYPE html>
<html lang="sw">
<head>
    <meta charset="UTF-8">
    <title>Page Builder - MRASHA WiFi</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen flex">
    <div class="w-64 bg-slate-900 text-white min-h-screen p-6 flex flex-col justify-between">
        <div>
            <h1 class="text-2xl font-bold text-blue-400 mb-8">MRASHA WiFi</h1>
            <nav class="space-y-3">
                <a href="/admin/dashboard" class="block py-2.5 px-4 rounded hover:bg-slate-800">Dashboard</a>
                <a href="/admin/packages" class="block py-2.5 px-4 rounded hover:bg-slate-800">Vifurushi (Packages)</a>
                <a href="/admin/vouchers" class="block py-2.5 px-4 rounded hover:bg-slate-800">Vocha (Vouchers)</a>
                <a href="/admin/page-builder" class="block py-2.5 px-4 rounded bg-blue-600 font-semibold">Page Builder (Portal)</a>
            </nav>
        </div>
        <a href="/admin/login" class="block py-2.5 px-4 rounded text-red-400 hover:bg-slate-800">Ondoka (Logout)</a>
    </div>

    <div class="flex-1 p-10">
        <h2 class="text-3xl font-bold text-gray-800 mb-6">Page Builder (Muonekano wa Ukurasa wa Mteja)</h2>
        <div class="bg-white p-6 rounded-xl shadow-md max-w-2xl">
            <form action="/admin/page-builder" method="POST" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Kichwa cha Ukurasa (Site Title)</label>
                    <input type="text" name="site_title" value="<%= settings.site_title || 'Karibu WiFi Hotspot' %>" class="w-full mt-1 p-2 border rounded-md">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Ujumbe wa Karibu (Welcome Text)</label>
                    <textarea name="welcome_text" class="w-full mt-1 p-2 border rounded-md"><%= settings.welcome_text || '' %></textarea>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Rangi Kuu (Primary Color)</label>
                        <input type="color" name="primary_color" value="<%= settings.primary_color || '#3B82F6' %>" class="w-full h-10 mt-1 border rounded-md">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Namba ya Msaada</label>
                        <input type="text" name="support_phone" value="<%= settings.support_phone || '' %>" class="w-full mt-1 p-2 border rounded-md">
                    </div>
                </div>
                <button type="submit" class="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">Hifadhi Mabadiliko</button>
            </form>
        </div>
    </div>
</body>
</html>
`);

console.log('Kurasa zote zimeundwa na kuunganishwa vizuri!');
