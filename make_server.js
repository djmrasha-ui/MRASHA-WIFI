const fs = require('fs');

const serverCode = `const fs = require('fs');
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
    res.send(\`
        <!DOCTYPE html>
        <html lang="sw"><head><meta charset="UTF-8"><title>Admin Login</title><script src="https://cdn.tailwindcss.com"></script></head>
        <body class="bg-slate-900 min-h-screen flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                <h1 class="text-3xl font-extrabold text-slate-800 text-center mb-6">MRASHA WiFi</h1>
                <form action="/admin/login" method="POST" class="space-y-4">
                    <input type="text" name="username" value="admin" required class="w-full p-3 border rounded-lg">
                    <input type="password" name="password" value="admin123" required class="w-full p-3 border rounded-lg">
                    <button type="submit" class="w-full bg-blue-600 text-white font-bold py-3 rounded-lg">Ingia</button>
                </form>
            </div>
        </body></html>
    \`);
});

app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') res.redirect('/admin/dashboard');
    else res.send("<script>alert('Makosa ya taarifa!'); window.location.href='/admin/login';</script>");
});

const adminLayout = (title, activeMenu, content) => \`
<!DOCTYPE html>
<html lang="sw"><head><meta charset="UTF-8"><title>\${title}</title><script src="https://cdn.tailwindcss.com"></script></head>
<body class="bg-gray-100 flex min-h-screen">
    <div class="w-64 bg-slate-900 text-white p-4 flex flex-col justify-between">
        <div>
            <h1 class="text-xl font-black text-blue-400 mb-6">MRASHA WiFi</h1>
            <nav class="space-y-2">
                <a href="/admin/dashboard" class="block p-3 rounded-xl \${activeMenu === 'dashboard' ? 'bg-blue-600 font-bold' : 'hover:bg-slate-800'}">Dashboard</a>
                <a href="/admin/packages" class="block p-3 rounded-xl \${activeMenu === 'packages' ? 'bg-blue-600 font-bold' : 'hover:bg-slate-800'}">Vifurushi</a>
                <a href="/admin/vouchers" class="block p-3 rounded-xl \${activeMenu === 'vouchers' ? 'bg-blue-600 font-bold' : 'hover:bg-slate-800'}">Vocha</a>
                <a href="/admin/settings" class="block p-3 rounded-xl \${activeMenu === 'settings' ? 'bg-blue-600 font-bold' : 'hover:bg-slate-800'}">Page Builder</a>
            </nav>
        </div>
        <a href="/admin/login" class="text-red-400 p-3">Ondoka</a>
    </div>
    <div class="flex-1 p-8">\${content}</div>
</body></html>
\`;

app.get('/admin/dashboard', (req, res) => {
    res.send(adminLayout('Dashboard', 'dashboard', \`
        <h1 class="text-2xl font-bold mb-4">Dashboard</h1>
        <div class="grid grid-cols-3 gap-4">
            <div class="bg-white p-4 rounded-xl shadow">Vifurushi: <b>\${packagesList.length}</b></div>
            <div class="bg-white p-4 rounded-xl shadow">Vocha: <b>\${vouchersList.length}</b></div>
            <div class="bg-white p-4 rounded-xl shadow text-emerald-600">Hali: <b>Online</b></div>
        </div>
    \`));
});

app.get('/admin/packages', (req, res) => {
    let rows = packagesList.map(p => \`<tr class="border-b"><td class="p-3">\${p.name}</td><td class="p-3">\${p.price} TZS</td><td class="p-3">\${p.duration}</td></tr>\`).join('');
    res.send(adminLayout('Vifurushi', 'packages', \`
        <h1 class="text-2xl font-bold mb-4">Vifurushi</h1>
        <form action="/admin/packages" method="POST" class="bg-white p-4 rounded-xl shadow mb-4 flex gap-2">
            <input type="text" name="name" placeholder="Jina" required class="p-2 border rounded">
            <input type="number" name="price" placeholder="Bei" required class="p-2 border rounded">
            <input type="text" name="duration" placeholder="Muda" required class="p-2 border rounded">
            <button type="submit" class="bg-blue-600 text-white px-4 rounded">Ongeza</button>
        </form>
        <div class="bg-white rounded-xl shadow overflow-hidden"><table class="w-full">\${rows}</table></div>
    \`));
});

app.post('/admin/packages', (req, res) => {
    packagesList.push({ id: Date.now(), name: req.body.name, price: parseFloat(req.body.price), duration: req.body.duration });
    saveData();
    res.redirect('/admin/packages');
});

app.get('/admin/vouchers', (req, res) => {
    let rows = vouchersList.map(v => \`<tr class="border-b"><td class="p-3 font-mono">\${v.code}</td><td class="p-3">\${v.package}</td><td class="p-3">\${v.is_used ? 'Imetumika' : 'Mpya'}</td></tr>\`).join('');
    res.send(adminLayout('Vocha', 'vouchers', \`
        <h1 class="text-2xl font-bold mb-4">Vocha</h1>
        <div class="bg-white rounded-xl shadow overflow-hidden"><table class="w-full">\${rows}</table></div>
    \`));
});

app.get('/admin/settings', (req, res) => {
    res.send(adminLayout('Page Builder', 'settings', \`
        <div class="flex justify-between items-center mb-4">
            <h1 class="text-2xl font-bold">Page Builder</h1>
            <a href="/portal" target="_blank" class="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold">🌐 Fungua User Portal</a>
        </div>
        <form action="/admin/settings" method="POST" class="bg-white p-6 rounded-xl shadow space-y-4 max-w-xl">
            <input type="text" name="site_title" value="\${siteSettings.site_title}" class="w-full p-3 border rounded" required>
            <textarea name="welcome_text" class="w-full p-3 border rounded" required>\${siteSettings.welcome_text}</textarea>
            <input type="color" name="primary_color" value="\${siteSettings.primary_color}" class="w-full h-10 p-1 border rounded cursor-pointer">
            <input type="text" name="support_phone" value="\${siteSettings.support_phone}" class="w-full p-3 border rounded" required>
            <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded font-bold">Hifadhi</button>
        </form>
    \`));
});

app.post('/admin/settings', (req, res) => {
    siteSettings = req.body;
    saveData();
    res.redirect('/admin/settings');
});

// USER PORTAL NA TABS
app.get('/portal', (req, res) => {
    let packagesOptions = packagesList.map(p => \`
        <div class="p-3 border rounded-xl flex justify-between items-center bg-gray-50 cursor-pointer hover:border-blue-500 transition" onclick="document.getElementById('pkgInput').value='\${p.name}'; alert('Umechagua kifurushi cha: \${p.name} (\${p.price} TZS)');">
            <div><p class="font-bold text-gray-800 text-sm">\${p.name} - \${p.duration}</p><p class="text-xs text-blue-600 font-semibold">\${p.price} TZS</p></div>
            <span class="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-lg font-bold">Chagua</span>
        </div>
    \`).join('');

    res.send(\`
        <!DOCTYPE html>
        <html lang="sw"><head><meta charset="UTF-8"><title>\${siteSettings.site_title}</title><script src="https://cdn.tailwindcss.com"></script></head>
        <body class="bg-gray-50 min-h-screen flex items-center justify-center p-4">
            <div class="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border">
                <div class="text-center mb-6">
                    <div class="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-white text-xl font-black mb-3 shadow-md" style="background-color: \${siteSettings.primary_color};">Wi-Fi</div>
                    <h1 class="text-2xl font-black text-gray-800 mb-1">\${siteSettings.site_title}</h1>
                    <p class="text-gray-600 text-xs">\${siteSettings.welcome_text}</p>
                </div>

                <div class="flex rounded-xl bg-gray-100 p-1 mb-6 text-xs font-bold">
                    <button onclick="document.getElementById('tabV').classList.remove('hidden'); document.getElementById('tabB').classList.add('hidden');" class="flex-1 py-2 rounded-lg bg-white shadow-sm text-gray-800">Vocha</button>
                    <button onclick="document.getElementById('tabB').classList.remove('hidden'); document.getElementById('tabV').classList.add('hidden');" class="flex-1 py-2 rounded-lg text-gray-500">Nunua Kifurushi</button>
                </div>

                <div id="tabV">
                    <form action="/portal/login" method="POST" class="space-y-4">
                        <input type="text" name="code" placeholder="MRASHA-XXXX" required class="w-full p-3.5 border rounded-xl font-mono text-center uppercase font-bold text-lg">
                        <button type="submit" style="background-color: \${siteSettings.primary_color};" class="w-full py-3.5 text-white font-bold rounded-xl shadow">Unganisha Mtandao</button>
                    </form>
                </div>

                <div id="tabB" class="hidden">
                    <form action="/portal/buy" method="POST" class="space-y-3">
                        <input type="hidden" id="pkgInput" name="package_name" value="">
                        <div class="space-y-2 max-h-44 overflow-y-auto pr-1">\${packagesOptions}</div>
                        <input type="text" name="phone" placeholder="Namba ya Simu (07XXXXXXXX)" required class="w-full p-3 border rounded-xl text-sm font-semibold">
                        <button type="submit" style="background-color: \${siteSettings.primary_color};" class="w-full py-3.5 text-white font-bold rounded-xl shadow">Lipia na Unganisha</button>
                    </form>
                </div>

                <div class="mt-6 text-center text-xs text-gray-500 border-t pt-4">Msaada: <a href="tel:\${siteSettings.support_phone}" class="font-bold text-blue-600">\${siteSettings.support_phone}</a></div>
            </div>
        </body></html>
    \`);
});

app.post('/portal/buy', (req, res) => {
    const code = 'BUY-' + Math.floor(1000 + Math.random() * 9000);
    vouchersList.push({ id: Date.now(), code, package: req.body.package_name || 'Kifurushi', is_used: true });
    saveData();
    res.send(\`<script>alert('Malipo yamefanikiwa! Kodi yako ya mtandao ni: \${code}'); window.location.href='/portal';</script>\`);
});

app.get('/', (req, res) => res.redirect('/admin/login'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(\`Server ina-run kwenye port \${PORT}\`));`;

fs.writeFileSync('server.js', serverCode);
console.log('Faili la server.js limetengenezwa salama kabisa bila makosa!');
