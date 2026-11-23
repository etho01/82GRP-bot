import { ActionRowBuilder, ComponentType, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import { Command } from '../types';

export const command: Command = {
    data: new SlashCommandBuilder().setName('add-action').setDescription('Ajoute une action !'),
    async execute(interaction) {
        // Premier select
        const firstSelect = new StringSelectMenuBuilder()
            .setCustomId('firstSelect')
            .setPlaceholder('Sélectionnez une catégorie')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Catégorie 1')
                    .setValue('category1'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Catégorie 2')
                    .setValue('category2')
            );
        
        const row1 = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(firstSelect);
        
        const response = await interaction.reply({
            content: 'Choisissez une catégorie !',
            components: [row1],
            ephemeral: true,
            withResponse: true
        });

        const collectorFilter = (i: any) => i.user.id === interaction.user.id;

        try {
            const message = response.resource?.message;
            if (!message) throw new Error('Interaction response message is unavailable');

            // Écouter le premier select
            const firstConfirmation = await message.awaitMessageComponent({ 
                componentType: ComponentType.StringSelect, 
                filter: collectorFilter, 
                time: 60_000 
            });

            // Repousser la réponse pour éviter le timeout Discord
            await firstConfirmation.deferUpdate();

            const selectedCategory = firstConfirmation.values[0];
            
            // Créer le deuxième select en fonction du premier choix
            const secondSelect = new StringSelectMenuBuilder()
                .setCustomId('secondSelect')
                .setPlaceholder('Sélectionnez une action');

            if (selectedCategory === 'category1') {
                secondSelect.addOptions(
                    new StringSelectMenuOptionBuilder().setLabel('Action 1A').setValue('action1a'),
                    new StringSelectMenuOptionBuilder().setLabel('Action 1B').setValue('action1b')
                );
            } else if (selectedCategory === 'category2') {
                secondSelect.addOptions(
                    new StringSelectMenuOptionBuilder().setLabel('Action 2A').setValue('action2a'),
                    new StringSelectMenuOptionBuilder().setLabel('Action 2B').setValue('action2b'),
                    new StringSelectMenuOptionBuilder().setLabel('Action 2C').setValue('action2c')
                );
            }

            const row2 = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(secondSelect);

            // Mettre à jour avec le deuxième select
            await interaction.editReply({
                content: `Vous avez sélectionné : ${selectedCategory}\n\nMaintenant, choisissez une action :`,
                components: [row2]
            });

            // Écouter le deuxième select
            const secondConfirmation = await message.awaitMessageComponent({ 
                componentType: ComponentType.StringSelect, 
                filter: collectorFilter, 
                time: 60_000 
            });

            // Repousser la réponse pour éviter le timeout Discord
            await secondConfirmation.deferUpdate();

            const selectedAction = secondConfirmation.values[0];

            // Résultat final
            await interaction.editReply({ 
                content: `✅ Catégorie : ${selectedCategory}\n✅ Action : ${selectedAction}`, 
                components: [] 
            });
            
        } catch (error) {
            await interaction.editReply({ 
                content: 'Confirmation non reçue dans 1 minute, annulation', 
                components: [], 
            });
        }
    },
};
