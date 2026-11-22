import 'dotenv/config';
import path from 'node:path';
import { getCommandFilesData } from './utils/utils';
import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import { Command } from './types';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection<string, Command>();

// Charge dynamiquement toutes les commandes compilees dans dist/commands.
const {commandsPath, commandFiles} = getCommandFilesData();

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const { command } = require(filePath) as { command: Command };
  client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Connecte en tant que ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    const reply = { content: "Une erreur est survenue lors de l'execution de cette commande.", ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(reply);
    } else {
      await interaction.reply(reply);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);