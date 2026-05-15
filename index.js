// Import library
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
require('dotenv').config(); // untuk membaca file .env

// Ambil data dari .env
const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const GUILD_ID = process.env.DISCORD_GUILD_ID;

// Buat client bot
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Daftar command
const commands = [
    {
        name: 'halo',
        description: 'Bot akan menyapa kamu!'
    },
    {
        name: 'info',
        description: 'Menampilkan informasi server'
    },
    {
        name: 'ping',
        description: 'Cek kecepatan respon bot'
    }
];

// Registrasi command ke server
const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log('Mendaftarkan command...');
        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands }
        );
        console.log('Command berhasil didaftarkan!');
    } catch (error) {
        console.error(error);
    }
})();

// Event ketika bot online
client.once('ready', () => {
    console.log(`Bot sudah online sebagai ${client.user.tag}`);
});

// Event ketika command dipanggil
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'halo') {
        await interaction.reply('Halo dari botmu! 👋');
    }

    if (interaction.commandName === 'info') {
        await interaction.reply(`Server: ${interaction.guild.name}\nAnggota: ${interaction.guild.memberCount}`);
    }

    if (interaction.commandName === 'ping') {
        await interaction.reply(`🏓 Pong! Latency: ${Date.now() - interaction.createdTimestamp}ms`);
    }
});

// Login bot
client.login(TOKEN);
