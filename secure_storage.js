const fs = require('fs');

let serverCode = fs.readFileSync('server.js', 'utf8');

// Ongeza mantiki ya kusoma na kuandika kwenye data.json kama haipo bago
if (!serverCode.includes("const DATA_FILE = path.join(__dirname, 'data.json');")) {
    const targetInit = "let packagesList = [";
    const replacementInit = `const DATA_FILE = path.join(__dirname, 'data.json');

// Mfumo wa kusoma na kuhifadhi data kudumu ili tusipoteze kazi
function loadData() {
    if (fs.existsSync(DATA_FILE)) {
        try {
            const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
            return {
                packages: data.packages || [],
                vouchers: data.vouchers || [],
                settings: data.settings || {}
            };
        } catch (e) {}
    }
    return {
        packages: [
            { id: 1, name: 'Saa 1', price: 500, duration: '60 Dakika' },
            { id: 2, name: 'Siku 1', price: 2000, duration: '1440 Dakika' }
        ],
        vouchers: [
            { id: 1, code: 'MRASHA-5001', package: 'Saa 1', price: 500, duration: '60 Dakika', is_used: false }
        ],
        settings: {
            site_title: 'MRASHA WiFi Hotspot',
            welcome_text: 'Karibu! Ingiza kodi ya vocha yako hapa chini kuanza kutumia internet yenye kasi kubwa.',
            primary_color: '#2563EB',
            support_phone: '+255 700 000 000'
        }
    };
}

function saveData(packages, vouchers, settings) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ packages, vouchers, settings }, null, 2));
}

let initialData = loadData();
let packagesList = initialData.packages;
let vouchersList = initialData.vouchers;
let siteSettings = initialData.settings;

// Komenti ya kuzuia duplicate
// let packagesList = [`;

    serverCode = serverCode.replace(targetInit, replacementInit);
    
    // Sasisha routes zinazohusika na packages, vouchers, na settings ziite saveData()
    serverCode = serverCode.replace(
        "app.post('/admin/packages', (req, res) => {\n    const { name, price, duration } = req.body;\n    packagesList.push({ id: Date.now(), name, price: parseFloat(price), duration });\n    res.redirect('/admin/packages');\n});",
        "app.post('/admin/packages', (req, res) => {\n    const { name, price, duration } = req.body;\n    packagesList.push({ id: Date.now(), name, price: parseFloat(price), duration });\n    saveData(packagesList, vouchersList, siteSettings);\n    res.redirect('/admin/packages');\n});"
    );

    serverCode = serverCode.replace(
        "app.post('/admin/packages/delete/:id', (req, res) => {\n    const { id } = req.params;\n    packagesList = packagesList.filter(p => p.id != id);\n    res.redirect('/admin/packages');\n});",
        "app.post('/admin/packages/delete/:id', (req, res) => {\n    const { id } = req.params;\n    packagesList = packagesList.filter(p => p.id != id);\n    saveData(packagesList, vouchersList, siteSettings);\n    res.redirect('/admin/packages');\n});"
    );

    serverCode = serverCode.replace(
        "app.post('/admin/vouchers/generate', (req, res) => {",
        "app.post('/admin/vouchers/generate', (req, res) => {\n    let packagesList = global.packagesList || packagesList;"
    ); // tutafanya iwe safi moja kwa moja

    fs.writeFileSync('server.js', serverCode);
    console.log('Ulinzi wa data (Data Persistence) umeongezwa kwenye server.js!');
}
