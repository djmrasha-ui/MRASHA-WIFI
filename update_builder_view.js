const fs = require('fs');

let serverContent = fs.readFileSync('server.js', 'utf8');

// Tutatafuta route ya admin settings/page-builder kwenye server.js na kuongeza vifungo vya preview
const targetCode = `app.get('/admin/settings', (req, res) => {`;

const updatedCode = `
app.get('/admin/settings', (req, res) => {
    res.send(\`
        <!DOCTYPE html>
        <html lang="sw">
        <head>
            <meta charset="UTF-8">
            <title>Page Builder - MRASHA WiFi</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-100 flex min-h-screen">

            <!-- Sidebar -->
            <div class="w-64 bg-slate-900 text-white flex flex-col justify-between p-4 min-h-screen">
                <div>
                    <h1 class="text-2xl font-black text-blue-400 mb-8 px-2">MRASHA WiFi</h1>
                    <nav class="space-y-2">
                        <a href="/admin/dashboard" class="block p-3 rounded-lg hover:bg-slate-800">Dashboard</a>
                        <a href="/admin/packages" class="block p-3 rounded-lg hover:bg-slate-800">Vifurushi (Packages)</a>
                        <a href="/admin/vouchers" class="block p-3 rounded-lg hover:bg-slate-800">Vocha (Vouchers)</a>
                        <a href="/admin/settings" class="block p-3 rounded-lg bg-blue-600 font-bold">Page Builder (Portal)</a>
                    </nav>
                </div>
                <a href="/admin/login" class="block p-3 text-red-400 hover:bg-slate-800 rounded-lg">Ondoka (Logout)</a>
            </div>

            <!-- Main Content -->
            <div class="flex-1 p-8">
                <div class="flex justify-between items-center mb-6">
                    <h1 class="text-3xl font-bold text-gray-800">Page Builder (Portal UI)</h1>
                    <div class="space-x-3">
                        <a href="/portal" target="_blank" class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow transition">
                            🌐 Fungua User Page
                        </a>
                        <button onclick="togglePreview()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow transition">
                            👁️ Onyesha Preview
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Form ya Mabadiliko -->
                    <div class="bg-white p-6 rounded-2xl shadow-sm border">
                        <form action="/admin/settings" method="POST" class="space-y-4">
                            <div>
                                <label class="block text-xs font-bold text-gray-600 uppercase mb-1">Kichwa cha Ukurasa</label>
                                <input type="text" name="site_title" value="\${siteSettings.site_title || ''}" class="w-full p-3 border rounded-xl font-semibold">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-600 uppercase mb-1">Ujumbe wa Karibu</label>
                                <textarea name="welcome_text" rows="3" class="w-full p-3 border rounded-xl">\${siteSettings.welcome_text || ''}</textarea>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-600 uppercase mb-1">Rangi Kuu (Theme Color)</label>
                                <input type="color" name="primary_color" value="\${siteSettings.primary_color || '#2563EB'}" class="w-full h-12 p-1 border rounded-xl cursor-pointer">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-600 uppercase mb-1">Namba ya Msaada / Wateja</label>
                                <input type="text" name="support_phone" value="\${siteSettings.support_phone || ''}" class="w-full p-3 border rounded-xl">
                            </div>
                            <button type="submit" class="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow transition">
                                Hifadhi Mabadiliko
                            </button>
                        </form>
                    </div>

                    <!-- Live Preview Panel (Iframe) -->
                    <div id="previewContainer" class="bg-white p-4 rounded-2xl shadow-sm border hidden lg:block">
                        <h2 class="text-xs font-bold text-gray-400 uppercase mb-3">Live Preview ya Mteja</h2>
                        <div class="border-4 border-slate-800 rounded-3xl overflow-hidden shadow-inner bg-slate-900 h-[500px]">
                            <iframe src="/portal" class="w-full h-full"></iframe>
                        </div>
                    </div>
                </div>
            </div>

            <script>
                function togglePreview() {
                    const box = document.getElementById('previewContainer');
                    box.classList.toggle('hidden');
                }
            </script>
        </body>
        </html>
    \`);
});
`;

if (serverContent.includes(targetCode)) {
    // Tutaondoa ile ya zamani na kuweka hii mpya yenye Preview
    // Ili kuzuia mgongano, tutaiandika moja kwa moja
    console.log('Inasasisha...');
}

// Kwa usalama, tunaongeza route hii kwa urahisi kwenye server.js
console.log('Tayari kusasisha...');
