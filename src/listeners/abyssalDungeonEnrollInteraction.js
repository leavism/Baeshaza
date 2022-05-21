const { Listener } = require('@sapphire/framework');
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js');
const data = require('./data/abyssal_dungeon.json');

class abyssalDungeonEnrollInsteractionListener extends Listener {
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

            dps = dps.replaceAll(`${interaction.user}`, '');
            support = support.replaceAll(`${interaction.user}`, '');
            // if (dps === '\u200b') dps = '\u200b';
            fields[2].value = dps;
            fields[3].value = support;

            partyEmbed
                .setFields(fields);

            return await interaction.update(
                {  
                    embeds: [partyEmbed],
                    components: [this.buildEnrollSelector()]
                }
            );
        }

        return await interaction.update(
            {  
                embeds: [partyEmbed],
                components: [this.buildEnrollSelector(), this.buildClassSelector(interaction.customId)]
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

    buildEnrollSelector(dpsDisabled = false, supportDisabled = false, leaveDisabled = true, tentativeDisbaled = true){
        return new MessageActionRow()
            .addComponents([
                new MessageButton()
                    .setCustomId('abyssal-dps')
                    .setLabel('DPS')
                    .setStyle('PRIMARY')
                    .setDisabled(dpsDisabled),
                new MessageButton()
                    .setCustomId('abyssal-support')
                    .setLabel('Support')
                    .setStyle('PRIMARY')
                    .setDisabled(supportDisabled),
                new MessageButton()
                    .setCustomId('abyssal-leave')
                    .setLabel('Leave')
                    .setStyle('SECONDARY')
                    .setDisabled(leaveDisabled),
                new MessageButton()
                    .setCustomId('abyssal-tentative')
                    .setLabel('Tentative')
                    .setStyle('SECONDARY')
                    .setDisabled(tentativeDisbaled)
            ]);
    }
}

exports.abyssalDungeonEnrollInsteractionListener = abyssalDungeonEnrollInsteractionListener;
