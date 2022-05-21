const { Listener } = require('@sapphire/framework');
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js');
const data = require('./data/abyssal_dungeon.json');

class abyssalDungeonClassInteractionListener extends Listener {
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
            fields[2].value += `${interaction.user}`;
        } else if (selectedClass.value == 'support') {
            fields[3].value += `${interaction.user}`;
        }
        partyEmbed.setFields(fields);

        return await interaction.update(
            {
                embeds: [partyEmbed],
                components: [this.buildEnrollSelector()]
            }
        );
    }

    buildEnrollSelector(){
        return new MessageActionRow()
            .addComponents([
                new MessageButton()
                    .setCustomId('abyssal-dps')
                    .setLabel('DPS')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('abyssal-support')
                    .setLabel('Support')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('abyssal-leave')
                    .setLabel('Leave')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId('abyssal-tentative')
                    .setLabel('Tentative')
                    .setStyle('SECONDARY')
            ]);
    }
}

exports.abyssalDungeonClassInteractionListener = abyssalDungeonClassInteractionListener;
