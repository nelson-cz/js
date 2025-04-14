import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';

// Initialize dotenv
dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const TOKEN = process.env.DISCORD_TOKEN || '';
const CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;

if (!TOKEN) {
    console.error('Error: DISCORD_TOKEN environment variable is not set');
    process.exit(1);
}

if (!CHANNEL_ID) {
    console.error('Error: DISCORD_CHANNEL_ID environment variable is not set');
    process.exit(1);
}

client.once('ready', () => {
  console.log(`Bot conectado como ${client.user.tag}`);
});

client.login(TOKEN).then(() => {
  console.log('Bot conectado correctamente.');
}).catch(err => {
  console.error('Error al conectar el bot:', err);
});

export async function enviarResultado(mensaje) {
  const canal = await client.channels.fetch(CHANNEL_ID);
  await canal.send(mensaje);
}