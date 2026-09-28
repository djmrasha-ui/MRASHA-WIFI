
const db = require('../config/db');

global.mockPackages = global.mockPackages || [
    { id: 1, name: 'Saa 1', price: 500, duration_minutes: 60 },
    { id: 2, name: 'Siku 1', price: 2000, duration_minutes: 1440 }
];

exports.getPackages = async (req, res) => {
    try {
        const [packages] = await db.query('SELECT * FROM packages ORDER BY created_at DESC');
        res.render('admin/packages', { packages });
    } catch (err) {
        res.render('admin/packages', { packages: global.mockPackages });
    }
};

exports.createPackage = async (req, res) => {
    const { name, price, duration_minutes } = req.body;
    try {
        await db.query(
            'INSERT INTO packages (name, price, duration_minutes) VALUES (?, ?, ?)',
            [name, parseFloat(price), parseInt(duration_minutes)]
        );
        res.redirect('/admin/packages');
    } catch (err) {
        global.mockPackages.unshift({
            id: Date.now(),
            name,
            price: parseFloat(price),
            duration_minutes: parseInt(duration_minutes)
        });
        res.redirect('/admin/packages');
    }
};

exports.updatePackage = async (req, res) => {
    const { id } = req.params;
    const { name, price, duration_minutes } = req.body;
    try {
        await db.query(
            'UPDATE packages SET name = ?, price = ?, duration_minutes = ? WHERE id = ?',
            [name, parseFloat(price), parseInt(duration_minutes), id]
        );
    } catch (err) {
        const index = global.mockPackages.findIndex(p => p.id == id);
        if (index !== -1) {
            global.mockPackages[index] = { id, name, price: parseFloat(price), duration_minutes: parseInt(duration_minutes) };
        }
    }
    res.redirect('/admin/packages');
};

exports.deletePackage = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM packages WHERE id = ?', [id]);
    } catch (err) {
        global.mockPackages = global.mockPackages.filter(p => p.id != id);
    }
    res.redirect('/admin/packages');
};
