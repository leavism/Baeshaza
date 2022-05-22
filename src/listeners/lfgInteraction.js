const { Listener } = require('@sapphire/framework');
const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');
const data = require('./data/abyssal_dungeon.json');

class lfgInteractionListener extends Listener {
    constructor(context, options = {}) {
        super(context, {
            ...options,
            event: 'interactionCreate',
            once: false
        });
    }

    async run(interaction) {
        if (interaction.customId !== 'select-lfg-create') return;

        const { values } = interaction;
        const partyEmbed = interaction.message.embeds[0]
            .setTitle('Let\'s party!')
            .setDescription(`${interaction.message.embeds[0].description}`); 

        const instructionEmbed = new MessageEmbed()
            .setTitle('Which Abyssal Dungeon?')
            .setDescription('Choose which Abyssal Dungeon the party is running.');  


        switch (values[0]) {
        case 'lfg-create-abyssal-dungeon':
            return await interaction.update(
                {
                    embeds: [partyEmbed, instructionEmbed],
                    components: [this.buildAbyssalDungeonSelector()]
                }
            );
        }
    }

    buildAbyssalDungeonSelector() {
        let abyssalDungeonsMenuItems = [];
        data.dungeons.forEach(dungeon => {
            abyssalDungeonsMenuItems.push(
                { 
                    label: dungeon.label,
                    description: dungeon.menu_description,
                    value: dungeon.menu_value
                }
            );
        });

        return new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('select-lfg-create-abyssal-dungeon')
                    .setPlaceholder('Nothing selected')
                    .addOptions(abyssalDungeonsMenuItems),
            );
    }
    // If you add another button, remember to add it in the validId in abyssalDungeonEnrollmentInteraction
    buildEnrollButtons(dpsDisabled = false, supportDisabled = false, leaveDisabled = false, tentativeDisbaled = false){
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

exports.lfgInteractionListener = lfgInteractionListener;
