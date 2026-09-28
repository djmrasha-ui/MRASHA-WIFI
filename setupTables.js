const db = require('./config/db');

async function createTables() {
    try {
        console.log('Inatengeneza meza za Database...');

        // 1. Table ya Packages
        await db.query(`
            CREATE TABLE IF NOT EXISTS packages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(50) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                duration_minutes INT NOT NULL,
                upload_limit_mbps INT DEFAULT 2,
                download_limit_mbps INT DEFAULT 5,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 2. Table ya Vouchers
        await db.query(`
            CREATE TABLE IF NOT EXISTS vouchers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                code VARCHAR(20) NOT NULL UNIQUE,
                package_id INT NOT NULL,
                is_used BOOLEAN DEFAULT FALSE,
                used_by_mac VARCHAR(50) NULL,
                expires_at DATETIME NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
            )
        `);

        console.log('✅ Meza za Packages na Vouchers zimetengenezwa kikamilifu!');
    } catch (err) {
        console.error('❌ Tatizo la kutengeneza meza:', err.message);
    } finally {
        process.exit();
    }
}

createTables();
