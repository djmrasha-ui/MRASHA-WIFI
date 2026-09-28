const fs = require('fs');
const path = require('path');

// 1. Hakikisha faili la views/admin/settings.ejs lipo
const settingsEjsPath = path.join(__dirname, 'views', 'admin', 'settings.ejs');
const settingsHTML = `
<!DOCTYPE html>
<html lang="sw">
<head>
    <meta charset="UTF-8">
    <title>Page Builder (Portal) - MRASHA WiFi</title>
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
                <a href="/admin/routers" class="block p-3 rounded-lg hover:bg-slate-800">Router & Access Points</a>
                <a href="/admin/settings" class="block p-3 rounded-lg bg-blue-600 font-bold">Page Builder (Portal)</a>
            </nav>
        </div>
        <a href="/admin/login" class="block p-3 text-red-400 hover:bg-slate-800 rounded-lg">Ondoka (Logout)</a>
    </div>

    <!-- Main Content -->
    <div class="flex-1 p-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">Page Builder (Captive Portal Settings)</h1>
        
        <div class="bg-white p-6 rounded-xl shadow-sm border max-w-2xl">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Mipangilio ya Ukurasa wa Login wa WiFi</h2>
            <form action="/admin/settings" method="POST" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Jina la Biashara / WiFi</label>
                    <input type="text" name="wifi_name" value="MRASHA WiFi" class="w-full p-2.5 border rounded-md">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Ujumbe wa Kuwakaribisha Wateja</label>
                    <textarea name="welcome_message" rows="3" class="w-full p-2.5 border rounded-md">Karibu kwenye mtandao wetu wa kasi wa MRASHA WiFi. Ingiza kodi ya vocha yako kuunganishwa.</textarea>
                </div>
                <button type="submit" class="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-blue-700">
                    Hifadhi Mipangilio
                </button>
            </form>
        </div>
    </div>

</body>
</html>
`;

if (!fs.existsSync(settingsEjsPath)) {
    fs.writeFileSync(settingsEjsPath, settingsHTML);
    console.log('Faili la views/admin/settings.ejs limetengenezwa.');
}

// 2. Ongeza route kwenye server.js kama haipo
let serverContent = fs.readFileSync('server.js', 'utf8');

if (!serverContent.includes("'/admin/settings'")) {
    const routeCode = `
// Route ya Settings / Page Builder
app.get('/admin/settings', (req, res) => {
    res.render('admin/settings');
});
app.post('/admin/settings', (req, res) => {
    res.redirect('/admin/settings');
});
`;
    // Ongeza kabla ya app.listen
    serverContent = serverContent.replace(/app\.listen/g, `${routeCode}\napp.listen`);
    fs.writeFileSync('server.js', serverContent);
    console.log('Route ya /admin/settings imeongezwa kwenye server.js.');
} else {
    console.log('Route ya /admin/settings tayari ipo.');
}

