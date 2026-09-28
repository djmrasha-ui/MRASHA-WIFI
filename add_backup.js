const fs = require('fs');

let serverContent = fs.readFileSync('server.js', 'utf8');

// Hakikisha mfumo wa kuandika na kusoma data.json upo
const backupCode = `
// --- AUTOMATIC BACKUP & PERSISTENCE ---
const DATA_FILE = path.join(__dirname, 'data.json');

function saveData() {
    try {
        const data = {
            packages: global.packagesList || [],
            vouchers: global.vouchersList || [],
            settings: global.siteSettings || {}
        };
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Hitilafu wakati wa kusave backup:', err);
    }
}

function loadData() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const raw = fs.readFileSync(DATA_FILE, 'utf8');
            const data = JSON.parse(raw);
            if (data.packages) global.packagesList = data.packages;
            if (data.vouchers) global.vouchersList = data.vouchers;
            if (data.settings) global.siteSettings = data.settings;
            console.log('Data zote zimeloadishwa kutoka kwenye Backup (data.json)!');
        }
    } catch (err) {
        console.error('Hitilafu wakati wa kusoma backup:', err);
    }
}

// Load data wakati server inaanza
loadData();
`;

// Kama haijasajiliwa kwenye server.js, iweke mwanzoni kabisa baada ya express
if (!serverContent.includes('DATA_FILE')) {
    serverContent = serverContent.replace("const app = express();", "const app = express();\n" + backupCode);
    fs.writeFileSync('server.js', serverContent);
    console.log('Mfumo wa Backup umeongezwa kwenye server.js!');
} else {
    console.log('Mfumo wa Backup ulikuwepo tayari.');
}
