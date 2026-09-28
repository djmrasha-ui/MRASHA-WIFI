const fs = require('fs');

const vouchersHTML = `
<!DOCTYPE html>
<html lang="sw">
<head>
    <meta charset="UTF-8">
    <title>Usimamizi wa Vocha - MRASHA WiFi</title>
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
                <a href="/admin/vouchers" class="block p-3 rounded-lg bg-blue-600 font-bold">Vocha (Vouchers)</a>
                <a href="/admin/routers" class="block p-3 rounded-lg hover:bg-slate-800">Router & Access Points</a>
                <a href="/admin/settings" class="block p-3 rounded-lg hover:bg-slate-800">Page Builder (Portal)</a>
            </nav>
        </div>
        <a href="/admin/login" class="block p-3 text-red-400 hover:bg-slate-800 rounded-lg">Ondoka (Logout)</a>
    </div>

    <!-- Main Content -->
    <div class="flex-1 p-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">Usimamizi wa Vocha</h1>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Form ya Zalisha Vocha -->
            <div class="bg-white p-6 rounded-xl shadow-sm border">
                <h2 class="text-xl font-bold text-gray-800 mb-4">Zalisha Vocha Mpya</h2>
                <form action="/admin/vouchers/generate" method="POST" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Chagua Kifurushi</label>
                        <select name="package_id" required class="w-full p-2.5 border rounded-md bg-white">
                            <% if (typeof packages !== 'undefined' && packages.length > 0) { %>
                                <% packages.forEach(pkg => { %>
                                    <option value="<%= pkg.id %>"><%= pkg.name %> (<%= pkg.price %> TZS)</option>
                                <% }); %>
                            <% } else { %>
                                <option value="1">Saa 1 (500 TZS)</option>
                                <option value="2">Siku 1 (2000 TZS)</option>
                            <% } %>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Idadi ya Vocha</label>
                        <input type="number" name="quantity" value="5" min="1" max="100" required class="w-full p-2.5 border rounded-md">
                    </div>
                    <button type="submit" class="w-full bg-blue-600 text-white p-2.5 rounded-lg font-bold hover:bg-blue-700 transition">
                        Zalisha Vocha (Generate)
                    </button>
                </form>
            </div>

            <!-- Orodha ya Vocha -->
            <div class="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold text-gray-800">Orodha ya Vocha</h2>
                    <button onclick="window.print()" class="bg-slate-800 text-white px-3 py-1.5 rounded-md text-xs font-bold hover:bg-slate-700">
                        🖨️ Chapa Vocha (Print)
                    </button>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-gray-50 border-b text-xs font-semibold text-gray-600 uppercase">
                                <th class="p-3">Kodi ya Vocha (Code)</th>
                                <th class="p-3">Kifurushi</th>
                                <th class="p-3">Hali</th>
                                <th class="p-3 text-center">Kitendo</th>
                            </tr>
                        </thead>
                        <tbody class="text-sm">
                            <% if (typeof vouchers !== 'undefined' && vouchers.length > 0) { %>
                                <% vouchers.forEach(v => { %>
                                    <tr class="border-b hover:bg-gray-50">
                                        <td class="p-3 font-mono font-bold text-blue-600"><%= v.code %></td>
                                        <td class="p-3"><%= v.package_name || 'Kifurushi' %></td>
                                        <td class="p-3">
                                            <% if (v.status === 'used') { %>
                                                <span class="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-bold">Imetumika</span>
                                            <% } else { %>
                                                <span class="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-bold">Inapatikana</span>
                                            <% } %>
                                        </td>
                                        <td class="p-3 text-center">
                                            <button class="bg-red-500 text-white px-2 py-1 rounded text-xs">Futa</button>
                                        </td>
                                    </tr>
                                <% }); %>
                            <% } else { %>
                                <tr class="border-b hover:bg-gray-50">
                                    <td class="p-3 font-mono font-bold text-blue-600">8492-1039</td>
                                    <td class="p-3">Saa 1</td>
                                    <td class="p-3"><span class="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-bold">Inapatikana</span></td>
                                    <td class="p-3 text-center"><button class="bg-red-500 text-white px-2 py-1 rounded text-xs">Futa</button></td>
                                </tr>
                                <tr class="border-b hover:bg-gray-50">
                                    <td class="p-3 font-mono font-bold text-blue-600">7741-9023</td>
                                    <td class="p-3">Siku 1</td>
                                    <td class="p-3"><span class="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-bold">Inapatikana</span></td>
                                    <td class="p-3 text-center"><button class="bg-red-500 text-white px-2 py-1 rounded text-xs">Futa</button></td>
                                </tr>
                            <% } %>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

</body>
</html>
`;

fs.writeFileSync('views/admin/vouchers.ejs', vouchersHTML);
console.log('Ukurasa wa Vocha umerejeshwa kwa kikamilifu!');
