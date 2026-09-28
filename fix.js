const fs = require('fs');

const portalControllerContent = `const db = require('../config/db');

exports.getPortalSettings = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM portal_settings LIMIT 1');
        const settings = rows[0] || {};
        res.render('admin/page_builder', { settings });
    } catch (err) {
        console.error(err);
        res.status(500).send('Kuna tatizo kwenye kupakia mipangilio.');
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
        res.status(500).send('Kuna tatizo kwenye kuhifadhi mipangilio.');
    }
};
`;

const packagesContent = `<!DOCTYPE html>
<html lang="sw">
<head>
    <meta charset="UTF-8">
    <title>Vifurushi - MRASHA WiFi</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen flex">

    <!-- Sidebar Menu -->
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

    <!-- Main Content -->
    <div class="flex-1 p-10">
        <h2 class="text-3xl font-bold text-gray-800 mb-6">Usimamizi wa Vifurushi</h2>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="bg-white p-6 rounded-xl shadow-md lg:col-span-1">
                <h3 class="text-xl font-bold text-gray-800 mb-4">Tengeneza Kifurushi Kipya</h3>
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
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="p-3 text-sm font-semibold text-gray-600">Jina</th>
                                <th class="p-3 text-sm font-semibold text-gray-600">Bei</th>
                                <th class="p-3 text-sm font-semibold text-gray-600">Muda</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            <% packages.forEach(pkg => { %>
                                <tr>
                                    <td class="p-3 text-sm font-medium text-gray-800"><%= pkg.name %></td>
                                    <td class="p-3 text-sm text-gray-600"><%= pkg.price %> TZS</td>
                                    <td class="p-3 text-sm text-gray-600"><%= pkg.duration_minutes %> Dakika</td>
                                </tr>
                            <% }) %>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

</body>
</html>
`;

fs.writeFileSync('controllers/portalController.js', portalControllerContent);
fs.writeFileSync('views/admin/packages.ejs', packagesContent);
console.log('Mafaili yote yamerekebishwa kikamilifu!');
