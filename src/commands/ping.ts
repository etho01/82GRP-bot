import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../types';

export const command: Command = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Repond avec Pong !'),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply('Pong !');
  },
};
