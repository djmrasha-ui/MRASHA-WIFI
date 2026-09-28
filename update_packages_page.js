const fs = require('fs');

const packagesPageHTML = `
<!DOCTYPE html>
<html lang="sw">
<head>
    <meta charset="UTF-8">
    <title>Usimamizi wa Vifurushi - MRASHA WiFi</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 flex min-h-screen">

    <!-- Sidebar -->
    <div class="w-64 bg-slate-900 text-white flex flex-col justify-between p-4">
        <div>
            <h1 class="text-2xl font-black text-blue-400 mb-8 px-2">MRASHA WiFi</h1>
            <nav class="space-y-2">
                <a href="/admin/dashboard" class="block p-3 rounded-lg hover:bg-slate-800">Dashboard</a>
                <a href="/admin/packages" class="block p-3 rounded-lg bg-blue-600 font-bold">Vifurushi (Packages)</a>
                <a href="/admin/vouchers" class="block p-3 rounded-lg hover:bg-slate-800">Vocha (Vouchers)</a>
                <a href="/admin/routers" class="block p-3 rounded-lg hover:bg-slate-800">Router & Access Points</a>
                <a href="/admin/settings" class="block p-3 rounded-lg hover:bg-slate-800">Page Builder (Portal)</a>
            </nav>
        </div>
        <a href="/admin/logout" class="block p-3 text-red-400 hover:bg-slate-800 rounded-lg">Ondoka (Logout)</a>
    </div>

    <!-- Content -->
    <div class="flex-1 p-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">Usimamizi wa Vifurushi</h1>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Form -->
            <div class="bg-white p-6 rounded-xl shadow-sm border">
                <h2 class="text-xl font-bold text-gray-800 mb-4">Tengeneza Kifurushi</h2>
                <form action="/admin/packages" method="POST" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Jina la Kifurushi</label>
                        <input type="text" name="name" required class="w-full mt-1 p-2 border rounded-md">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Bei (TZS)</label>
                        <input type="number" name="price" required class="w-full mt-1 p-2 border rounded-md">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Muda (Dakika)</label>
                        <input type="number" name="duration_minutes" required class="w-full mt-1 p-2 border rounded-md">
                    </div>
                    <button type="submit" class="w-full bg-blue-600 text-white p-2.5 rounded-lg font-bold hover:bg-blue-700 transition">Hifadhi Kifurushi</button>
                </form>
            </div>

            <!-- Table -->
            <div class="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border">
                <h2 class="text-xl font-bold text-gray-800 mb-4">Orodha ya Vifurushi</h2>
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-gray-50 border-b">
                            <th class="p-3 text-sm font-semibold text-gray-600">Jina</th>
                            <th class="p-3 text-sm font-semibold text-gray-600">Bei</th>
                            <th class="p-3 text-sm font-semibold text-gray-600">Muda</th>
                            <th class="p-3 text-sm font-semibold text-gray-600 text-center">Kitendo</th>
                        </tr>
                    </thead>
                    <tbody>
                        <% packages.forEach(pkg => { %>
                            <tr class="border-b hover:bg-gray-50">
                                <td class="p-3 font-semibold"><%= pkg.name %></td>
                                <td class="p-3"><%= pkg.price %> TZS</td>
                                <td class="p-3"><%= pkg.duration_minutes %> Dakika</td>
                                <td class="p-3 text-center space-x-2">
                                    <button class="bg-amber-500 text-white px-3 py-1 rounded-md text-xs font-bold">Hariri (Edit)</button>
                                    <button class="bg-red-600 text-white px-3 py-1 rounded-md text-xs font-bold">Futa (Delete)</button>
                                </td>
                            </tr>
                        <% }); %>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

</body>
</html>
`;

fs.writeFileSync('views/admin/packages.ejs', packagesPageHTML);
console.log('Page ya packages imesasishwa kikamilifu!');
