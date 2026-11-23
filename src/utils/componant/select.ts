import { StringSelectMenuBuilder, ActionRowBuilder, ComponentType, ChatInputCommandInteraction, InteractionCallbackResponse, CacheType } from 'discord.js';
import crypto from 'node:crypto';

type StringSelectOption = {
    label: string;
    value: string;
};

const useStringSelect = (values: StringSelectOption[], placeholder: string, customId?: string) => {
    if (!customId)
    {
        customId = crypto.randomUUID();
    }

    const select = new StringSelectMenuBuilder()
        .setCustomId(customId)
        .setPlaceholder(placeholder)
        .addOptions(
            ...values.map(({ label, value }) => ({ label, value }))
        );
    
    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);
    return row;
}

const actionStringSelect = async (interaction: ChatInputCommandInteraction<CacheType>, response: InteractionCallbackResponse<boolean>, callback: (selectedValue: string) => void) => {
    const collectorFilter = (i: any) => i.user.id === interaction.user.id;

    try {
    const message = response.resource?.message;
    if (!message) throw new Error('Interaction response message is unavailable');

    const confirmation = await message.awaitMessageComponent({ 
        componentType: ComponentType.StringSelect, 
        filter: collectorFilter, 
        time: 60_000 
    });

    await confirmation.deferUpdate();

    const selectedValue = confirmation.values[0];
    callback(selectedValue);
    } catch (error) {
        await interaction.editReply({ 
            content: 'Confirmation non reçue dans 1 minute, annulation', 
            components: [], 
        });
    }
}

export { useStringSelect, actionStringSelect };