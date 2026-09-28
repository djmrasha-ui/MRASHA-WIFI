const fs = require('fs');

// 1. Array ya muda kuhifadhi vifurushi kama database haijaunganishwa
fs.writeFileSync('controllers/packageController.js', `
const db = require('../config/db');

// In-memory fallback
global.mockPackages = global.mockPackages || [
    { id: 1, name: 'Saa 1', price: 500, duration_minutes: 60 },
    { id: 2, name: 'Siku 1', price: 2000, duration_minutes: 1440 }
];

exports.getPackages = async (req, res) => {
    try {
        const [packages] = await db.query('SELECT * FROM packages ORDER BY created_at DESC');
        res.render('admin/packages', { packages });
    } catch (err) {
        console.log('Database haipatikani kwa sasa, inatumia memory store.');
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
        console.log('Database haipo tayari, inahifadhi kwenye memory store kwa majaribio.');
        global.mockPackages.unshift({
            id: Date.now(),
            name,
            price: parseFloat(price),
            duration_minutes: parseInt(duration_minutes)
        });
        res.redirect('/admin/packages');
    }
};
`);

console.log('Package Controller imerekebishwa kwa mafanikio!');
