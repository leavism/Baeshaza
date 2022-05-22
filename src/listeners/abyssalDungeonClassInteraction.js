const { lfgInteractionListener } = require('./lfgInteraction');
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js');
const data = require('./data/abyssal_dungeon.json');

class abyssalDungeonClassInteractionListener extends lfgInteractionListener {
    constructor(context, options = {}) {
        super(context, {
            ...options,
            event: 'interactionCreate',
            once: false
        });
    }

    async run(interaction) {
        if (!interaction.isSelectMenu()) return;
        const advancedClasses = [...new Set(data.classes.map(item => item.label.toLowerCase()))];
        if (!advancedClasses.includes(interaction.values[0])) return;

        const selectedClass = data.classes.find(({ label }) => label.toLowerCase() == interaction.values[0]);
        const partyEmbed = interaction.message.embeds[0];
        let fields = partyEmbed.fields;
        
        if (selectedClass.value == 'dps') {
            fields[2].value += `${selectedClass.emoji}${interaction.user}`;
        } else if (selectedClass.value == 'support') {
            fields[3].value += `${selectedClass.emoji}${interaction.user}`;
        }
        partyEmbed.setFields(fields);

        return await interaction.update(
            {
                embeds: [partyEmbed],
                components: [this.buildEnrollButtons()]
            }
        );
    }
}

exports.abyssalDungeonClassInteractionListener = abyssalDungeonClassInteractionListener;
