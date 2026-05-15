const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());

// Public Key dari tab General Information di Developer Portal
const PUBLIC_KEY = d9b7812af83dd8cf787b0232cf7e3bf41459a745842249956e28bbafe07cf337 ;

// Middleware verifikasi signature dari Discord
function verifyKey(body, signature, timestamp, publicKey) {
    const msg = Buffer.from(timestamp + body);
    const sig = Buffer.from(signature, 'hex');
    const key = Buffer.from(publicKey, 'hex');

    return crypto.verify(null, msg, key, sig);
}

// Route khusus untuk interaksi Discord
app.post('/api/interactions', (req, res) => {
    const signature = req.get('X-Signature-Ed25519');
    const timestamp = req.get('X-Signature-Timestamp');
    const body = JSON.stringify(req.body);

    if (!verifyKey(body, signature, timestamp, PUBLIC_KEY)) {
        return res.status(401).send('Invalid request signature');
    }

    const interaction = req.body;

    // Type 1 = Ping → balas Pong
    if (interaction.type === 1) {
        return res.json({ type: 1 });
    }

    // Type 2 = Slash command
    if (interaction.type === 2) {
        if (interaction.data.name === 'halo') {
            return res.json({
                type: 4,
                data: { content: 'Halo BJ, bot AI siap membantu! 🤖' }
            });
        }
        if (interaction.data.name === 'ai') {
            return res.json({
                type: 4,
                data: { content: 'Ini jawaban dari AI endpoint Express.js 🚀' }
            });
        }
    }

    res.sendStatus(400);
});

// Jalankan server
app.listen(3000, () => {
    console.log('Server berjalan di port 3000');
});
