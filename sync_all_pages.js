const fs = require('fs');

// Helper ya Kutengeneza Sidebar kulingana na Ukurasa uliopo
function getSidebar(activePage) {
    return `
    <div class="w-64 bg-slate-900 text-white flex flex-col justify-between p-4 min-h-screen">
        <div>
            <h1 class="text-2xl font-black text-blue-400 mb-8 px-2">MRASHA WiFi</h1>
            <nav class="space-y-2">
                <a href="/admin/dashboard" class="block p-3 rounded-lg ${activePage === 'dashboard' ? 'bg-blue-600 font-bold' : 'hover:bg-slate-800'}">Dashboard</a>
                <a href="/admin/packages" class="block p-3 rounded-lg ${activePage === 'packages' ? 'bg-blue-600 font-bold' : 'hover:bg-slate-800'}">Vifurushi (Packages)</a>
                <a href="/admin/vouchers" class="block p-3 rounded-lg ${activePage === 'vouchers' ? 'bg-blue-600 font-bold' : 'hover:bg-slate-800'}">Vocha (Vouchers)</a>
                <a href="/admin/routers" class="block p-3 rounded-lg ${activePage === 'routers' ? 'bg-blue-600 font-bold' : 'hover:bg-slate-800'}">Router & Access Points</a>
                <a href="/admin/page-builder" class="block p-3 rounded-lg ${activePage === 'page-builder' ? 'bg-blue-600 font-bold' : 'hover:bg-slate-800'}">Page Builder (Portal)</a>
            </nav>
        </div>
        <a href="/admin/login" class="block p-3 text-red-400 hover:bg-slate-800 rounded-lg">Ondoka (Logout)</a>
    </div>`;
}

// 1. Dashboard
fs.writeFileSync('views/admin/dashboard.ejs', `
<!DOCTYPE html>
<html lang="sw">
<head>
    <meta charset="UTF-8">
    <title>Dashboard - MRASHA WiFi</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 flex min-h-screen">
    ${getSidebar('dashboard')}
    <div class="flex-1 p-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">Muhtasari wa Mfumo</h1>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-blue-500">
                <p class="text-xs font-bold text-gray-400 uppercase">Vifurushi Active</p>
                <p class="text-2xl font-bold text-gray-800 mt-2">Ready</p>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-emerald-500">
                <p class="text-xs font-bold text-gray-400 uppercase">Mapato Leo</p>
                <p class="text-2xl font-bold text-gray-800 mt-2">0 TZS</p>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-purple-500">
                <p class="text-xs font-bold text-gray-400 uppercase">Users Online</p>
                <p class="text-2xl font-bold text-gray-800 mt-2">0</p>
            </div>
        </div>
    </div>
</body>
</html>
`);

// 2. Vouchers
fs.writeFileSync('views/admin/vouchers.ejs', `
<!DOCTYPE html>
<html lang="sw">
<head>
    <meta charset="UTF-8">
    <title>Vocha - MRASHA WiFi</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 flex min-h-screen">
    ${getSidebar('vouchers')}
    <div class="flex-1 p-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">Usimamizi wa Vocha</h1>
        <div class="bg-white p-6 rounded-xl shadow-sm border">
            <p class="text-gray-600">Sehemu ya kuzalisha (generate) Vocha kwa ajili ya wateja.</p>
        </div>
    </div>
</body>
</html>
`);

// 3. Page Builder
fs.writeFileSync('views/admin/page_builder.ejs', `
<!DOCTYPE html>
<html lang="sw">
<head>
    <meta charset="UTF-8">
    <title>Page Builder - MRASHA WiFi</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 flex min-h-screen">
    ${getSidebar('page-builder')}
    <div class="flex-1 p-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">Page Builder (Portal UI)</h1>
        <div class="bg-white p-6 rounded-xl shadow-sm border max-w-2xl">
            <form action="/admin/page-builder" method="POST" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Kichwa cha Ukurasa</label>
                    <input type="text" name="site_title" value="<%= settings.site_title || 'Karibu WiFi Hotspot' %>" class="w-full mt-1 p-2 border rounded-md">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Ujumbe wa Karibu</label>
                    <textarea name="welcome_text" class="w-full mt-1 p-2 border rounded-md"><%= settings.welcome_text || '' %></textarea>
                </div>
                <button type="submit" class="w-full py-2.5 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700">Hifadhi Mabadiliko</button>
            </form>
        </div>
    </div>
</body>
</html>
`);

console.log('Sidebar imesawazishwa kikamilifu kwenye kurasa zote za Admin!');
