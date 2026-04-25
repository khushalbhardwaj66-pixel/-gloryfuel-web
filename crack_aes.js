
import fs from 'fs';
import crypto from 'crypto';

const keyString = 'my_seceret_key_123';

try {
    const raw = fs.readFileSync('encrypted_sample.bin');
    const iv = raw.slice(0, 16);
    const cipherText = raw.slice(16);

    console.log('IV:', iv.toString('hex'));

    const algos = [
        { name: 'aes-128-cbc', key: crypto.createHash('md5').update(keyString).digest() },
        { name: 'aes-256-cbc', key: crypto.createHash('sha256').update(keyString).digest() },
        { name: 'aes-128-cbc', key: Buffer.from(keyString.substring(0, 16)) }, // Raw truncate
        { name: 'aes-128-cbc', key: Buffer.concat([Buffer.from(keyString), Buffer.alloc(16)]).slice(0, 16) }, // Pad nulls
    ];

    algos.forEach(opt => {
        try {
            const decipher = crypto.createDecipheriv(opt.name, opt.key, iv);
            let decrypted = Buffer.concat([decipher.update(cipherText), decipher.final()]);
            const result = decrypted.toString('utf8');

            // Check if it looks like JSON
            if (result.trim().startsWith('{') || result.trim().startsWith('[')) {
                console.log(`\n>>> SUCCESS with ${opt.name} <<<`);
                console.log('Decrypted Start:', result.substring(0, 100));
                fs.writeFileSync('decrypted_data.json', result);
            }
        } catch (e) {
            // console.log(`Failed ${opt.name}: ${e.message}`);
        }
    });

} catch (e) {
    console.error('Error:', e.message);
}
