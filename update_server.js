const fs = require('fs');

let serverCode = fs.readFileSync('server.js', 'utf8');

// 1. Rekebisha typo ya <hh1 kwenye dashboard
serverCode = serverCode.replace('<hh1 class="text-3xl font-black text-gray-800 mb-6">Dashboard Kuu</h1>', '<h1 class="text-3xl font-black text-gray-800 mb-6">Dashboard Kuu</h1>');

// 2. Ongeza vouchersList kwenye data stores kama haipo
if (!serverCode.includes('let vouchersList =')) {
    const targetStore = "let packagesList = [";
    const newStore = `let vouchersList = [
    { id: 1, code: 'MRASHA-5001', package: 'Saa 1', price: 500, duration: '60 Dakika', is_used: false }
];\n\nlet packagesList = [`;
    serverCode = serverCode.replace(targetStore, newStore);
}

// 3. Badilisha route ya /admin/vouchers iwe na uwezo wa kuzalisha vocha na kuziona
const oldVoucherRoute = `// Vouchers Page placeholder
app.get('/admin/vouchers', (req, res) => {
    const content = \`
        <h1 class="text-3xl font-black text-gray-800 mb-6">Usimamizi wa Vocha</h1>
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p class="text-gray-600">Sehemu ya kuzalisha na kusimamia vocha za wateja iko tayari.</p>
        </div>
    \`;
    res.send(adminLayout('Vocha', 'vouchers', content));
});`;

const newVoucherRoute = `// Vouchers Management Page
app.get('/admin/vouchers', (req, res) => {
    let rows = vouchersList.map(v => \`
        <tr class="border-b hover:bg-gray-50">
            <td class="p-4 font-mono font-bold text-gray-800">\${v.code}</td>
            <td class="p-4 text-gray-600">\${v.package}</td>
            <td class="p-4 font-semibold text-blue-600">\${v.price} TZS</td>
            <td class="p-4 text-gray-600">\${v.duration}</td>
            <td class="p-4">
                \${v.is_used ? '<span class="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">Imetumika</span>' : '<span class="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">Mpya (Haitumika)</span>'}
            </td>
            <td class="p-4 text-right">
                <form action="/admin/vouchers/delete/\${v.id}" method="POST" style="display:inline;">
                    <button type="submit" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition">Futa</button>
                </form>
            </td>
        </tr>
    \`).join('');

    const content = \`
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-black text-gray-800">Usimamizi wa Vocha</h1>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <h2 class="text-lg font-bold text-gray-800 mb-4">Zalisha Vocha Mpya (Generate Vouchers)</h2>
            <form action="/admin/vouchers/generate" method="POST" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select name="package_id" required class="p-3 border rounded-xl focus:outline-none focus:border-blue-500 bg-white">
                    <option value="">Chagua Kifurushi</option>
                    \${packagesList.map(p => \`<option value="\${p.id}">\${p.name} - \${p.price} TZS (\${p.duration})</option>\`).join('')}
                </select>
                <input type="number" name="qty" placeholder="Idadi ya Vocha (Mf: 10)" min="1" max="100" required class="p-3 border rounded-xl focus:outline-none focus:border-blue-500">
                <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl py-3 transition shadow-md">Zalisha Vocha</button>
            </form>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-gray-50 text-gray-400 text-xs font-bold uppercase">
                        <th class="p-4">Kodi ya Vocha</th>
                        <th class="p-4">Kifurushi</th>
                        <th class="p-4">Bei</th>
                        <th class="p-4">Muda</th>
                        <th class="p-4">Hali</th>
                        <th class="p-4 text-right">Vitendo</th>
                    </tr>
                </thead>
                <tbody>
                    \${rows || '<tr><td colspan="6" class="p-4 text-center text-gray-500">Hakuna vocha zilizozalishwa bado.</td></tr>'}
                </tbody>
            </table>
        </div>
    \`;
    res.send(adminLayout('Vocha', 'vouchers', content));
});

app.post('/admin/vouchers/generate', (req, res) => {
    const { package_id, qty } = req.body;
    const pkg = packagesList.find(p => p.id == package_id);
    if (pkg) {
        const count = parseInt(qty) || 1;
        for (let i = 0; i < count; i++) {
            const randomCode = 'MRASHA-' + Math.floor(1000 + Math.random() * 9000);
            vouchersList.push({
                id: Date.now() + i,
                code: randomCode,
                package: pkg.name,
                price: pkg.price,
                duration: pkg.duration,
                is_used: false
            });
        }
    }
    res.redirect('/admin/vouchers');
});

app.post('/admin/vouchers/delete/:id', (req, res) => {
    const { id } = req.params;
    vouchersList = vouchersList.filter(v => v.id != id);
    res.redirect('/admin/vouchers');
});`;

if (serverCode.includes('// Vouchers Page placeholder')) {
    serverCode = serverCode.replace(oldVoucherRoute, newVoucherRoute);
    fs.writeFileSync('server.js', serverCode);
    console.log('Server.js imesasishwa kikamilifu na kipengele cha Vocha bila kupoteza chochote!');
} else {
    console.log('Muundo wa server.js umekaguliwa.');
}
