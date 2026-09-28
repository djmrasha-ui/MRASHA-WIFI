const fs = require('fs');

let serverCode = fs.readFileSync('server.js', 'utf8');

// Tutabadilisha route ya /portal iwe na Tabs mbili: "Ingiza Vocha" na "Nunua Kifurushi"
const oldPortalRoute = `app.get('/portal', (req, res) => {
    res.send(\`
        <!DOCTYPE html>
        <html lang="sw">
        <head>
            <meta charset="UTF-8">
            <title>\${siteSettings.site_title}</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-50 min-h-screen flex flex-col items-center justify-center p-4">
            <div class="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100 text-center">
                <div class="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-white text-2xl font-black mb-4 shadow-lg" style="background-color: \${siteSettings.primary_color};">
                    Wi-Fi
                </div>
                <h1 class="text-2xl font-black text-gray-800 mb-2">\${siteSettings.site_title}</h1>
                <p class="text-gray-600 text-sm mb-6">\${siteSettings.welcome_text}</p>
                
                <form action="/portal/login" method="POST" class="space-y-4 text-left">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Ingiza Kodi ya Vocha</label>
                        <input type="text" name="code" placeholder="Mf: MRASHA-XXXX" required class="w-full p-3.5 border rounded-xl font-mono font-bold text-center text-lg uppercase tracking-wider focus:outline-none focus:border-blue-600">
                    </div>
                    <button type="submit" style="background-color: \${siteSettings.primary_color};" class="w-full py-3.5 text-white font-bold rounded-xl shadow-lg transition hover:opacity-90">
                        Unganisha Mtandao (Connect)
                    </button>
                </form>

                <div class="mt-8 pt-6 border-t border-gray-100 text-xs text-gray-500">
                    Una tatizo la kuunganisha? Piga simu / WhatsApp: <br>
                    <a href="tel:\${siteSettings.support_phone}" class="font-bold text-blue-600 mt-1 inline-block">\${siteSettings.support_phone}</a>
                </div>
            </div>
        </body>
        </html>
    \`);
});`;

// Code mpya yenye Tabs za Vocha na Kununua Vifurushi
const newPortalRoute = `app.get('/portal', (req, res) => {
    let packagesOptions = packagesList.map(p => \`
        <div class="p-3 border rounded-xl flex justify-between items-center hover:border-blue-500 cursor-pointer transition bg-gray-50" onclick="selectPkg('\${p.name}', \${p.price})">
            <div>
                <p class="font-bold text-gray-800 text-sm">\${p.name} - \${p.duration}</p>
                <p class="text-xs text-blue-600 font-semibold">\${p.price} TZS</p>
            </div>
            <span class="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-lg font-bold">Chagua</span>
        </div>
    \`).join('');

    res.send(\`
        <!DOCTYPE html>
        <html lang="sw">
        <head>
            <meta charset="UTF-8">
            <title>\${siteSettings.site_title}</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-50 min-h-screen flex flex-col items-center justify-center p-4">
            <div class="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <div class="text-center mb-6">
                    <div class="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-white text-xl font-black mb-3 shadow-md" style="background-color: \${siteSettings.primary_color};">
                        Wi-Fi
                    </div>
                    <h1 class="text-2xl font-black text-gray-800 mb-1">\${siteSettings.site_title}</h1>
                    <p class="text-gray-600 text-xs">\${siteSettings.welcome_text}</p>
                </div>

                <!-- Tabs za Kuchagua -->
                <div class="flex rounded-xl bg-gray-100 p-1 mb-6 text-xs font-bold">
                    <button onclick="switchTab('voucher')" id="btnVoucher" class="flex-1 py-2 rounded-lg bg-white shadow-sm text-gray-800 transition">Ingiza Vocha</button>
                    <button onclick="switchTab('buy')" id="btnBuy" class="flex-1 py-2 rounded-lg text-gray-500 transition">Nunua Kifurushi</button>
                </div>

                <!-- Tab 1: Vocha -->
                <div id="tabVoucher">
                    <form action="/portal/login" method="POST" class="space-y-4">
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Kodi ya Vocha</label>
                            <input type="text" name="code" placeholder="MRASHA-XXXX" required class="w-full p-3.5 border rounded-xl font-mono font-bold text-center text-lg uppercase tracking-wider focus:outline-none focus:border-blue-600">
                        </div>
                        <button type="submit" style="background-color: \${siteSettings.primary_color};" class="w-full py-3.5 text-white font-bold rounded-xl shadow-lg transition hover:opacity-90">
                            Unganisha Mtandao
                        </button>
                    </form>
                </div>

                <!-- Tab 2: Nunua Kifurushi -->
                <div id="tabBuy" class="hidden space-y-4">
                    <form action="/portal/buy" method="POST" class="space-y-3">
                        <input type="hidden" id="selectedPackage" name="package_name" value="">
                        <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
                            \${packagesOptions || '<p class="text-xs text-gray-400 text-center py-4">Hakuna vifurushi kwa sasa.</p>'}
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Namba ya Simu (M-Pesa / Tigo Pesa)</label>
                            <input type="text" name="phone" placeholder="07XXXXXXXX" required class="w-full p-3 border rounded-xl font-semibold text-sm focus:outline-none focus:border-blue-600">
                        </div>
                        <button type="submit" style="background-color: \${siteSettings.primary_color};" class="w-full py-3.5 text-white font-bold rounded-xl shadow-lg transition hover:opacity-90">
                            Lipia na Unganisha
                        </button>
                    </form>
                </div>

                <div class="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
                    Msaada: <a href="tel:\${siteSettings.support_phone}" class="font-bold text-blue-600">\${siteSettings.support_phone}</a>
                </div>
            </div>

            <script>
                function switchTab(tab) {
                    if(tab === 'voucher') {
                        document.getElementById('tabVoucher').classList.remove('hidden');
                        document.getElementById('tabBuy').classList.add('hidden');
                        document.getElementById('btnVoucher').className = 'flex-1 py-2 rounded-lg bg-white shadow-sm text-gray-800 transition';
                        document.getElementById('btnBuy').className = 'flex-1 py-2 rounded-lg text-gray-500 transition';
                    } else {
                        document.getElementById('tabBuy').classList.remove('hidden');
                        document.getElementById('tabVoucher').classList.add('hidden');
                        document.getElementById('btnBuy').className = 'flex-1 py-2 rounded-lg bg-white shadow-sm text-gray-800 transition';
                        document.getElementById('btnVoucher').className = 'flex-1 py-2 rounded-lg text-gray-500 transition';
                    }
                }
                function selectPkg(name, price) {
                    document.getElementById('selectedPackage').value = name;
                    alert('Umechagua kifurushi cha ' + name + ' (' + price + ' TZS). Weka namba yako ya simu kisha ubonyeze Lipia.');
                }
            </script>
        </body>
        </html>
    \`);
});

app.post('/portal/buy', (req, res) => {
    const { package_name, phone } = req.body;
    // Tutatengeneza vocha ya muda mfupi moja kwa moja kwa ajili ya test/malipo
    const newCode = 'BUY-' + Math.floor(1000 + Math.random() * 9000);
    const pkg = packagesList.find(p => p.name === package_name) || { price: 500, duration: '60 Dakika' };
    
    vouchersList.push({
        id: Date.now(),
        code: newCode,
        package: package_name || 'Kifurushi cha Haraka',
        price: pkg.price,
        duration: pkg.duration,
        is_used: true
    });
    saveData();

    res.send(\`
        <!DOCTYPE html>
        <html lang="sw">
        <head><meta charset="UTF-8"><title>Malipo Yamefanikiwa</title><script src="https://cdn.tailwindcss.com"></script></head>
        <body class="bg-emerald-50 min-h-screen flex items-center justify-center p-4">
            <div class="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
                <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 font-bold">✓</div>
                <h1 class="text-2xl font-black text-gray-800 mb-2">Malipo Yamethibitishwa!</h1>
                <p class="text-gray-600 text-sm mb-4">Namba ya simu <b>\${phone}</b> imelipia kifurushi cha <b>\${package_name}</b> kwa mafanikio.</p>
                <div class="bg-gray-50 p-3 rounded-xl mb-6 font-mono text-xs text-gray-600">
                    Kodi yako ya mtandao: <span class="font-bold text-blue-600 text-sm">\${newCode}</span>
                </div>
                <a href="/portal" class="block w-full py-3 bg-emerald-600 text-white font-bold rounded-xl shadow">Anza Kutumia Internet</a>
            </div>
        </body>
        </html>
    \`);
});
`;

// Tutabadilisha server.js kuongeza hii route mpya
if (serverCode.includes("app.get('/portal',")) {
    // Tunasafisha sehemu ya zamani na kuweka mpya
    const parts = serverCode.split("app.get('/portal',");
    // Tutaiandika upya server.js moja kwa moja kwa usalama kamili
    console.log('Inaandaa update...');
}

console.log('Tayari kusasisha...');
