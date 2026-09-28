
const db = require('../config/db');

// In-memory fallback
global.mockVouchers = global.mockVouchers || [];

exports.getVouchers = async (req, res) => {
    let packages = global.mockPackages || [];
    try {
        const [pkgRows] = await db.query('SELECT * FROM packages');
        if (pkgRows && pkgRows.length > 0) packages = pkgRows;
    } catch (err) {}

    try {
        const [vouchers] = await db.query(`
            SELECT v.*, p.name as package_name, p.price 
            FROM vouchers v 
            JOIN packages p ON v.package_id = p.id 
            ORDER BY v.created_at DESC
        `);
        res.render('admin/vouchers', { vouchers, packages });
    } catch (err) {
        res.render('admin/vouchers', { vouchers: global.mockVouchers, packages });
    }
};

exports.generateVouchers = async (req, res) => {
    const { package_id, count } = req.body;
    const numToGenerate = parseInt(count) || 1;
    const pkgId = parseInt(package_id);

    let pkgName = 'Kifurushi';
    let pkgPrice = 0;
    const foundPkg = (global.mockPackages || []).find(p => p.id == pkgId);
    if (foundPkg) {
        pkgName = foundPkg.name;
        pkgPrice = foundPkg.price;
    }

    const newVouchers = [];
    for (let i = 0; i < numToGenerate; i++) {
        // Tengeneza kodi ya tarakimu 6 za idadi na herufi
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        newVouchers.push({
            id: Date.now() + i,
            code,
            package_id: pkgId,
            package_name: pkgName,
            price: pkgPrice,
            is_used: false,
            created_at: new Date().toLocaleDateString()
        });
    }

    try {
        for (let v of newVouchers) {
            await db.query('INSERT INTO vouchers (code, package_id) VALUES (?, ?)', [v.code, v.package_id]);
        }
    } catch (err) {
        global.mockVouchers.unshift(...newVouchers);
    }

    res.redirect('/admin/vouchers');
};
