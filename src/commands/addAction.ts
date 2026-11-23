import { ActionRowBuilder, ComponentType, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import { Command } from '../types';

export const command: Command = {
    data: new SlashCommandBuilder().setName('add-action').setDescription('Ajoute une action !'),
    async execute(interaction) {
        const typeSelect = new StringSelectMenuBuilder()
            .setCustomId('typeSelect')
            .setPlaceholder('Sélectionnez une option')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Option 1')
                    .setValue('option1'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Option 2')
                    .setValue('option2')
            );
        
        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(typeSelect);
        
        const response = await interaction.reply({
            content: 'Choisissez une option !',
            components: [row],
            ephemeral: true,
            withResponse: true
        });

        const collectorFilter = (i : any) => i.user.id === interaction.user.id;

        try {
            const message = response.resource?.message;
            if (!message) throw new Error('Interaction response message is unavailable');

            const confirmation = await message.awaitMessageComponent({ componentType: ComponentType.StringSelect, filter: collectorFilter, time: 60_000 });
            
            await interaction.editReply({ content: `Vous avez sélectionné : ${confirmation.values[0]}`, components: [], ephemeral: true });
            
        } catch {
            await interaction.editReply({ content: 'Confirmation non reçue dans 1 minute, annulation', components: [], ephemeral: true });
        }
    },
};

