
const db = require('../config/db');

global.mockPackages = global.mockPackages || [
    { id: 1, name: 'Saa 1', price: 500, duration_minutes: 60, is_active: 1 },
    { id: 2, name: 'Siku 1', price: 2000, duration_minutes: 1440, is_active: 1 }
];

exports.getPackagesPage = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM packages WHERE is_active = TRUE ORDER BY id DESC');
        res.render('admin/packages', { packages: rows });
    } catch (err) {
        res.render('admin/packages', { packages: global.mockPackages });
    }
};

exports.addPackage = async (req, res) => {
    const { name, price, duration_minutes } = req.body;
    try {
        await db.query(
            'INSERT INTO packages (name, price, duration_minutes, is_active) VALUES (?, ?, ?, TRUE)',
            [name, price, duration_minutes]
        );
    } catch (err) {
        const newPkg = {
            id: Date.now(),
            name,
            price: parseFloat(price),
            duration_minutes: parseInt(duration_minutes),
            is_active: 1
        };
        global.mockPackages.push(newPkg);
    }
    res.redirect('/admin/packages');
};

exports.deletePackage = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('UPDATE packages SET is_active = FALSE WHERE id = ?', [id]);
    } catch (err) {
        global.mockPackages = global.mockPackages.filter(p => p.id != id);
    }
    res.redirect('/admin/packages');
};
