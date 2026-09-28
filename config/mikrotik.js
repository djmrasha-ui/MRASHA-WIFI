
const { RouterOSAPI } = require('node-routeros');

async function addHotspotUser(username, profileName = 'default', limitBytesTotal = 0) {
    const conn = new RouterOSAPI({
        host: process.env.MIKROTIK_HOST || '192.168.88.1',
        user: process.env.MIKROTIK_USER || 'admin',
        password: process.env.MIKROTIK_PASSWORD || '',
        port: parseInt(process.env.MIKROTIK_PORT || '8728'),
        timeout: 5
    });

    try {
        await conn.connect();
        
        const existingUsers = await conn.write('/ip/hotspot/user/print', [
            '?.name=' + username
        ]);

        if (existingUsers.length === 0) {
            await conn.write('/ip/hotspot/user/add', [
                '=name=' + username,
                '=password=' + username,
                '=profile=' + profileName
            ]);
            console.log('Mtumiaji wa MikroTik ' + username + ' ametengenezwa kikamilifu.');
        }

        await conn.close();
        return true;
    } catch (err) {
        console.error('Kosa la MikroTik:', err.message);
        return false;
    }
}

module.exports = { addHotspotUser };
