import { StringSelectMenuBuilder, ActionRowBuilder } from 'discord.js';
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