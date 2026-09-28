const fs = require('fs');

// 1. Voucher Controller
fs.writeFileSync('controllers/voucherController.js', `
const db = require('../config/db');

// In-memory fallback
global.mockVouchers = global.mockVouchers || [];

exports.getVouchers = async (req, res) => {
    let packages = global.mockPackages || [];
    try {
        const [pkgRows] = await db.query('SELECT * FROM packages');
        if (pkgRows && pkgRows.length > 0) packages = pkgRows;
    } catch (err) {}

    try {
        const [vouchers] = await db.query(\`
            SELECT v.*, p.name as package_name, p.price 
            FROM vouchers v 
            JOIN packages p ON v.package_id = p.id 
            ORDER BY v.created_at DESC
        \`);
        res.render('admin/vouchers', { vouchers, packages });
    } catch (err) {
        res.render('admin/vouchers', { vouchers: global.mockVouchers, packages });
    }
};

exports.generateVouchers = async (req, res) => {
    const { package_id, count } = req.body;
    const numToGenerate = parseInt(count) || 1;
    const pkgId = parseInt(package_id);

    let pkgName = 'Kifurushi';
    let pkgPrice = 0;
    const foundPkg = (global.mockPackages || []).find(p => p.id == pkgId);
    if (foundPkg) {
        pkgName = foundPkg.name;
        pkgPrice = foundPkg.price;
    }

    const newVouchers = [];
    for (let i = 0; i < numToGenerate; i++) {
        // Tengeneza kodi ya tarakimu 6 za idadi na herufi
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        newVouchers.push({
            id: Date.now() + i,
            code,
            package_id: pkgId,
            package_name: pkgName,
            price: pkgPrice,
            is_used: false,
            created_at: new Date().toLocaleDateString()
        });
    }

    try {
        for (let v of newVouchers) {
            await db.query('INSERT INTO vouchers (code, package_id) VALUES (?, ?)', [v.code, v.package_id]);
        }
    } catch (err) {
        global.mockVouchers.unshift(...newVouchers);
    }

    res.redirect('/admin/vouchers');
};
`);

// 2. Update Admin Routes
fs.writeFileSync('routes/adminRoutes.js', `
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const packageController = require('../controllers/packageController');
const voucherController = require('../controllers/voucherController');
const portalController = require('../controllers/portalController');

router.get('/login', authController.getLoginPage);
router.post('/login', authController.postLogin);
router.get('/dashboard', (req, res) => res.render('admin/dashboard'));

// Package Routes
router.get('/packages', packageController.getPackages);
router.post('/packages', packageController.createPackage);
router.post('/packages/update/:id', packageController.updatePackage);
router.post('/packages/delete/:id', packageController.deletePackage);

// Voucher Routes
router.get('/vouchers', voucherController.getVouchers);
router.post('/vouchers/generate', voucherController.generateVouchers);

// Page Builder Routes
router.get('/page-builder', portalController.getPortalSettings);
router.post('/page-builder', portalController.updatePortalSettings);

module.exports = router;
`);

// 3. Update Vouchers View Page
fs.writeFileSync('views/admin/vouchers.ejs', `
<!DOCTYPE html>
<html lang="sw">
<head>
    <meta charset="UTF-8">
    <title>Vocha - MRASHA WiFi</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @media print {
            body * { visibility: hidden; }
            #printableArea, #printableArea * { visibility: visible; }
            #printableArea { position: absolute; left: 0; top: 0; width: 100%; }
            .no-print { display: none !important; }
        }
    </style>
</head>
<body class="bg-gray-100 min-h-screen flex">
    <div class="w-64 bg-slate-900 text-white min-h-screen p-6 flex flex-col justify-between no-print">
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
        <div class="flex justify-between items-center mb-6 no-print">
            <h2 class="text-3xl font-bold text-gray-800">Usimamizi wa Vocha</h2>
            <button onclick="window.print()" class="px-5 py-2.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 shadow-md">
                🖨️ Printi Vocha
            </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 no-print">
            <div class="bg-white p-6 rounded-xl shadow-md lg:col-span-1">
                <h3 class="text-xl font-bold text-gray-800 mb-4">Zalisha Vocha Mpya</h3>
                <form action="/admin/vouchers/generate" method="POST" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Chagua Kifurushi</label>
                        <select name="package_id" required class="w-full mt-1 p-2.5 border rounded-md bg-white">
                            <% if (packages && packages.length > 0) { %>
                                <% packages.forEach(pkg => { %>
                                    <option value="<%= pkg.id %>"><%= pkg.name %> - <%= pkg.price %> TZS</option>
                                <% }) %>
                            <% } else { %>
                                <option value="">Tengeneza kifurushi kwanza</option>
                            <% } %>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Idadi ya Vocha</label>
                        <input type="number" name="count" value="5" min="1" max="100" required class="w-full mt-1 p-2 border rounded-md">
                    </div>
                    <button type="submit" class="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">Zalisha (Generate)</button>
                </form>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-md lg:col-span-2">
                <h3 class="text-xl font-bold text-gray-800 mb-4">Muhtasari wa Vocha</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p class="text-xs font-bold text-blue-600 uppercase">Jumla ya Vocha</p>
                        <p class="text-2xl font-bold text-blue-900 mt-1"><%= vouchers.length %></p>
                    </div>
                    <div class="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                        <p class="text-xs font-bold text-emerald-600 uppercase">Hazijatumika</p>
                        <p class="text-2xl font-bold text-emerald-900 mt-1"><%= vouchers.filter(v => !v.is_used).length %></p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Sehemu Inayoweza Ku-printwa -->
        <div id="printableArea">
            <h3 class="text-xl font-bold text-gray-800 mb-4 no-print">Kadi za Vocha</h3>
            <% if (vouchers && vouchers.length > 0) { %>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <% vouchers.forEach(v => { %>
                        <div class="border-2 border-dashed border-gray-400 p-4 rounded-xl bg-white text-center shadow-sm relative">
                            <p class="text-xs font-bold text-blue-600 uppercase tracking-widest">MRASHA WiFi</p>
                            <p class="text-xs text-gray-500 font-medium"><%= v.package_name %></p>
                            <div class="my-3 py-1.5 bg-slate-100 rounded border border-gray-300">
                                <p class="text-lg font-black tracking-widest text-slate-800 font-mono"><%= v.code %></p>
                            </div>
                            <p class="text-xs font-semibold text-gray-700">Bei: <%= v.price %> TZS</p>
                            <span class="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full <%= v.is_used ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600' %> font-bold">
                                <%= v.is_used ? 'IMETUMIKA' : 'INAPATIKANA' %>
                            </span>
                        </div>
                    <% }) %>
                </div>
            <% } else { %>
                <p class="text-gray-500 text-center py-8">Hakuna vocha zilizozalishwa bado.</p>
            <% } %>
        </div>
    </div>
</body>
</html>
`);

console.log('Mfumo wa Vocha umewekwa kikamilifu!');
