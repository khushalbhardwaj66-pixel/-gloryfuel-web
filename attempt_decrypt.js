
import fs from 'fs';
import crypto from 'crypto';
import zlib from 'zlib';

try {
    const raw = fs.readFileSync('api_output.json', 'utf8');
    const json = JSON.parse(raw);
    const dataBase64 = json.data;
    const buffer = Buffer.from(dataBase64, 'base64');
    const keyString = 'my_seceret_key_123';

    console.log(`Buffer length: ${buffer.length} bytes`);
    console.log(`Header hex: ${buffer.slice(0, 16).toString('hex')}`);

    // Attempt 1: Zlib Decompression
    try {
        const decompressed = zlib.inflateSync(buffer);
        console.log('SUCCESS: Zlib inflated');
        console.log(decompressed.toString('utf8').substring(0, 100));
        fs.writeFileSync('decoded_final.json', decompressed);
        process.exit(0);
    } catch (e) {
        console.log('Failed Zlib inflate:', e.message);
    }

    // Attempt 2: AES-128-ECB (Common weak encryption)
    try {
        // Key padding to 16 bytes?
        let key = Buffer.alloc(16);
        key.write(keyString, 0); // truncate or pad

        const decipher = crypto.createDecipheriv('aes-128-ecb', key, null);
        decipher.setAutoPadding(false);
        let decrypted = Buffer.concat([decipher.update(buffer), decipher.final()]);
        console.log('AES-128-ECB Result start:', decrypted.toString('utf8').substring(0, 50));
    } catch (e) {
        // console.log('Failed AES-128-ECB:', e.message);
    }

    // Attempt 3: AES-256-CBC (Common secure)
    // Assuming IV is first 16 bytes
    try {
        const iv = buffer.slice(0, 16);
        const ciphertext = buffer.slice(16);

        // Key hashing?
        const key = crypto.createHash('sha256').update(keyString).digest();

        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);

        console.log('SUCCESS: AES-256-CBC');
        console.log(decrypted.toString('utf8').substring(0, 100));
        fs.writeFileSync('decoded_final.json', decrypted);
        process.exit(0);
    } catch (e) {
        console.log('Failed AES-256-CBC with hash key:', e.message);
    }

} catch (e) {
    console.error('General Error:', e.message);
}
