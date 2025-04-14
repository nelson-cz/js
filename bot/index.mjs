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

let isReady = false;

client.once('ready', () => {
    console.log(`Bot conectado como ${client.user.tag}`);
    isReady = true;
});

client.login(TOKEN).catch(err => {
    console.error('Error al conectar el bot:', err);
    process.exit(1);
});

export async function enviarResultado(mensaje) {
    // Wait for client to be ready
    while (!isReady) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    try {
        const canal = await client.channels.fetch(CHANNEL_ID);
        if (!canal) {
            throw new Error('Could not find the specified channel');
        }
        await canal.send(mensaje);
        console.log('Message sent successfully');
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
}