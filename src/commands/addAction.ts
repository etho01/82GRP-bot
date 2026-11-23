import { ActionRowBuilder, ChatInputCommandInteraction, CacheType, ComponentType, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, InteractionCallbackResponse } from 'discord.js';
import { Command } from '../types';
import { actionStringSelect, useStringSelect } from '../utils/componant/select';
import { ACTIONS_LIST, Action } from '../utils/const';

const showSelect = async (action: Action, interaction: ChatInputCommandInteraction<CacheType>, response?: InteractionCallbackResponse<boolean>) => {
    if (!action || !action.subActions || !action.subActions.length) 
    {
        if (!response) return;

        const selectNumber = useStringSelect(
            Array.from({ length: 10 }, (_, i) => ({ label: (i + 1).toString(), value: (i + 1).toString() })), 
            'Sélectionnez la quantité'
        );

        interaction.editReply({ 
            content: 'Sélectionnez la quantité',
            components: [selectNumber] 
        });

        actionStringSelect(interaction, response, (value) => {
            interaction.deleteReply();
        })

        return
    };

    const select = useStringSelect(action.subActions.map(sub => ({ label: sub.label, value: sub.name })), 'Sélectionnez une catégorie');

    if (!response) 
    {
        response = await interaction.reply({
            content: action.description ?? 'Sélectionnez une action',
            components: [select],
            ephemeral: true,
            withResponse: true
        });
    }
    else
    {
        interaction.editReply({ 
            content: action.description ?? 'Sélectionnez une action',
            components: [select] 
        });
    }

    actionStringSelect(interaction, response, (value) => {
        if (action && action.subActions) {
            const subAction = action.subActions.find(sub => sub.name === value);
            if (!subAction) return;
            showSelect(subAction, interaction, response);
        }
    })
}

export const command: Command = {
    data: new SlashCommandBuilder().setName('add-action').setDescription('Ajoute une action !'),
    async execute(interaction) {
        await showSelect(ACTIONS_LIST, interaction, undefined);
    },
};
