const { lfgInteractionListener } = require('./lfgInteraction');
const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const data = require('./data/abyssal_dungeon.json');

class abyssalDungeonEnrollInsteractionListener extends lfgInteractionListener {
    constructor(context, options = {}) {
        super(context, {
            ...options,
            event: 'interactionCreate',
            once: false
        });
    }

    async run(interaction) {
        const validId = ['abyssal-dps','abyssal-support','abyssal-leave','abyssal-tentative'];
        if(!validId.includes(interaction.customId)) return;

        let partyEmbed = interaction.message.embeds[0];

        if (interaction.customId == 'abyssal-leave') {
            let fields = partyEmbed.fields;
            let dps = fields[2].value;
            let support = fields[3].value;

            const emojiDPS = dps.substring(
                dps.indexOf('<:'),
                dps.indexOf('>') + 1);

            const emojiSupport =  support.substring(
                support.indexOf('<:'),
                support.indexOf('>') + 1);

            dps = dps.replaceAll(`${emojiDPS}${interaction.user}`, '');
            support = support.replaceAll(`${emojiSupport}${interaction.user}`, '');

            fields[2].value = dps;
            fields[3].value = support;

            partyEmbed
                .setFields(fields);

            return await interaction.update(
                {  
                    embeds: [partyEmbed],
                    components: [this.buildEnrollButtons()]
                }
            );
        }

        return await interaction.update(
            {  
                embeds: [partyEmbed],
                components: [this.buildEnrollButtons(), this.buildClassSelector(interaction.customId)]
            }
        );
    }

    buildClassSelector(type) {
        let advancedClassMenuItems = [];
        data.classes.forEach(advancedClass => {
            if (advancedClass.type == type) {
                advancedClassMenuItems.push(
                    { 
                        label: advancedClass.label,
                        description: advancedClass.description,
                        value: advancedClass.label.toLowerCase()
                    }
                );
            }
        });

        return new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('select-lfg-create-abyssal-dungeon-class')
                    .setPlaceholder('Nothing selected')
                    .addOptions(advancedClassMenuItems),
            );
    }
}

exports.abyssalDungeonEnrollInsteractionListener = abyssalDungeonEnrollInsteractionListener;
