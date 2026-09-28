const fs = require('fs');

const sidebarHTML = `
        <div>
            <h1 class="text-2xl font-black text-blue-400 mb-8 px-2">MRASHA WiFi</h1>
            <nav class="space-y-2">
                <a href="/admin/dashboard" class="block p-3 rounded-lg hover:bg-slate-800">Dashboard</a>
                <a href="/admin/packages" class="block p-3 rounded-lg hover:bg-slate-800">Vifurushi (Packages)</a>
                <a href="/admin/vouchers" class="block p-3 rounded-lg hover:bg-slate-800">Vocha (Vouchers)</a>
                <a href="/admin/routers" class="block p-3 rounded-lg hover:bg-slate-800">Router & Access Points</a>
                <a href="/admin/settings" class="block p-3 rounded-lg hover:bg-slate-800">Page Builder (Portal)</a>
            </nav>
        </div>
        <a href="/admin/logout" class="block p-3 text-red-400 hover:bg-slate-800 rounded-lg">Ondoka (Logout)</a>
`;

// Weka ukurasa wa Router & Access Points
fs.writeFileSync('views/admin/routers.ejs', `
<!DOCTYPE html>
<html lang="sw">
<head>
    <meta charset="UTF-8">
    <title>Router & AP Settings - MRASHA WiFi</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 flex min-h-screen">

    <div class="w-64 bg-slate-900 text-white flex flex-col justify-between p-4">
        <div>
            <h1 class="text-2xl font-black text-blue-400 mb-8 px-2">MRASHA WiFi</h1>
            <nav class="space-y-2">
                <a href="/admin/dashboard" class="block p-3 rounded-lg hover:bg-slate-800">Dashboard</a>
                <a href="/admin/packages" class="block p-3 rounded-lg hover:bg-slate-800">Vifurushi (Packages)</a>
                <a href="/admin/vouchers" class="block p-3 rounded-lg hover:bg-slate-800">Vocha (Vouchers)</a>
                <a href="/admin/routers" class="block p-3 rounded-lg bg-blue-600 font-bold">Router & Access Points</a>
                <a href="/admin/settings" class="block p-3 rounded-lg hover:bg-slate-800">Page Builder (Portal)</a>
            </nav>
        </div>
        <a href="/admin/logout" class="block p-3 text-red-400 hover:bg-slate-800 rounded-lg">Ondoka (Logout)</a>
    </div>

    <div class="flex-1 p-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">Usimamizi wa Router & Access Points</h1>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-xl shadow-md space-y-4 border">
                <h2 class="text-xl font-bold text-gray-800 border-b pb-2">MikroTik RouterOS Config</h2>
                <form action="/admin/routers/mikrotik" method="POST" class="space-y-3">
                    <div>
                        <label class="block text-xs font-bold text-gray-600 mb-1">IP Address / Host</label>
                        <input type="text" name="host" value="192.168.88.1" required class="w-full p-2.5 border rounded-lg">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-600 mb-1">API Port</label>
                        <input type="number" name="port" value="8728" required class="w-full p-2.5 border rounded-lg">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-600 mb-1">Username</label>
                        <input type="text" name="user" value="admin" required class="w-full p-2.5 border rounded-lg">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-600 mb-1">Password</label>
                        <input type="password" name="password" placeholder="Weka password ya MikroTik" class="w-full p-2.5 border rounded-lg">
                    </div>
                    <button type="submit" class="w-full py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">
                        Hifadhi Mipangilio ya MikroTik
                    </button>
                </form>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-md space-y-4 border">
                <h2 class="text-xl font-bold text-gray-800 border-b pb-2">TP-Link Omada Controller Config</h2>
                <form action="/admin/routers/omada" method="POST" class="space-y-3">
                    <div>
                        <label class="block text-xs font-bold text-gray-600 mb-1">Controller URL</label>
                        <input type="text" name="url" placeholder="https://192.168.0.100:8043" class="w-full p-2.5 border rounded-lg">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-600 mb-1">Site ID</label>
                        <input type="text" name="site" value="default" class="w-full p-2.5 border rounded-lg">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-600 mb-1">Admin Username</label>
                        <input type="text" name="user" placeholder="admin" class="w-full p-2.5 border rounded-lg">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-600 mb-1">Admin Password</label>
                        <input type="password" name="password" placeholder="Password" class="w-full p-2.5 border rounded-lg">
                    </div>
                    <button type="submit" class="w-full py-2.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition">
                        Hifadhi Mipangilio ya Omada
                    </button>
                </form>
            </div>
        </div>
    </div>

</body>
</html>
`);

console.log('Ukurasa wa Router & Access Points na Sidebar vimesasishwa!');
