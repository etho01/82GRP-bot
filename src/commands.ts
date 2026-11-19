import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { REST, Routes } from 'discord.js';
import { Command } from './types';

const commands: unknown[] = [];

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const { command } = require(filePath) as { command: Command };
  commands.push(command.data.toJSON());
}

const token = process.env.DISCORD_TOKEN as string;
const clientId = process.env.CLIENT_ID as string;
const guildId = process.env.GUILD_ID;

const rest = new REST().setToken(token);

(async () => {
  try {
    console.log(`Enregistrement de ${commands.length} commande(s) slash.`);

    // Si GUILD_ID est defini, les commandes sont enregistrees sur ce serveur
    // uniquement (mise a jour instantanee, ideal pour le developpement).
    // Sinon elles sont enregistrees globalement (propagation jusqu'a 1h).
    const route = guildId
      ? Routes.applicationGuildCommands(clientId, guildId)
      : Routes.applicationCommands(clientId);

    const data = (await rest.put(route, { body: commands })) as unknown[];

    console.log(`${data.length} commande(s) slash enregistree(s) avec succes.`);
  } catch (error) {
    console.error(error);
  }
})();
