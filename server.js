const fs = require('fs');
const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Mfumo wa kuhifadhi data kudumu kwenye faili la data.json
const DATA_FILE = path.join(__dirname, 'data.json');

function loadData() {
    if (fs.existsSync(DATA_FILE)) {
        try {
            const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
            return {
                packages: data.packages || [],
                vouchers: data.vouchers || [],
                settings: data.settings || {}
            };
        } catch (e) {}
    }
    return {
        packages: [
            { id: 1, name: 'Saa 1', price: 500, duration: '60 Dakika' },
            { id: 2, name: 'Siku 1', price: 2000, duration: '1440 Dakika' }
        ],
        vouchers: [
            { id: 1, code: 'MRASHA-5001', package: 'Saa 1', price: 500, duration: '60 Dakika', is_used: false }
        ],
        settings: {
            site_title: 'MRASHA WiFi Hotspot',
            welcome_text: 'Karibu! Ingiza kodi ya vocha yako hapa chini kuanza kutumia internet yenye kasi kubwa.',
            primary_color: '#2563EB',
            support_phone: '+255 700 000 000'
        }
    };
}

function saveData() {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ packages: packagesList, vouchers: vouchersList, settings: siteSettings }, null, 2));
}

let initialData = loadData();
let packagesList = initialData.packages;
let vouchersList = initialData.vouchers;
let siteSettings = initialData.settings;

// 1. Admin Login Route
app.get('/admin/login', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="sw">
        <head>
            <meta charset="UTF-8">
            <title>Admin Login - MRASHA WiFi</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-slate-900 min-h-screen flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                <div class="text-center mb-8">
                    <h1 class="text-3xl font-extrabold text-slate-800">MRASHA WiFi</h1>
                    <p class="text-gray-500 text-sm mt-1">Ingia kwenye Mfumo wa Admin</p>
                </div>
                <form action="/admin/login" method="POST" class="space-y-5">
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                        <input type="text" name="username" value="admin" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                        <input type="password" name="password" value="admin123" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    </div>
                    <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-200 shadow-md">
                        Ingia (Login)
                    </button>
                </form>
            </div>
        </body>
        </html>
    `);
});

app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') {
        res.redirect('/admin/dashboard');
    } else {
        res.send("<script>alert('Taarifa si sahihi!'); window.location.href='/admin/login';</script>");
    }
});

// Layout ya Sidebar ya Pamoja kwa Admin Pages zote
const adminLayout = (title, activeMenu, content) => `
<!DOCTYPE html>
<html lang="sw">
<head>
    <meta charset="UTF-8">
    <title>${title} - MRASHA WiFi</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 flex min-h-screen">
    <!-- Sidebar -->
    <div class="w-64 bg-slate-900 text-white flex flex-col justify-between p-4 min-h-screen shadow-lg">
        <div>
            <h1 class="text-2xl font-black text-blue-400 mb-8 px-2 tracking-wider">MRASHA WiFi</h1>
            <nav class="space-y-2">
                <a href="/admin/dashboard" class="block p-3 rounded-xl transition ${activeMenu === 'dashboard' ? 'bg-blue-600 font-bold text-white' : 'hover:bg-slate-800 text-gray-300'}">Dashboard</a>
                <a href="/admin/packages" class="block p-3 rounded-xl transition ${activeMenu === 'packages' ? 'bg-blue-600 font-bold text-white' : 'hover:bg-slate-800 text-gray-300'}">Vifurushi (Packages)</a>
                <a href="/admin/vouchers" class="block p-3 rounded-xl transition ${activeMenu === 'vouchers' ? 'bg-blue-600 font-bold text-white' : 'hover:bg-slate-800 text-gray-300'}">Vocha (Vouchers)</a>
                <a href="/admin/settings" class="block p-3 rounded-xl transition ${activeMenu === 'settings' ? 'bg-blue-600 font-bold text-white' : 'hover:bg-slate-800 text-gray-300'}">Page Builder (Portal)</a>
            </nav>
        </div>
        <a href="/admin/login" class="block p-3 text-red-400 hover:bg-slate-800 rounded-xl transition font-semibold">Ondoka (Logout)</a>
    </div>

    <!-- Main Content -->
    <div class="flex-1 p-8 overflow-y-auto">
        ${content}
    </div>
</body>
</html>
`;

// 2. Admin Dashboard
app.get('/admin/dashboard', (req, res) => {
    const content = `
        <h1 class="text-3xl font-black text-gray-800 mb-6">Dashboard Kuu</h1>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p class="text-sm font-bold text-gray-400 uppercase">Jumla ya Vifurushi</p>
                <p class="text-3xl font-black text-blue-600 mt-2">${packagesList.length}</p>
            </div>
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p class="text-sm font-bold text-gray-400 uppercase">Jumla ya Vocha</p>
                <p class="text-3xl font-black text-emerald-600 mt-2">${vouchersList.length}</p>
            </div>
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p class="text-sm font-bold text-gray-400 uppercase">Hali ya Mfumo</p>
                <p class="text-xl font-bold text-emerald-600 mt-2">Uko Hewani (Online)</p>
            </div>
        </div>
    `;
    res.send(adminLayout('Dashboard', 'dashboard', content));
});

// 3. Vifurushi Management Page
app.get('/admin/packages', (req, res) => {
    let rows = packagesList.map(p => `
        <tr class="border-b hover:bg-gray-50">
            <td class="p-4 font-bold text-gray-800">${p.name}</td>
            <td class="p-4 font-semibold text-blue-600">${p.price} TZS</td>
            <td class="p-4 text-gray-600">${p.duration}</td>
            <td class="p-4 text-right">
                <form action="/admin/packages/delete/${p.id}" method="POST" style="display:inline;">
                    <button type="submit" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition">Futa</button>
                </form>
            </td>
        </tr>
    `).join('');

    const content = `
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-black text-gray-800">Usimamizi wa Vifurushi</h1>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <h2 class="text-lg font-bold text-gray-800 mb-4">Ongeza Kifurushi Kipya</h2>
            <form action="/admin/packages" method="POST" class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input type="text" name="name" placeholder="Jina (Mf: Saa 2)" required class="p-3 border rounded-xl focus:outline-none focus:border-blue-500">
                <input type="number" name="price" placeholder="Bei (TZS)" required class="p-3 border rounded-xl focus:outline-none focus:border-blue-500">
                <input type="text" name="duration" placeholder="Muda (Mf: Dakika 120)" required class="p-3 border rounded-xl focus:outline-none focus:border-blue-500">
                <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl py-3 transition shadow-md">Ongeza Kifurushi</button>
            </form>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-gray-50 text-gray-400 text-xs font-bold uppercase">
                        <th class="p-4">Jina la Kifurushi</th>
                        <th class="p-4">Bei</th>
                        <th class="p-4">Muda</th>
                        <th class="p-4 text-right">Vitendo</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows || '<tr><td colspan="4" class="p-4 text-center text-gray-500">Hakuna vifurushi vilivyowekwa bado.</td></tr>'}
                </tbody>
            </table>
        </div>
    `;
    res.send(adminLayout('Vifurushi', 'packages', content));
});

app.post('/admin/packages', (req, res) => {
    const { name, price, duration } = req.body;
    packagesList.push({ id: Date.now(), name, price: parseFloat(price), duration });
    saveData();
    res.redirect('/admin/packages');
});

app.post('/admin/packages/delete/:id', (req, res) => {
    const { id } = req.params;
    packagesList = packagesList.filter(p => p.id != id);
    saveData();
    res.redirect('/admin/packages');
});

// 4. Vouchers Management Page
app.get('/admin/vouchers', (req, res) => {
    let rows = vouchersList.map(v => `
        <tr class="border-b hover:bg-gray-50">
            <td class="p-4 font-mono font-bold text-gray-800">${v.code}</td>
            <td class="p-4 text-gray-600">${v.package}</td>
            <td class="p-4 font-semibold text-blue-600">${v.price} TZS</td>
            <td class="p-4 text-gray-600">${v.duration}</td>
            <td class="p-4">
                ${v.is_used ? '<span class="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">Imetumika</span>' : '<span class="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">Mpya (Haitumika)</span>'}
            </td>
            <td class="p-4 text-right">
                <form action="/admin/vouchers/delete/${v.id}" method="POST" style="display:inline;">
                    <button type="submit" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition">Futa</button>
                </form>
            </td>
        </tr>
    `).join('');

    const content = `
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-black text-gray-800">Usimamizi wa Vocha</h1>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <h2 class="text-lg font-bold text-gray-800 mb-4">Zalisha Vocha Mpya (Generate Vouchers)</h2>
            <form action="/admin/vouchers/generate" method="POST" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select name="package_id" required class="p-3 border rounded-xl focus:outline-none focus:border-blue-500 bg-white">
                    <option value="">Chagua Kifurushi</option>
                    ${packagesList.map(p => `<option value="${p.id}">${p.name} - ${p.price} TZS (${p.duration})</option>`).join('')}
                </select>
                <input type="number" name="qty" placeholder="Idadi ya Vocha (Mf: 10)" min="1" max="100" required class="p-3 border rounded-xl focus:outline-none focus:border-blue-500">
                <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl py-3 transition shadow-md">Zalisha Vocha</button>
            </form>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-gray-50 text-gray-400 text-xs font-bold uppercase">
                        <th class="p-4">Kodi ya Vocha</th>
                        <th class="p-4">Kifurushi</th>
                        <th class="p-4">Bei</th>
                        <th class="p-4">Muda</th>
                        <th class="p-4">Hali</th>
                        <th class="p-4 text-right">Vitendo</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows || '<tr><td colspan="6" class="p-4 text-center text-gray-500">Hakuna vocha zilizozalishwa bado.</td></tr>'}
                </tbody>
            </table>
        </div>
    `;
    res.send(adminLayout('Vocha', 'vouchers', content));
});

app.post('/admin/vouchers/generate', (req, res) => {
    const { package_id, qty } = req.body;
    const pkg = packagesList.find(p => p.id == package_id);
    if (pkg) {
        const count = parseInt(qty) || 1;
        for (let i = 0; i < count; i++) {
            const randomCode = 'MRASHA-' + Math.floor(1000 + Math.random() * 9000);
            vouchersList.push({
                id: Date.now() + i,
                code: randomCode,
                package: pkg.name,
                price: pkg.price,
                duration: pkg.duration,
                is_used: false
            });
        }
        saveData();
    }
    res.redirect('/admin/vouchers');
});

app.post('/admin/vouchers/delete/:id', (req, res) => {
    const { id } = req.params;
    vouchersList = vouchersList.filter(v => v.id != id);
    saveData();
    res.redirect('/admin/vouchers');
});

// 5. Page Builder / Settings Page
app.get('/admin/settings', (req, res) => {
    const content = `
        <h1 class="text-3xl font-black text-gray-800 mb-6">Page Builder (Portal UI)</h1>
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-2xl">
            <form action="/admin/settings" method="POST" class="space-y-4">
                <div>
                    <label class="block text-xs font-bold text-gray-600 mb-1 uppercase">Kichwa cha Ukurasa</label>
                    <input type="text" name="site_title" value="${siteSettings.site_title}" class="w-full p-3 border rounded-xl focus:outline-none focus:border-blue-500 font-semibold" required>
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-600 mb-1 uppercase">Ujumbe wa Karibu</label>
                    <textarea name="welcome_text" rows="3" class="w-full p-3 border rounded-xl focus:outline-none focus:border-blue-500 text-sm" required>${siteSettings.welcome_text}</textarea>
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-600 mb-1 uppercase">Rangi Kuu (Theme Color)</label>
                    <div class="flex items-center space-x-3">
                        <input type="color" name="primary_color" value="${siteSettings.primary_color}" class="h-10 w-16 p-1 border rounded-lg cursor-pointer">
                        <span class="text-sm font-mono text-gray-600">${siteSettings.primary_color}</span>
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-600 mb-1 uppercase">Namba ya Msaada / Huduma kwa Wateja</label>
                    <input type="text" name="support_phone" value="${siteSettings.support_phone}" class="w-full p-3 border rounded-xl focus:outline-none focus:border-blue-500 font-semibold" required>
                </div>
                <button type="submit" class="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 transition">
                    Hifadhi Mabadiliko
                </button>
            </form>
        </div>
    `;
    res.send(adminLayout('Page Builder', 'settings', content));
});

app.post('/admin/settings', (req, res) => {
    siteSettings = req.body;
    saveData();
    res.redirect('/admin/settings');
});

app.get('/', (req, res) => {
    res.redirect('/admin/login');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server ina-run kwenye port ${PORT}`);
});

// 6. User Portal & Hotspot Captive Portal Routes
app.get('/portal', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="sw">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>\${siteSettings.site_title}</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-slate-900 min-h-screen flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border-t-8" style="border-color: \${siteSettings.primary_color};">
                <div class="text-center mb-6">
                    <h1 class="text-2xl font-black text-slate-800">\${siteSettings.site_title}</h1>
                    <p class="text-gray-500 text-sm mt-2">\${siteSettings.welcome_text}</p>
                </div>

                <!-- Orodha ya Vifurushi -->
                <div class="mb-6 space-y-3">
                    <h2 class="text-xs font-bold uppercase text-gray-400 tracking-wider">Vifurushi Vinavyopatikana</h2>
                    <div class="grid grid-cols-2 gap-3">
                        \${packagesList.map(p => \`
                            <div class="border rounded-2xl p-3 text-center bg-gray-50">
                                <p class="font-bold text-slate-800 text-sm">\${p.name}</p>
                                <p class="text-blue-600 font-extrabold text-sm">\${p.price} TZS</p>
                                <p class="text-xs text-gray-400 mt-1">\${p.duration}</p>
                            </div>
                        \`).join('')}
                    </div>
                </div>

                <!-- Form ya Kuingiza Vocha -->
                <form action="/portal/login" method="POST" class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-gray-600 uppercase mb-1">Ingiza Kodi ya Vocha</label>
                        <input type="text" name="code" placeholder="Mf: MRASHA-XXXX" required class="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono uppercase text-center font-bold text-lg tracking-widest">
                    </div>
                    <button type="submit" class="w-full py-4 text-white font-bold rounded-xl shadow-lg transition duration-200" style="background-color: \${siteSettings.primary_color};">
                        Unganisha na Internet
                    </button>
                </form>

                <div class="text-center mt-6 text-xs text-gray-400">
                    <p>Msaada / Huduma kwa Wateja: <span class="font-bold text-gray-600">\${siteSettings.support_phone}</span></p>
                </div>
            </div>
        </body>
        </html>
    `);
});

app.post('/portal/login', (req, res) => {
    const { code } = req.body;
    const cleanCode = code.trim().toUpperCase();
    const voucher = vouchersList.find(v => v.code === cleanCode);

    if (!voucher) {
        return res.send("<script>alert('Kodi ya vocha siyo sahihi!'); window.location.href='/portal';</script>");
    }

    if (voucher.is_used) {
        return res.send("<script>alert('Vocha hii imeshatumika tayari!'); window.location.href='/portal';</script>");
    }

    // Weka alama kuwa imetumika
    voucher.is_used = true;
    saveData();

    res.send(`
        <!DOCTYPE html>
        <html lang="sw">
        <head>
            <meta charset="UTF-8">
            <title>Umeunganishwa - MRASHA WiFi</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-emerald-900 min-h-screen flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
                <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">✓</div>
                <h1 class="text-2xl font-black text-slate-800 mb-2">Umeunganishwa Kikamilifu!</h1>
                <p class="text-gray-600 text-sm mb-6">Vocha yako (\${cleanCode}) imekubaliwa. Sasa unaweza kutumia intaneti.</p>
                <a href="https://google.com" class="block w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition">
                    Anza Kutumia Intaneti
                </a>
            </div>
        </body>
        </html>
    `);
});
