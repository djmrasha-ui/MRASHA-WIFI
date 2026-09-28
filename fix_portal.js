const fs = require('fs');

let serverContent = fs.readFileSync('server.js', 'utf8');

// Ondoa kipande kilichovurugika kama kipo
if (serverContent.includes('// 6. User Portal')) {
    serverContent = serverContent.substring(0, serverContent.indexOf('// 6. User Portal'));
}

// Ongeza routi sahihi za user portal
serverContent += `
// 6. User Portal & Hotspot Captive Portal Routes
app.get('/portal', (req, res) => {
    res.send(\`
        <!DOCTYPE html>
        <html lang="sw">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>\${siteSettings.site_title || 'MRASHA WiFi'}</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-slate-900 min-h-screen flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border-t-8" style="border-color: \${siteSettings.primary_color || '#2563EB'};">
                <div class="text-center mb-6">
                    <h1 class="text-2xl font-black text-slate-800">\${siteSettings.site_title || 'MRASHA WiFi Hotspot'}</h1>
                    <p class="text-gray-500 text-sm mt-2">\${siteSettings.welcome_text || 'Karibu! Ingiza kodi ya vocha yako hapa chini.'}</p>
                </div>

                <!-- Form ya Kuingiza Vocha -->
                <form action="/portal/login" method="POST" class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-gray-600 uppercase mb-1">Ingiza Kodi ya Vocha</label>
                        <input type="text" name="code" placeholder="Mf: MRASHA-XXXX" required class="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono uppercase text-center font-bold text-lg tracking-widest">
                    </div>
                    <button type="submit" class="w-full py-4 text-white font-bold rounded-xl shadow-lg transition duration-200" style="background-color: \${siteSettings.primary_color || '#2563EB'};">
                        Unganisha na Internet
                    </button>
                </form>

                <div class="text-center mt-6 text-xs text-gray-400">
                    <p>Msaada / Huduma kwa Wateja: <span class="font-bold text-gray-600">\${siteSettings.support_phone || '+255 700 000 000'}</span></p>
                </div>
            </div>
        </body>
        </html>
    \`);
});

app.post('/portal/login', (req, res) => {
    const { code } = req.body;
    const cleanCode = code ? code.trim().toUpperCase() : '';
    const voucher = vouchersList.find(v => v.code === cleanCode);

    if (!voucher) {
        return res.send("<script>alert('Kodi ya vocha siyo sahihi!'); window.location.href='/portal';</script>");
    }

    if (voucher.is_used) {
        return res.send("<script>alert('Vocha hii imeshatumika tayari!'); window.location.href='/portal';</script>");
    }

    voucher.is_used = true;
    saveData();

    res.send(\`
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
    \`);
});
`;

fs.writeFileSync('server.js', serverContent);
console.log('Server.js imerekebishwa na kuwekwa User Portal safi!');
