import {Client, GatewayIntentBits} from 'discord.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

const XDModal = "MTM2MDA1MjA3MDExNTQ0Njg4NA.GMegnx.7_cEMtFvc2Lq_878NEY8qcNg603cj6mOr_6z04";
const CHANNEL_ID = "1131666782277599233";

client.once('ready', () => {
  console.log(`Bot conectado como ${client.user.tag}`);
});

client.login(XDModal).then(() => {
  console.log('Bot conectado correctamente.');
}).catch(err => {
  console.error('Error al conectar el bot:', err);
});

async function enviarResultado(mensaje) {
  const canal = await client.channels.fetch(CHANNEL_ID);
  await canal.send(mensaje);
}

export {enviarResultado};