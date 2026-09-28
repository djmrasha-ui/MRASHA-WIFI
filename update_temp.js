
app.get('/admin/settings', (req, res) => {
    res.send(`
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
                <div class="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-800">Page Builder (Portal UI)</h1>
                        <p class="text-sm text-gray-500">Badilisha muonekano wa ukurasa wa wateja hapa chini</p>
                    </div>
                    <div>
                        <a href="/" target="_blank" class="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition flex items-center space-x-2">
                            <span>🌐 Fungua User Portal</span>
                        </a>
                    </div>
                </div>
                
                <div class="bg-white p-6 rounded-2xl shadow-sm border max-w-2xl">
                    <form action="/admin/settings" method="POST" class="space-y-4">
                        <div>
                            <label class="block text-xs font-bold text-gray-600 mb-1">Kichwa cha Ukurasa</label>
                            <input type="text" name="site_title" value="${global.siteSettings ? global.siteSettings.site_title : 'MRASHA WiFi Hotspot'}" class="w-full p-3 border rounded-xl font-semibold text-gray-800" required>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-gray-600 mb-1">Ujumbe wa Karibu</label>
                            <textarea name="welcome_text" rows="3" class="w-full p-3 border rounded-xl text-sm text-gray-700" required>${global.siteSettings ? global.siteSettings.welcome_text : 'Karibu! Ingiza kodi ya vocha yako hapa chini kuanza kutumia internet.'}</textarea>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-gray-600 mb-1">Rangi Kuu (Theme Color)</label>
                            <div class="flex items-center space-x-3">
                                <input type="color" name="primary_color" value="${global.siteSettings ? global.siteSettings.primary_color : '#2563eb'}" class="h-10 w-16 p-1 border rounded-lg cursor-pointer">
                                <span class="text-sm font-mono text-gray-600">Chagua Rangi</span>
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-gray-600 mb-1">Namba ya Huduma kwa Wateja</label>
                            <input type="text" name="support_phone" value="${global.siteSettings ? global.siteSettings.support_phone : '+255 700 000 000'}" class="w-full p-3 border rounded-xl font-semibold text-gray-800" required>
                        </div>

                        <button type="submit" class="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 transition">
                            Hifadhi Mabadiliko
                        </button>
                    </form>
                </div>
            </div>

        </body>
        </html>
    `);
});
