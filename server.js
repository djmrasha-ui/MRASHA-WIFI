const fs = require('fs');
const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const DATA_FILE = path.join(__dirname, 'data.json');

let packagesList = [
    { id: 1, name: 'Saa 1', price: 500, duration: '60 Dakika' },
    { id: 2, name: 'Siku 1', price: 2000, duration: '1440 Dakika' }
];

let vouchersList = [
    { id: 1, code: 'MRASHA-5001', package: 'Saa 1', price: 500, duration: '60 Dakika', is_used: false }
];

let siteSettings = {
    site_title: 'MRASHA WiFi Hotspot',
    welcome_text: 'Karibu! Ingiza kodi ya vocha yako au chagua kifurushi hapa chini.',
    primary_color: '#2563EB',
    support_phone: '+255 700 000 000'
};

function loadData() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
            if (data.packages) packagesList = data.packages;
            if (data.vouchers) vouchersList = data.vouchers;
            if (data.settings) siteSettings = data.settings;
        }
    } catch (e) { console.error(e); }
}

function saveData() {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify({ packages: packagesList, vouchers: vouchersList, settings: siteSettings }, null, 2));
    } catch (e) { console.error(e); }
}

loadData();

// Admin Login
app.get('/admin/login', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="sw">
        <head><meta charset="UTF-8"><title>Admin Login - MRASHA WiFi</title><script src="https://cdn.tailwindcss.com"></script></head>
        <body class="bg-slate-900 min-h-screen flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
                <div class="text-center mb-8">
                    <h1 class="text-3xl font-black text-slate-800">MRASHA WiFi</h1>
                    <p class="text-gray-400 text-sm mt-1">Ingia kwenye Mfumo wa Admin</p>
                </div>
                <form action="/admin/login" method="POST" class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-gray-600 mb-1 uppercase">Username</label>
                        <input type="text" name="username" value="admin" required class="w-full p-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-600 mb-1 uppercase">Password</label>
                        <input type="password" name="password" value="admin123" required class="w-full p-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold">
                    </div>
                    <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg">Ingia kwenye Mfumo</button>
                </form>
            </div>
        </body>
        </html>
    `);
});

app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') res.redirect('/admin/dashboard');
    else res.send("<script>alert('Taarifa si sahihi!'); window.location.href='/admin/login';</script>");
});

// Admin Layout with Sidebar
const adminLayout = (title, activeMenu, content) => `
<!DOCTYPE html>
<html lang="sw">
<head><meta charset="UTF-8"><title>${title} - MRASHA WiFi Admin</title><script src="https://cdn.tailwindcss.com"></script></head>
<body class="bg-gray-100 flex min-h-screen font-sans">
    <div class="w-64 bg-slate-900 text-white flex flex-col justify-between p-6 shadow-xl">
        <div>
            <h1 class="text-2xl font-black text-blue-400 mb-8 tracking-wider">MRASHA WiFi</h1>
            <nav class="space-y-2 text-sm font-semibold">
                <a href="/admin/dashboard" class="block p-3.5 rounded-xl transition ${activeMenu === 'dashboard' ? 'bg-blue-600 font-bold text-white shadow-md' : 'hover:bg-slate-800 text-gray-300'}">Dashboard</a>
                <a href="/admin/packages" class="block p-3.5 rounded-xl transition ${activeMenu === 'packages' ? 'bg-blue-600 font-bold text-white shadow-md' : 'hover:bg-slate-800 text-gray-300'}">Vifurushi</a>
                <a href="/admin/vouchers" class="block p-3.5 rounded-xl transition ${activeMenu === 'vouchers' ? 'bg-blue-600 font-bold text-white shadow-md' : 'hover:bg-slate-800 text-gray-300'}">Vocha</a>
                <a href="/admin/settings" class="block p-3.5 rounded-xl transition ${activeMenu === 'settings' ? 'bg-blue-600 font-bold text-white shadow-md' : 'hover:bg-slate-800 text-gray-300'}">Page Builder</a>
            </nav>
        </div>
        <a href="/admin/login" class="block p-3.5 text-red-400 hover:bg-slate-800 rounded-xl transition font-bold text-sm">Ondoka (Logout)</a>
    </div>
    <div class="flex-1 p-10 overflow-y-auto">${content}</div>
</body>
</html>
`;

app.get('/admin/dashboard', (req, res) => {
    res.send(adminLayout('Dashboard', 'dashboard', `
        <h1 class="text-3xl font-black text-gray-800 mb-6">Dashboard Kuu</h1>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p class="text-xs font-bold text-gray-400 uppercase">Jumla ya Vifurushi</p>
                <p class="text-3xl font-black text-blue-600 mt-2">${packagesList.length}</p>
            </div>
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p class="text-xs font-bold text-gray-400 uppercase">Jumla ya Vocha</p>
                <p class="text-3xl font-black text-emerald-600 mt-2">${vouchersList.length}</p>
            </div>
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p class="text-xs font-bold text-gray-400 uppercase">Hali ya Mfumo</p>
                <p class="text-xl font-bold text-emerald-600 mt-2">Uko Hewani (Online)</p>
            </div>
        </div>
    `));
});

app.get('/admin/packages', (req, res) => {
    let rows = packagesList.map(p => `
        <tr class="border-b hover:bg-gray-50 transition">
            <td class="p-4 font-bold text-gray-800">${p.name}</td>
            <td class="p-4 font-semibold text-blue-600">${p.price} TZS</td>
            <td class="p-4 text-gray-600">${p.duration}</td>
        </tr>
    `).join('');

    res.send(adminLayout('Vifurushi', 'packages', `
        <h1 class="text-3xl font-black text-gray-800 mb-6">Usimamizi wa Vifurushi</h1>
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 max-w-2xl">
            <h2 class="text-lg font-bold text-gray-800 mb-4">Ongeza Kifurushi Kipya</h2>
            <form action="/admin/packages" method="POST" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" name="name" placeholder="Jina (Mf: Saa 2)" required class="p-3 border rounded-xl focus:outline-none focus:border-blue-500 font-semibold text-sm">
                <input type="number" name="price" placeholder="Bei (TZS)" required class="p-3 border rounded-xl focus:outline-none focus:border-blue-500 font-semibold text-sm">
                <input type="text" name="duration" placeholder="Muda (Mf: Dakika 120)" required class="p-3 border rounded-xl focus:outline-none focus:border-blue-500 font-semibold text-sm">
                <button type="submit" class="md:col-span-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl py-3 transition shadow-md">Weka Kifurushi</button>
            </form>
        </div>
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-4xl">
            <table class="w-full text-left border-collapse">
                <thead><tr class="bg-gray-50 text-gray-400 text-xs font-bold uppercase"><th class="p-4">Jina</th><th class="p-4">Bei</th><th class="p-4">Muda</th></tr></thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    `));
});

app.post('/admin/packages', (req, res) => {
    packagesList.push({ id: Date.now(), name: req.body.name, price: parseFloat(req.body.price), duration: req.body.duration });
    saveData();
    res.redirect('/admin/packages');
});

app.get('/admin/vouchers', (req, res) => {
    let rows = vouchersList.map(v => `
        <tr class="border-b hover:bg-gray-50 transition">
            <td class="p-4 font-mono font-bold text-gray-800">${v.code}</td>
            <td class="p-4 text-gray-600">${v.package}</td>
            <td class="p-4"><span class="px-3 py-1 rounded-full text-xs font-bold ${v.is_used ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}">${v.is_used ? 'Imetumika' : 'Mpya'}</span></td>
        </tr>
    `).join('');

    res.send(adminLayout('Vocha', 'vouchers', `
        <h1 class="text-3xl font-black text-gray-800 mb-6">Usimamizi wa Vocha</h1>
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-4xl">
            <table class="w-full text-left border-collapse">
                <thead><tr class="bg-gray-50 text-gray-400 text-xs font-bold uppercase"><th class="p-4">Kodi ya Vocha</th><th class="p-4">Kifurushi</th><th class="p-4">Hali</th></tr></thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    `));
});

app.get('/admin/settings', (req, res) => {
    res.send(adminLayout('Page Builder', 'settings', `
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-black text-gray-800">Page Builder (Portal UI)</h1>
            <a href="/portal" target="_blank" class="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition flex items-center gap-2">🌐 Angalia Live Preview</a>
        </div>
        <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-xl">
            <form action="/admin/settings" method="POST" class="space-y-4">
                <div>
                    <label class="block text-xs font-bold text-gray-600 mb-1 uppercase">Kichwa cha Ukurasa (Site Title)</label>
                    <input type="text" name="site_title" value="${siteSettings.site_title}" class="w-full p-3.5 border rounded-xl focus:outline-none focus:border-blue-500 font-semibold" required>
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-600 mb-1 uppercase">Ujumbe wa Karibu (Welcome Text)</label>
                    <textarea name="welcome_text" rows="3" class="w-full p-3.5 border rounded-xl focus:outline-none focus:border-blue-500 text-sm font-medium" required>${siteSettings.welcome_text}</textarea>
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-600 mb-1 uppercase">Rangi Kuu (Theme Color)</label>
                    <input type="color" name="primary_color" value="${siteSettings.primary_color}" class="w-full h-12 p-1 border rounded-xl cursor-pointer">
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-600 mb-1 uppercase">Namba ya Msaada (Support Phone)</label>
                    <input type="text" name="support_phone" value="${siteSettings.support_phone}" class="w-full p-3.5 border rounded-xl focus:outline-none focus:border-blue-500 font-semibold" required>
                </div>
                <button type="submit" class="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition">Hifadhi Mabadiliko</button>
            </form>
        </div>
    `));
});

app.post('/admin/settings', (req, res) => {
    siteSettings = req.body;
    saveData();
    res.redirect('/admin/settings');
});

// User Portal with Tabs
app.get('/portal', (req, res) => {
    let packagesOptions = packagesList.map(p => `
        <div class="p-3.5 border rounded-2xl flex justify-between items-center bg-gray-50 cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 transition" onclick="document.getElementById('pkgInput').value='${p.name}'; document.querySelectorAll('.pkg-card').forEach(c=>c.classList.remove('border-blue-600','bg-blue-50')); this.classList.add('border-blue-600','bg-blue-50');">
            <div><p class="font-bold text-gray-800 text-sm">${p.name} - ${p.duration}</p><p class="text-xs text-blue-600 font-bold mt-0.5">${p.price} TZS</p></div>
            <span class="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-xl font-extrabold">Chagua</span>
        </div>
    `).join('');

    res.send(`
        <!DOCTYPE html>
        <html lang="sw">
        <head><meta charset="UTF-8"><title>${siteSettings.site_title}</title><script src="https://cdn.tailwindcss.com"></script></head>
        <body class="bg-slate-100 min-h-screen flex items-center justify-center p-4 font-sans">
            <div class="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div class="text-center mb-6">
                    <div class="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-white text-xl font-black mb-3 shadow-lg" style="background-color: ${siteSettings.primary_color};">Wi-Fi</div>
                    <h1 class="text-2xl font-black text-gray-800 mb-1">${siteSettings.site_title}</h1>
                    <p class="text-gray-500 text-xs px-4">${siteSettings.welcome_text}</p>
                </div>

                <div class="flex rounded-2xl bg-gray-100 p-1.5 mb-6 text-xs font-bold">
                    <button onclick="document.getElementById('tabV').classList.remove('hidden'); document.getElementById('tabB').classList.add('hidden'); this.className='flex-1 py-2.5 rounded-xl bg-white shadow-sm text-gray-800 font-extrabold transition'; document.getElementById('btnB').className='flex-1 py-2.5 rounded-xl text-gray-500 transition';" id="btnV" class="flex-1 py-2.5 rounded-xl bg-white shadow-sm text-gray-800 font-extrabold transition">Vocha</button>
                    <button onclick="document.getElementById('tabB').classList.remove('hidden'); document.getElementById('tabV').classList.add('hidden'); this.className='flex-1 py-2.5 rounded-xl bg-white shadow-sm text-gray-800 font-extrabold transition'; document.getElementById('btnV').className='flex-1 py-2.5 rounded-xl text-gray-500 transition';" id="btnB" class="flex-1 py-2.5 rounded-xl text-gray-500 transition">Nunua Kifurushi</button>
                </div>

                <div id="tabV">
                    <form action="/portal/login" method="POST" class="space-y-4">
                        <input type="text" name="code" placeholder="MRASHA-XXXX" required class="w-full p-4 border rounded-2xl font-mono text-center uppercase font-black text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <button type="submit" style="background-color: ${siteSettings.primary_color};" class="w-full py-4 text-white font-extrabold rounded-2xl shadow-lg transition hover:opacity-90">Unganisha Mtandao</button>
                    </form>
                </div>

                <div id="tabB" class="hidden">
                    <form action="/portal/buy" method="POST" class="space-y-4">
                        <input type="hidden" id="pkgInput" name="package_name" value="">
                        <div class="space-y-2.5 max-h-48 overflow-y-auto pr-1">${packagesOptions}</div>
                        <input type="text" name="phone" placeholder="Namba ya Simu (07XXXXXXXX)" required class="w-full p-3.5 border rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <button type="submit" style="background-color: ${siteSettings.primary_color};" class="w-full py-4 text-white font-extrabold rounded-2xl shadow-lg transition hover:opacity-90">Lipia na Unganisha</button>
                    </form>
                </div>

                <div class="mt-8 text-center text-xs text-gray-400 border-t pt-4">Msaada / Huduma kwa Wateja: <a href="tel:${siteSettings.support_phone}" class="font-bold text-blue-600 hover:underline">${siteSettings.support_phone}</a></div>
            </div>
        </body>
        </html>
    `);
});

app.post('/portal/buy', (req, res) => {
    const code = 'BUY-' + Math.floor(1000 + Math.random() * 9000);
    vouchersList.push({ id: Date.now(), code, package: req.body.package_name || 'Kifurushi', is_used: true });
    saveData();
    res.send(`<script>alert('Malipo yamefanikiwa! Kodi yako ya mtandao ni: ${code}'); window.location.href='/portal';</script>`);
});

app.get('/', (req, res) => res.redirect('/admin/login'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server safi kabisa ina-run kwenye port ${PORT}`));
