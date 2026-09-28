const fs = require('fs');

// 1. Sasisha Ukurasa wa Page Builder (Admin Settings)
fs.writeFileSync('views/admin/settings.ejs', `
<!DOCTYPE html>
<html lang="sw">
<head>
    <meta charset="UTF-8">
    <title>Page Builder (Portal UI) - MRASHA WiFi</title>
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
        <h1 class="text-3xl font-bold text-gray-800 mb-6">Page Builder (Portal UI)</h1>
        
        <div class="bg-white p-6 rounded-2xl shadow-sm border max-w-2xl space-y-6">
            <h2 class="text-xl font-bold text-gray-800 border-b pb-3">Mipangilio ya Ukurasa wa WiFi</h2>
            
            <form action="/admin/settings" method="POST" class="space-y-4">
                <div>
                    <label class="block text-xs font-bold text-gray-600 mb-1">Kichwa cha Ukurasa</label>
                    <input type="text" name="site_title" value="<%= settings.site_title || 'MRASHA WiFi Hotspot' %>" class="w-full p-3 border rounded-xl focus:outline-none focus:border-blue-500 font-semibold text-gray-800" required>
                </div>

                <div>
                    <label class="block text-xs font-bold text-gray-600 mb-1">Ujumbe wa Karibu</label>
                    <textarea name="welcome_text" rows="3" class="w-full p-3 border rounded-xl focus:outline-none focus:border-blue-500 text-sm text-gray-700" required><%= settings.welcome_text || 'Karibu! Ingiza kodi ya vocha yako hapa chini kuanza kutumia internet yenye kasi kubwa.' %></textarea>
                </div>

                <div>
                    <label class="block text-xs font-bold text-gray-600 mb-1">Rangi Kuu (Theme Color)</label>
                    <div class="flex items-center space-x-3">
                        <input type="color" name="primary_color" value="<%= settings.primary_color || '#2563eb' %>" class="h-10 w-16 p-1 border rounded-lg cursor-pointer">
                        <span class="text-sm font-mono text-gray-600"><%= settings.primary_color || '#2563eb' %></span>
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-bold text-gray-600 mb-1">Namba ya Huduma kwa Wateja</label>
                    <input type="text" name="support_phone" value="<%= settings.support_phone || '+255 700 000 000' %>" class="w-full p-3 border rounded-xl focus:outline-none focus:border-blue-500 font-semibold text-gray-800" required>
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

// 2. Sasisha Ukurasa wa Portal (views/user/portal.ejs & views/user/index.ejs)
const portalHTML = `
<!DOCTYPE html>
<html lang="sw">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= settings.site_title || 'MRASHA WiFi Hotspot' %></title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 relative">
        
        <!-- Header Banner -->
        <div style="background-color: <%= settings.primary_color || '#2563EB' %>;" class="p-8 text-white text-center rounded-t-3xl">
            <h1 class="text-3xl font-black tracking-wide"><%= settings.site_title || 'MRASHA WiFi Hotspot' %></h1>
            <p class="text-sm opacity-90 mt-2 leading-snug"><%= settings.welcome_text || 'Karibu! Ingiza kodi ya vocha yako hapa chini kuanza kutumia internet yenye kasi kubwa.' %></p>
        </div>

        <div class="p-6 space-y-6">
            <!-- Form ya Vocha -->
            <form action="/connect" method="POST" class="space-y-4">
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">KODI YA VOCHA (VOUCHER CODE)</label>
                    <input type="text" name="code" placeholder="MFANO: X8K9L2" required class="w-full text-center text-xl font-mono uppercase tracking-widest p-3.5 border-2 border-gray-200 focus:border-blue-500 rounded-2xl focus:outline-none">
                </div>
                <button type="submit" style="background-color: <%= settings.primary_color || '#2563EB' %>;" class="w-full py-3.5 text-white font-bold text-base rounded-2xl shadow-lg hover:opacity-90 transition">
                    Unganisha WiFi
                </button>
            </form>

            <!-- Vifurushi -->
            <div class="border-t pt-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wider text-center mb-4">CHAGUA KIFURUSHI UNUNUE KWA SIMU</p>
                <div class="grid grid-cols-2 gap-3">
                    <% if (packages && packages.length > 0) { %>
                        <% packages.forEach(pkg => { %>
                            <button onclick="openPaymentModal('<%= pkg.name %>', '<%= pkg.price %>', '<%= pkg.id %>')" type="button" class="p-4 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-500 rounded-2xl text-center transition duration-200 cursor-pointer shadow-sm">
                                <p class="text-xs font-bold text-gray-800"><%= pkg.name %></p>
                                <p class="text-sm font-black text-blue-600 mt-1"><%= pkg.price %> TZS</p>
                            </button>
                        <% }) %>
                    <% } else { %>
                        <button onclick="openPaymentModal('Saa 1', '500', '1')" type="button" class="p-4 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-500 rounded-2xl text-center transition duration-200 cursor-pointer shadow-sm">
                            <p class="text-xs font-bold text-gray-800">Saa 1</p>
                            <p class="text-sm font-black text-blue-600 mt-1">500 TZS</p>
                        </button>
                        <button onclick="openPaymentModal('Siku 1', '2000', '2')" type="button" class="p-4 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-500 rounded-2xl text-center transition duration-200 cursor-pointer shadow-sm">
                            <p class="text-xs font-bold text-gray-800">Siku 1</p>
                            <p class="text-sm font-black text-blue-600 mt-1">2000 TZS</p>
                        </button>
                    <% } %>
                </div>
            </div>

            <!-- Namba ya Msaada -->
            <div class="text-center pt-2">
                <p class="text-xs text-gray-500">Msaada / Huduma kwa Wateja:</p>
                <p class="text-sm font-bold text-gray-700"><%= settings.support_phone || '+255 700 000 000' %></p>
            </div>
        </div>

    </div>
</body>
</html>
`;

fs.writeFileSync('views/user/portal.ejs', portalHTML);
if (fs.existsSync('views/user/index.ejs')) {
    fs.writeFileSync('views/user/index.ejs', portalHTML);
}

console.log('Page Builder na Portal UI vimesawazishwa kikamilifu!');
