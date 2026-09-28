const fs = require('fs');

// Weka muonekano mpya wa User Portal wenye vitufe vya kubonyeza na modal ya malipo
fs.writeFileSync('views/user/portal.ejs', `
<!DOCTYPE html>
<html lang="sw">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= settings.site_title %></title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative">
        
        <!-- Header Banner -->
        <div style="background-color: <%= settings.primary_color %>;" class="p-8 text-white text-center">
            <h1 class="text-3xl font-black tracking-wide"><%= settings.site_title %></h1>
            <p class="text-sm opacity-90 mt-2"><%= settings.welcome_text %></p>
        </div>

        <div class="p-6 space-y-6">
            <!-- Messages -->
            <% if (error) { %>
                <div class="p-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded-lg text-center font-medium">
                    <%= error %>
                </div>
            <% } %>

            <% if (message) { %>
                <div class="p-3 bg-emerald-100 border border-emerald-300 text-emerald-700 text-sm rounded-lg text-center font-medium">
                    <%= message %>
                </div>
            <% } %>

            <!-- Form ya Ingiza Vocha -->
            <form action="/connect" method="POST" class="space-y-4">
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Kodi ya Vocha (Voucher Code)</label>
                    <input type="text" name="code" placeholder="MFANO: X8K9L2" required class="w-full text-center text-xl font-mono uppercase tracking-widest p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500">
                </div>
                <button type="submit" style="background-color: <%= settings.primary_color %>;" class="w-full py-3.5 text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition">
                    Unganisha WiFi
                </button>
            </form>

            <!-- Orodha ya Vifurushi vinavyobonyezeka -->
            <div class="border-t pt-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wider text-center mb-3">Chagua Kifurushi Ununue Kwa Simu</p>
                <div class="grid grid-cols-2 gap-3">
                    <% (packages || []).forEach(pkg => { %>
                        <button onclick="openPaymentModal('<%= pkg.name %>', '<%= pkg.price %>', '<%= pkg.id %>')" type="button" class="p-3 bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-500 rounded-xl text-center transition duration-200 cursor-pointer shadow-sm active:scale-95">
                            <p class="text-xs font-bold text-gray-800"><%= pkg.name %></p>
                            <p class="text-sm font-black text-blue-600 mt-1"><%= pkg.price %> TZS</p>
                        </button>
                    <% }) %>
                </div>
            </div>

            <!-- Namba ya Msaada -->
            <% if (settings.support_phone) { %>
                <div class="text-center pt-2">
                    <p class="text-xs text-gray-500">Msaada / Huduma kwa Wateja:</p>
                    <p class="text-sm font-bold text-gray-700"><%= settings.support_phone %></p>
                </div>
            <% } %>
        </div>

        <!-- Popup / Modal ya Malipo ya Mtandao -->
        <div id="paymentModal" class="fixed inset-0 bg-black/60 hidden flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 relative shadow-2xl animate-fade-in">
                <button onclick="closePaymentModal()" class="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                
                <div class="text-center">
                    <span class="text-xs font-extrabold text-blue-600 uppercase tracking-widest">Nunua Kifurushi</span>
                    <h3 id="modalPkgName" class="text-xl font-black text-gray-800 mt-1">Saa 1</h3>
                    <p id="modalPkgPrice" class="text-2xl font-black text-emerald-600 my-1">500 TZS</p>
                </div>

                <form action="/buy-package" method="POST" class="space-y-4">
                    <input type="hidden" id="modalPkgId" name="package_id">
                    
                    <div>
                        <label class="block text-xs font-bold text-gray-600 mb-1">Namba ya Simu ya Malipo</label>
                        <input type="tel" name="phone" placeholder="07XXXXXXXX au 06XXXXXXXX" required class="w-full text-center p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 font-semibold">
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-gray-600 mb-1">Chagua Mtandao</label>
                        <select name="provider" class="w-full p-3 border-2 border-gray-300 rounded-xl bg-white font-semibold text-gray-700 focus:outline-none">
                            <option value="mpesa">M-Pesa (Vodacom)</option>
                            <option value="mixbyyas">Tigo Pesa / Yas</option>
                            <option value="airtel">Airtel Money</option>
                            <option value="halopesa">HaloPesa</option>
                        </select>
                    </div>

                    <button type="submit" style="background-color: <%= settings.primary_color %>;" class="w-full py-3.5 text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition">
                        Lipa Sasa (Push USSD)
                    </button>
                </form>
            </div>
        </div>

    </div>

    <script>
        function openPaymentModal(name, price, id) {
            document.getElementById('modalPkgName').innerText = name;
            document.getElementById('modalPkgPrice').innerText = price + ' TZS';
            document.getElementById('modalPkgId').value = id;
            document.getElementById('paymentModal').classList.remove('hidden');
        }

        function closePaymentModal() {
            document.getElementById('paymentModal').classList.add('hidden');
        }
    </script>
</body>
</html>
`);

// Route ya kushughulikia malipo ya kifurushi
fs.writeFileSync('routes/userRoutes.js', `
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getPortalPage);
router.post('/connect', userController.connectVoucher);

router.post('/buy-package', (req, res) => {
    const { phone, provider, package_id } = req.body;
    // Hapa tutaunganisha na Payment Gateway (kama AzamPay / Selcom / Lipa Namba API)
    res.render('user/portal', { 
        settings: global.mockSettings, 
        packages: global.mockPackages || [], 
        message: 'Ombi la malipo limetumwa kwenye namba ' + phone + '. Weka PIN ya ' + provider.toUpperCase() + ' kukamilisha!', 
        error: null 
    });
});

module.exports = router;
`);

// Update server.js kutumia userRoutes
fs.writeFileSync('server.js', `
const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Admin Routes
const adminRoutes = require('./routes/adminRoutes');
app.use('/admin', adminRoutes);

// User / Captive Portal Routes
const userRoutes = require('./routes/userRoutes');
app.use('/', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(\`Server ina-run kwenye port \${PORT}\`);
});
`);

console.log('Vifurushi sasa vinabonyezeka na Mfumo wa Malipo umewekwa!');
