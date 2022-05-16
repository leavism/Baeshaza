const { Listener } = require('@sapphire/framework');
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');


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
        return new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('select-lfg-create-abyssal-dungeon')
                    .setPlaceholder('Nothing selected')
                    .addOptions([
                        {
                            label: 'Normal Oreha\'s Well',
                            description: 'I hate Seto',
                            value: 'normal_orehas_well',
                        },
                        {
                            label: 'Hard Oreha\'s Well',
                            description: 'I hate Seto',
                            value: 'hard_orehas_well',
                        },
                        {
                            label: 'Ark of Arrogance',
                            description: 'Eww orbs?',
                            value: 'ark_of_arrogance',
                        },
                    ]),
            );
    }
}

exports.lfgInteractionListener = lfgInteractionListener;
