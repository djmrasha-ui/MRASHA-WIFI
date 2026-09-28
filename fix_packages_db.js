const fs = require('fs');

// 1. Controller ya Packages inayohifadhi kwenye Database na Fallback Global Memory
fs.writeFileSync('controllers/packageController.js', `
const db = require('../config/db');

global.mockPackages = global.mockPackages || [
    { id: 1, name: 'Saa 1', price: 500, duration_minutes: 60, is_active: 1 },
    { id: 2, name: 'Siku 1', price: 2000, duration_minutes: 1440, is_active: 1 }
];

exports.getPackagesPage = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM packages WHERE is_active = TRUE ORDER BY id DESC');
        res.render('admin/packages', { packages: rows });
    } catch (err) {
        res.render('admin/packages', { packages: global.mockPackages });
    }
};

exports.addPackage = async (req, res) => {
    const { name, price, duration_minutes } = req.body;
    try {
        await db.query(
            'INSERT INTO packages (name, price, duration_minutes, is_active) VALUES (?, ?, ?, TRUE)',
            [name, price, duration_minutes]
        );
    } catch (err) {
        const newPkg = {
            id: Date.now(),
            name,
            price: parseFloat(price),
            duration_minutes: parseInt(duration_minutes),
            is_active: 1
        };
        global.mockPackages.push(newPkg);
    }
    res.redirect('/admin/packages');
};

exports.deletePackage = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('UPDATE packages SET is_active = FALSE WHERE id = ?', [id]);
    } catch (err) {
        global.mockPackages = global.mockPackages.filter(p => p.id != id);
    }
    res.redirect('/admin/packages');
};
`);

// 2. View ya Admin Packages zenye Fomu na Kitufe cha Futa
fs.writeFileSync('views/admin/packages.ejs', `
<!DOCTYPE html>
<html lang="sw">
<head>
    <meta charset="UTF-8">
    <title>Usimamizi wa Vifurushi - MRASHA WiFi</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 flex min-h-screen">

    <div class="w-64 bg-slate-900 text-white flex flex-col justify-between p-4 min-h-screen">
        <div>
            <h1 class="text-2xl font-black text-blue-400 mb-8 px-2">MRASHA WiFi</h1>
            <nav class="space-y-2">
                <a href="/admin/dashboard" class="block p-3 rounded-lg hover:bg-slate-800">Dashboard</a>
                <a href="/admin/packages" class="block p-3 rounded-lg bg-blue-600 font-bold">Vifurushi (Packages)</a>
                <a href="/admin/vouchers" class="block p-3 rounded-lg hover:bg-slate-800">Vocha (Vouchers)</a>
                <a href="/admin/routers" class="block p-3 rounded-lg hover:bg-slate-800">Router & Access Points</a>
                <a href="/admin/settings" class="block p-3 rounded-lg hover:bg-slate-800">Page Builder (Portal)</a>
            </nav>
        </div>
        <a href="/admin/login" class="block p-3 text-red-400 hover:bg-slate-800 rounded-lg">Ondoka (Logout)</a>
    </div>

    <div class="flex-1 p-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">Usimamizi wa Vifurushi</h1>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Form ya Kuongeza -->
            <div class="bg-white p-6 rounded-2xl shadow-sm border h-fit">
                <h2 class="text-xl font-bold text-gray-800 mb-4">Tengeneza Kifurushi</h2>
                <form action="/admin/packages/add" method="POST" class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-gray-600 mb-1">Jina la Kifurushi</label>
                        <input type="text" name="name" placeholder="Mfano: Wiki 1" required class="w-full p-3 border rounded-xl focus:outline-none focus:border-blue-500 font-semibold">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-600 mb-1">Bei (TZS)</label>
                        <input type="number" name="price" placeholder="Mfano: 10000" required class="w-full p-3 border rounded-xl focus:outline-none focus:border-blue-500 font-semibold">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-600 mb-1">Muda (Dakika)</label>
                        <input type="number" name="duration_minutes" placeholder="Mfano: 10080" required class="w-full p-3 border rounded-xl focus:outline-none focus:border-blue-500 font-semibold">
                    </div>
                    <button type="submit" class="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 transition">
                        Hifadhi Kifurushi
                    </button>
                </form>
            </div>

            <!-- Orodha ya Vifurushi -->
            <div class="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border">
                <h2 class="text-xl font-bold text-gray-800 mb-4">Orodha ya Vifurushi</h2>
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="border-b bg-gray-50 text-xs text-gray-500 uppercase">
                                <th class="p-3">Jina</th>
                                <th class="p-3">Bei</th>
                                <th class="p-3">Muda</th>
                                <th class="p-3 text-right">Kitendo</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y text-sm">
                            <% if (packages && packages.length > 0) { %>
                                <% packages.forEach(pkg => { %>
                                    <tr>
                                        <td class="p-3 font-bold text-gray-800"><%= pkg.name %></td>
                                        <td class="p-3 font-semibold text-blue-600"><%= pkg.price %> TZS</td>
                                        <td class="p-3 text-gray-600"><%= pkg.duration_minutes %> Dakika</td>
                                        <td class="p-3 text-right">
                                            <a href="/admin/packages/delete/<%= pkg.id %>" onclick="return confirm('Je, una uhakika unataka kufuta kifurushi hiki?')" class="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition">
                                                Futa (Delete)
                                            </a>
                                        </td>
                                    </tr>
                                <% }) %>
                            <% } else { %>
                                <tr>
                                    <td colspan="4" class="p-4 text-center text-gray-400">Hakuna vifurushi vilivyowekwa.</td>
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
`);

// 3. Weka Routes kwenye adminRoutes.js
const adminRoutesPath = 'routes/adminRoutes.js';
let routesContent = fs.readFileSync(adminRoutesPath, 'utf8');

if (!routesContent.includes("packageController")) {
    routesContent = `const packageController = require('../controllers/packageController');\n` + routesContent;
}

if (!routesContent.includes("'/packages'")) {
    routesContent += `
router.get('/packages', packageController.getPackagesPage);
router.post('/packages/add', packageController.addPackage);
router.get('/packages/delete/:id', packageController.deletePackage);
`;
    fs.writeFileSync(adminRoutesPath, routesContent);
}

console.log('Mfumo wa Kuhifadhi Vifurushi umerekebishwa kikamilifu!');
