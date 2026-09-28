const db = require('./config/db');

async function seed() {
    try {
        await db.query(`
            INSERT INTO packages (name, price, duration_minutes, upload_limit_mbps, download_limit_mbps)
            VALUES 
            ('Saa 1 (1 Hour)', 500.00, 60, 2, 5),
            ('Siku 1 (24 Hours)', 2000.00, 1440, 3, 10),
            ('Wiki 1 (7 Days)', 10000.00, 10080, 5, 15)
            ON DUPLICATE KEY UPDATE id=id;
        `);
        console.log('Vifurushi vya mwanzo vimeingizwa kikamilifu!');
        process.exit();
    } catch (err) {
        console.error('Kosa la kuingiza vifurushi:', err.message);
        process.exit(1);
    }
}

seed();
