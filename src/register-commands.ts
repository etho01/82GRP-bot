import 'dotenv/config';
import path from 'node:path';
import { REST, Routes } from 'discord.js';
import { Command } from './types';
import { getCommandFilesData } from './utils/utils';

// Charge dynamiquement toutes les commandes compilees dans dist/commands.
const {commandsPath, commandFiles} = getCommandFilesData();

const commandsData = commandFiles.map((file) => {
  const filePath = path.join(commandsPath, file);
  const { command } = require(filePath) as { command: Command };
  return command.data.toJSON();
});

const token = process.env.DISCORD_TOKEN;
const appId = process.env.APP_ID;
const guildId = process.env.GUILD_ID;

if (!token || !appId) {
  throw new Error('DISCORD_TOKEN et APP_ID sont requis.');
}

const rest = new REST().setToken(token);

(async () => {
  try {
    // Si GUILD_ID est defini, enregistre les commandes uniquement sur ce serveur (instantane, ideal en dev).
    // Sinon, enregistre les commandes globalement (peut prendre jusqu'a 1h pour se propager).
    const route = guildId ? Routes.applicationGuildCommands(appId, guildId) : Routes.applicationCommands(appId);

    const data = (await rest.put(route, { body: commandsData })) as unknown[];
    console.log(`${data.length} commande(s) slash enregistree(s).`);
  } catch (error) {
    console.error(error);
  }
})();
