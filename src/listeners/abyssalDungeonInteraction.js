const { lfgInteractionListener } = require('./lfgInteraction');
const { MessageActionRow, MessageButton } = require('discord.js');
const data = require('./data/abyssal_dungeon.json');

class abyssalDungeonInteractionListener extends lfgInteractionListener {
    constructor(context, options = {}) {
        super(context, {
            ...options,
            event: 'interactionCreate',
            once: false
        });
    }

    async run(interaction) {
        if (interaction.customId !== 'select-lfg-create-abyssal-dungeon') return;

        const dungeon = data.dungeons.find(({ menu_value }) => menu_value == interaction.values[0]);
        const partyEmbed = interaction.message.embeds[0];
        let fields = partyEmbed.fields;

        fields[1].value = `**0 / ${dungeon.max_members}**`;
        
        partyEmbed
            .setTitle(`${dungeon.label}`)
            .setDescription(`${interaction.message.embeds[0].description}\n${dungeon.description}`)
            .setImage(`${dungeon.url}`)
            .setFields(fields);

        return await interaction.update(
            {
                embeds: [partyEmbed],
                components: [this.buildEnrollButtons()]
            }
        );
    }
}

exports.abyssalDungeonInteractionListener = abyssalDungeonInteractionListener;
