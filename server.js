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
    { id: 2, name: 'Siku 1', price: 2000, duration: '1440 Dakika' },
    { id: 3, name: 'Siku 7', price: 10000, duration: '10080 Dakika' }
];

let vouchersList = [
    { id: 1, code: 'MRASHA-5001', package: 'Saa 1', price: 500, duration: '60 Dakika', is_used: false }
];

let siteSettings = {
    site_title: 'MRASHA WiFi Hotspot',
    welcome_text: 'Karibu! Ingiza kodi ya vocha yako au nunua kifurushi kuanza kutumia intaneti yenye kasi ya 4G/5G.',
    primary_color: '#2563EB',
    support_phone: '+255 700 000 000'
};

function loadData() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
            if (data.packages) packagesList = data.packages;
            if (data.vouchers) vouchersList = data.vouchers;
            if (data.settings) siteSettings = { ...siteSettings, ...data.settings };
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
        <html lang="sw"><head><meta charset="UTF-8"><title>Admin Login - MRASHA WiFi</title><script src="https://cdn.tailwindcss.com"></script></head>
        <body class="bg-slate-950 min-h-screen flex items-center justify-center p-4">
            <div class="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-8 max-w-md w-full text-white">
                <div class="text-center mb-8">
                    <div class="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center text-2xl font-black mb-3 shadow-lg shadow-blue-500/30">M</div>
                    <h1 class="text-2xl font-black">MRASHA WiFi</h1>
                    <p class="text-slate-400 text-xs mt-1">Ingia kusimamia mfumo</p>
                </div>
                <form action="/admin/login" method="POST" class="space-y-4">
                    <div>
                        <label class="block text-xs font-semibold text-slate-400 mb-1">Username</label>
                        <input type="text" name="username" value="admin" required class="w-full p-3.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-400 mb-1">Password</label>
                        <input type="password" name="password" value="admin123" required class="w-full p-3.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:outline-none">
                    </div>
                    <button type="submit" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-blue-600/30">Ingia Kwenye Mfumo</button>
                </form>
            </div>
        </body></html>
    `);
});

app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') res.redirect('/admin/dashboard');
    else res.send("<script>alert('Taarifa si sahihi!'); window.location.href='/admin/login';</script>");
});

const adminLayout = (title, activeMenu, content) => `
<!DOCTYPE html>
<html lang="sw"><head><meta charset="UTF-8"><title>${title} - MRASHA WiFi</title><script src="https://cdn.tailwindcss.com"></script></head>
<body class="bg-slate-50 flex min-h-screen font-sans">
    <div class="w-64 bg-slate-900 text-white p-6 flex flex-col justify-between shadow-xl">
        <div>
            <div class="flex items-center space-x-3 mb-8">
                <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-lg shadow-md shadow-blue-500/30">M</div>
                <h1 class="text-lg font-black tracking-wide">MRASHA WiFi</h1>
            </div>
            <nav class="space-y-1.5 text-sm font-medium">
                <a href="/admin/dashboard" class="flex items-center space-x-3 p-3 rounded-xl transition ${activeMenu === 'dashboard' ? 'bg-blue-600 font-bold text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}"><span>📊 Dashboard</span></a>
                <a href="/admin/packages" class="flex items-center space-x-3 p-3 rounded-xl transition ${activeMenu === 'packages' ? 'bg-blue-600 font-bold text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}"><span>📦 Vifurushi</span></a>
                <a href="/admin/vouchers" class="flex items-center space-x-3 p-3 rounded-xl transition ${activeMenu === 'vouchers' ? 'bg-blue-600 font-bold text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}"><span>ticket Vocha</span></a>
                <a href="/admin/settings" class="flex items-center space-x-3 p-3 rounded-xl transition ${activeMenu === 'settings' ? 'bg-blue-600 font-bold text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}"><span>⚙️ Page Builder</span></a>
            </nav>
        </div>
        <a href="/admin/login" class="flex items-center space-x-3 p-3 text-rose-400 hover:bg-slate-800 rounded-xl transition font-semibold text-sm"><span>🚪 Ondoka</span></a>
    </div>
    <div class="flex-1 p-10 overflow-y-auto">${content}</div>
</body></html>
`;

app.get('/admin/dashboard', (req, res) => {
    res.send(adminLayout('Dashboard', 'dashboard', `
        <h1 class="text-3xl font-black text-slate-800 mb-6">Dashboard Kuu</h1>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Jumla ya Vifurushi</p>
                <p class="text-4xl font-black text-blue-600 mt-2">${packagesList.length}</p>
            </div>
            <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Jumla ya Vocha</p>
                <p class="text-4xl font-black text-emerald-600 mt-2">${vouchersList.length}</p>
            </div>
            <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Hali ya Mfumo</p>
                <p class="text-xl font-bold text-emerald-600 mt-3 flex items-center space-x-2"><span class="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span><span>Online (Uko Hewani)</span></p>
            </div>
        </div>
    `));
});

app.get('/admin/packages', (req, res) => {
    let rows = packagesList.map(p => `
        <tr class="border-b border-slate-100 hover:bg-slate-50 transition">
            <td class="p-4 font-bold text-slate-800">${p.name}</td>
            <td class="p-4 font-semibold text-blue-600">${p.price} TZS</td>
            <td class="p-4 text-slate-500">${p.duration}</td>
        </tr>
    `).join('');

    res.send(adminLayout('Vifurushi', 'packages', `
        <h1 class="text-3xl font-black text-slate-800 mb-6">Usimamizi wa Vifurushi</h1>
        <form action="/admin/packages" method="POST" class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <input type="text" name="name" placeholder="Jina (Mf: Saa 2)" required class="p-3.5 border border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none">
            <input type="number" name="price" placeholder="Bei (TZS)" required class="p-3.5 border border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none">
            <input type="text" name="duration" placeholder="Muda (Mf: Dakika 120)" required class="p-3.5 border border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none">
            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl py-3.5 transition shadow-md shadow-blue-600/20 text-sm">Ongeza Kifurushi</button>
        </form>
        <div class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <table class="w-full text-left">
                <thead><tr class="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider"><th class="p-4">Jina</th><th class="p-4">Bei</th><th class="p-4">Muda</th></tr></thead>
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
        <tr class="border-b border-slate-100 hover:bg-slate-50 transition">
            <td class="p-4 font-mono font-bold text-slate-800">${v.code}</td>
            <td class="p-4 text-slate-600">${v.package}</td>
            <td class="p-4"><span class="px-3 py-1 rounded-full text-xs font-bold ${v.is_used ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}">${v.is_used ? 'Imetumika' : 'Mpya'}</span></td>
        </tr>
    `).join('');

    res.send(adminLayout('Vocha', 'vouchers', `
        <h1 class="text-3xl font-black text-slate-800 mb-6">Usimamizi wa Vocha</h1>
        <div class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <table class="w-full text-left">
                <thead><tr class="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider"><th class="p-4">Kodi ya Vocha</th><th class="p-4">Kifurushi</th><th class="p-4">Hali</th></tr></thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    `));
});

app.get('/admin/settings', (req, res) => {
    res.send(adminLayout('Page Builder', 'settings', `
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-black text-slate-800">Page Builder</h1>
            <a href="/portal" target="_blank" class="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-600/20 text-sm transition flex items-center space-x-2"><span>🌐 Fungua Live Portal</span></a>
        </div>
        <form action="/admin/settings" method="POST" class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-5 max-w-xl">
            <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Kichwa cha Ukurasa</label>
                <input type="text" name="site_title" value="${siteSettings.site_title}" class="w-full p-4 border border-slate-200 rounded-2xl text-sm font-semibold focus:border-blue-500 focus:outline-none" required>
            </div>
            <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Ujumbe wa Karibu</label>
                <textarea name="welcome_text" rows="3" class="w-full p-4 border border-slate-200 rounded-2xl text-sm focus:border-blue-500 focus:outline-none" required>${siteSettings.welcome_text}</textarea>
            </div>
            <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Rangi Kuu (Theme Color)</label>
                <div class="flex items-center space-x-3">
                    <input type="color" name="primary_color" value="${siteSettings.primary_color}" class="h-12 w-20 p-1 border border-slate-200 rounded-xl cursor-pointer">
                    <span class="text-sm font-mono text-slate-600 font-bold">${siteSettings.primary_color}</span>
                </div>
            </div>
            <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Namba ya Msaada</label>
                <input type="text" name="support_phone" value="${siteSettings.support_phone}" class="w-full p-4 border border-slate-200 rounded-2xl text-sm font-semibold focus:border-blue-500 focus:outline-none" required>
            </div>
            <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/20 transition">Hifadhi Mabadiliko</button>
        </form>
    `));
});

app.post('/admin/settings', (req, res) => {
    siteSettings = req.body;
    saveData();
    res.redirect('/admin/settings');
});

// USER PORTAL - UI MPYA YA KISASA KABISA NA YENYE MVUTO MKUBWA
app.get('/portal', (req, res) => {
    let packagesOptions = packagesList.map((p, index) => `
        <div onclick="selectPkg('${p.name}', this)" class="package-card p-4 border-2 border-slate-100 rounded-2xl flex justify-between items-center bg-white cursor-pointer hover:border-blue-500 transition shadow-sm mb-3">
            <div>
                <p class="font-black text-slate-800 text-sm">${p.name}</p>
                <p class="text-xs text-slate-400 font-medium">${p.duration}</p>
            </div>
            <div class="text-right">
                <span class="text-sm font-black text-blue-600">${p.price} TZS</span>
            </div>
        </div>
    `).join('');

    res.send(`
        <!DOCTYPE html>
        <html lang="sw"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${siteSettings.site_title}</title><script src="https://cdn.tailwindcss.com"></script></head>
        <body class="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 min-h-screen flex items-center justify-center p-4 font-sans">
            <div class="max-w-md w-full bg-white/95 backdrop-blur-xl rounded-[36px] shadow-2xl p-8 border border-white/20">
                
                <div class="text-center mb-6">
                    <div class="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center text-white text-2xl font-black mb-4 shadow-xl shadow-blue-600/30" style="background-color: ${siteSettings.primary_color};">
                        Wi
                    </div>
                    <h1 class="text-2xl font-black text-slate-900 tracking-tight">${siteSettings.site_title}</h1>
                    <p class="text-slate-500 text-xs mt-1.5 leading-relaxed px-2">${siteSettings.welcome_text}</p>
                </div>

                <div class="flex rounded-2xl bg-slate-100 p-1.5 mb-6">
                    <button id="btnV" onclick="switchTab('v')" class="flex-1 py-3 text-xs font-extrabold rounded-xl bg-white shadow-md text-slate-800 transition">Ingiza Vocha</button>
                    <button id="btnB" onclick="switchTab('b')" class="flex-1 py-3 text-xs font-extrabold rounded-xl text-slate-400 transition hover:text-slate-600">Nunua Kifurushi</button>
                </div>

                <div id="tabV">
                    <form action="/portal/login" method="POST" class="space-y-4">
                        <div>
                            <input type="text" name="code" placeholder="MRASHA-XXXX" required class="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl font-mono text-center uppercase font-bold text-lg text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none transition">
                        </div>
                        <button type="submit" style="background-color: ${siteSettings.primary_color};" class="w-full py-4 text-white font-black rounded-2xl shadow-xl shadow-blue-600/30 transition hover:opacity-95 text-sm tracking-wide">Unganisha Mtandao</button>
                    </form>
                </div>

                <div id="tabB" class="hidden">
                    <form action="/portal/buy" method="POST" class="space-y-4">
                        <input type="hidden" id="pkgInput" name="package_name" value="" required>
                        <div class="max-h-52 overflow-y-auto pr-1 space-y-1">${packagesOptions}</div>
                        <input type="text" name="phone" placeholder="Namba ya Simu (07XXXXXXXX)" required class="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none transition">
                        <button type="submit" style="background-color: ${siteSettings.primary_color};" class="w-full py-4 text-white font-black rounded-2xl shadow-xl shadow-blue-600/30 transition hover:opacity-95 text-sm tracking-wide">Lipia na Unganisha</button>
                    </form>
                </div>

                <div class="mt-8 text-center text-xs text-slate-400 border-t border-slate-100 pt-4">
                    Msaada / Huduma kwa Wateja: <a href="tel:${siteSettings.support_phone}" class="font-bold text-blue-600 hover:underline">${siteSettings.support_phone}</a>
                </div>
            </div>

            <script>
                function switchTab(t) {
                    if(t=='v') {
                        document.getElementById('tabV').classList.remove('hidden');
                        document.getElementById('tabB').classList.add('hidden');
                        document.getElementById('btnV').className = 'flex-1 py-3 text-xs font-extrabold rounded-xl bg-white shadow-md text-slate-800 transition';
                        document.getElementById('btnB').className = 'flex-1 py-3 text-xs font-extrabold rounded-xl text-slate-400 transition hover:text-slate-600';
                    } else {
                        document.getElementById('tabB').classList.remove('hidden');
                        document.getElementById('tabV').classList.add('hidden');
                        document.getElementById('btnB').className = 'flex-1 py-3 text-xs font-extrabold rounded-xl bg-white shadow-md text-slate-800 transition';
                        document.getElementById('btnV').className = 'flex-1 py-3 text-xs font-extrabold rounded-xl text-slate-400 transition hover:text-slate-600';
                    }
                }
                function selectPkg(name, el) {
                    document.getElementById('pkgInput').value = name;
                    let cards = document.querySelectorAll('.package-card');
                    cards.forEach(c => {
                        c.style.borderColor = '#f1f5f9';
                        c.style.backgroundColor = '#ffffff';
                    });
                    el.style.borderColor = '${siteSettings.primary_color}';
                    el.style.backgroundColor = '#eff6ff';
                }
            </script>
        </body></html>
    `);
});

app.post('/portal/buy', (req, res) => {
    const code = 'MRASHA-' + Math.floor(1000 + Math.random() * 9000);
    vouchersList.push({ id: Date.now(), code, package: req.body.package_name || 'Kifurushi', is_used: true });
    saveData();
    res.send(`<script>alert('Malipo yamepokelewa kikamilifu! Kodi yako ya kuingia mtandaoni ni: ${code}'); window.location.href='/portal';</script>`);
});

app.post('/portal/login', (req, res) => {
    const voucher = vouchersList.find(v => v.code.toUpperCase() === req.body.code.trim().toUpperCase());
    if (!voucher) return res.send("<script>alert('Samahani, kodi ya vocha si sahihi!'); window.location.href='/portal';</script>");
    if (voucher.is_used) return res.send("<script>alert('Samahani, vocha hii imeshatumika!'); window.location.href='/portal';</script>");

    voucher.is_used = true;
    saveData();
    res.send(`<script>alert('Hongera! Umeunganishwa kwenye intaneti kwa mafanikio.'); window.location.href='/portal';</script>`);
});

app.get('/', (req, res) => res.redirect('/admin/login'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server safi kabisa inafanya kazi kwenye port ${PORT}`));
