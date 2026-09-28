const fs = require('fs');

// 1. Auth Controller
fs.writeFileSync('controllers/authController.js', `
exports.getLoginPage = (req, res) => {
    res.render('admin/login', { error: null });
};

exports.postLogin = async (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') {
        res.redirect('/admin/dashboard');
    } else {
        res.render('admin/login', { error: 'Jina la mtumiaji au nenosiri si sahihi!' });
    }
};
`);

// 2. Login View
fs.mkdirSync('views/admin', { recursive: true });
fs.writeFileSync('views/admin/login.ejs', `
<!DOCTYPE html>
<html lang="sw">
<head>
    <meta charset="UTF-8">
    <title>Admin Login - MRASHA WiFi</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-900 min-h-screen flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div class="text-center mb-8">
            <h1 class="text-3xl font-extrabold text-slate-800">MRASHA WiFi</h1>
            <p class="text-gray-500 text-sm mt-1">Ingia kwenye Mfumo wa Admin</p>
        </div>
        <% if (error) { %>
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm text-center">
                <%= error %>
            </div>
        <% } %>
        <form action="/admin/login" method="POST" class="space-y-5">
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                <input type="text" name="username" placeholder="admin" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
            </div>
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                <input type="password" name="password" placeholder="••••••••" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
            </div>
            <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-200 shadow-md">
                Ingia (Login)
            </button>
        </form>
    </div>
</body>
</html>
`);

// 3. Admin Routes
fs.mkdirSync('routes', { recursive: true });
fs.writeFileSync('routes/adminRoutes.js', `
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', authController.getLoginPage);
router.post('/login', authController.postLogin);
router.get('/dashboard', (req, res) => res.render('admin/dashboard'));

module.exports = router;
`);

// 4. Server.js
fs.writeFileSync('server.js', `
const express = require('express');
const path = require('path');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Connect Admin Routes
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
    res.redirect('/admin/login');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(\`Server inakimbia kwenye port \${PORT}\`);
});
`);

console.log('Mfumo umewekwa sawa kikamilifu!');
