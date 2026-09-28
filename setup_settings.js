const db = require('./config/db');
async function run() {
  try {
    await db.query('DROP TABLE IF EXISTS portal_settings');
    await db.query('CREATE TABLE portal_settings (id INT AUTO_INCREMENT PRIMARY KEY, site_title VARCHAR(100) DEFAULT "WiFi POWER", site_subtitle VARCHAR(255) DEFAULT "Choose a package", primary_color VARCHAR(20) DEFAULT "#1d4ed8", support_phone VARCHAR(20) DEFAULT "255700000000")');
    await db.query('INSERT INTO portal_settings (site_title, site_subtitle, primary_color, support_phone) VALUES ("WiFi POWER", "Choose a package", "#1d4ed8", "255700000000")');
    console.log('SETTINGS TABLE CREATED SUCCESSFUL');
  } catch (err) {
    console.error('DATABASE ERROR:', err);
  } finally {
    process.exit();
  }
}
run();
