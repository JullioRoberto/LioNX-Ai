// Import library discord.js
const { Client, GatewayIntentBits, Collection } = require('discord.js');
require('dotenv').config();

// Buat client bot
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,            // untuk slash commands
        GatewayIntentBits.GuildMessages,     // untuk pesan di server
        GatewayIntentBits.MessageContent     // untuk baca isi pesan (butuh intent aktif di Developer Portal)
    ]
});

// Koleksi command
client.commands = new Collection();

// Event ketika bot siap
client.once('ready', () => {
    console.log(`✅ Bot siap sebagai ${client.user.tag}`);
});

// Event ketika ada interaction (slash command)
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'ping') {
        await interaction.reply('🏓 Pong!');
    }

    if (commandName === 'halo') {
        await interaction.reply(`Halo BJ 👋, bot AI siap membantu!`);
    }

    if (commandName === 'ai') {
        await interaction.reply(`🤖 Ini jawaban dari AI bot Express.js + Discord.js`);
    }
});

// Login bot dengan token dari .env
client.login(process.env.DISCORD_TOKEN);
