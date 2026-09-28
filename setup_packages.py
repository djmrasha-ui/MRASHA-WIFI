import os

files = {
'controllers/packageController.js': '''const db = require('../config/db');

// Kusoma Vifurushi Vyote na Kuonyesha kwenye Admin
exports.getAllPackages = async (req, res) => {
    try {
        const [packages] = await db.query('SELECT * FROM packages ORDER BY id DESC');
        res.render('admin/packages', { packages: packages });
    } catch (err) {
        console.error('Error fetching packages:', err.message);
        res.status(500).send('Kuna tatizo la kusoma vifurushi.');
    }
};

// Kuongeza Kifurushi Kipya kutoka kwenye Form ya Admin
exports.addPackage = async (req, res) => {
    const { name, price, duration_minutes, upload_limit_mbps, download_limit_mbps } = req.body;
    try {
        await db.query(
            'INSERT INTO packages (name, price, duration_minutes, upload_limit_mbps, download_limit_mbps) VALUES (?, ?, ?, ?, ?)',
            [name, price, duration_minutes, upload_limit_mbps || 2, download_limit_mbps || 5]
        );
        res.redirect('/admin/packages');
    } catch (err) {
        console.error('Error adding package:', err.message);
        res.status(500).send('Imeshindikana kuhifadhi kifurushi.');
    }
};

// Kufuta Kifurushi
exports.deletePackage = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM packages WHERE id = ?', [id]);
        res.redirect('/admin/packages');
    } catch (err) {
        console.error('Error deleting package:', err.message);
        res.status(500).send('Imeshindikana kufuta kifurushi.');
    }
};
''',

'routes/adminRoutes.js': '''const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');
const portalController = require('../controllers/portalController');

// Admin Dashboard Route
router.get('/dashboard', (req, res) => {
    res.render('admin/dashboard');
});

// Admin Packages Routes
router.get('/packages', packageController.getAllPackages);
router.post('/packages/add', packageController.addPackage);
router.get('/packages/delete/:id', packageController.deletePackage);

// Admin Page Builder Routes
router.get('/page-builder', portalController.getPortalSettings);
router.post('/page-builder/save', portalController.savePortalSettings);

module.exports = router;
''',

'views/admin/packages.ejs': '''<!DOCTYPE html>
<html lang="sw">
<head>
    <meta charset="UTF-8">
    <title>Usimamizi wa Vifurushi - MRASHA WiFi</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen flex">

    <!-- Sidebar -->
    <div class="w-64 bg-slate-900 text-white min-h-screen p-6 flex flex-col justify-between flex-shrink-0">
        <div>
            <h1 class="text-2xl font-bold text-blue-400 mb-8">MRASHA WiFi</h1>
            <nav class="space-y-3">
                <a href="/admin/dashboard" class="block py-2.5 px-4 rounded hover:bg-slate-800">Dashboard</a>
                <a href="/admin/packages" class="block py-2.5 px-4 rounded bg-blue-600 font-semibold">Vifurushi (Packages)</a>
                <a href="/admin/vouchers" class="block py-2.5 px-4 rounded hover:bg-slate-800">Vocha (Vouchers)</a>
                <a href="/admin/page-builder" class="block py-2.5 px-4 rounded hover:bg-slate-800">Page Builder (Portal)</a>
            </nav>
        </div>
        <a href="/" class="block py-2.5 px-4 rounded text-red-400 hover:bg-slate-800">Ondoka (Logout)</a>
    </div>

    <!-- Main Content -->
    <div class="flex-1 p-8 overflow-y-auto">
        <h2 class="text-3xl font-bold text-gray-800 mb-6">Usimamizi wa Vifurushi vya WiFi</h2>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <!-- Form ya Kuongeza Kifurushi -->
            <div class="bg-white p-6 rounded-2xl shadow-md space-y-4">
                <h3 class="text-xl font-bold text-gray-800 border-b pb-2">Ongeza Kifurushi Kipya</h3>
                
                <form action="/admin/packages/add" method="POST" class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold uppercase text-gray-500 mb-1">Jina la Kifurushi:</label>
                        <input type="text" name="name" placeholder="Mfano: Saa 1 / Siku 1" required class="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>

                    <div>
                        <label class="block text-xs font-bold uppercase text-gray-500 mb-1">Bei (TZS):</label>
                        <input type="number" name="price" placeholder="Mfano: 500" required class="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>

                    <div>
                        <label class="block text-xs font-bold uppercase text-gray-500 mb-1">Muda (Kwa Dakika):</label>
                        <input type="number" name="duration_minutes" placeholder="60 = Saa 1, 1440 = Siku 1" required class="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>

                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <label class="block text-xs font-bold uppercase text-gray-500 mb-1">Upload (Mbps):</label>
                            <input type="number" name="upload_limit_mbps" value="2" class="w-full border p-2.5 rounded-lg">
                        </div>
                        <div>
                            <label class="block text-xs font-bold uppercase text-gray-500 mb-1">Download (Mbps):</label>
                            <input type="number" name="download_limit_mbps" value="5" class="w-full border p-2.5 rounded-lg">
                        </div>
                    </div>

                    <button type="submit" class="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow hover:bg-blue-700 transition">
                        Hifadhi Kifurushi
                    </button>
                </form>
            </div>

            <!-- Orodha ya Vifurushi -->
            <div class="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md">
                <h3 class="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Vifurushi Vilivyopo</h3>

                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-gray-50 border-b text-xs font-bold uppercase text-gray-500">
                                <th class="p-3">Jina</th>
                                <th class="p-3">Bei</th>
                                <th class="p-3">Muda</th>
                                <th class="p-3">Speed (Up/Down)</th>
                                <th class="p-3 text-center">Kitendo</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y text-sm">
                            <% if (packages && packages.length > 0) { %>
                                <% packages.forEach(pkg => { %>
                                    <tr class="hover:bg-gray-50">
                                        <td class="p-3 font-bold text-gray-800"><%= pkg.name %></td>
                                        <td class="p-3 text-blue-600 font-extrabold">TZS <%= pkg.price %></td>
                                        <td class="p-3"><%= pkg.duration_minutes >= 60 ? (pkg.duration_minutes/60) + ' Saa' : pkg.duration_minutes + ' Min' %></td>
                                        <td class="p-3"><%= pkg.upload_limit_mbps %>M / <%= pkg.download_limit_mbps %>M</td>
                                        <td class="p-3 text-center">
                                            <a href="/admin/packages/delete/<%= pkg.id %>" onclick="return confirm('Je, una uhakika unataka kufuta kifurushi hiki?');" class="bg-red-100 text-red-600 px-3 py-1 rounded-md text-xs font-bold hover:bg-red-200">Futa</a>
                                        </td>
                                    </tr>
                                <% }); %>
                            <% } else { %>
                                <tr>
                                    <td colspan="5" class="p-4 text-center text-gray-400">Hakuna vifurushi vilivyowekwa bado. Tumia fomu ya pembeni kuongeza.</td>
                                </tr>
                            <% } %>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </div>

</body>
</html>
'''
}

for path, content in files.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(content)

print('✅ Imekamilika! Ukurasa wa Admin Packages uko tayari.')
