const { Listener } = require('@sapphire/framework');
const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageAttachment } = require('discord.js');
const data = require('../data/abyssal_dungeon.json');

class abyssalDungeonInteractionListener extends Listener {
    constructor(context, options = {}) {
        super(context, {
            ...options,
            event: 'interactionCreate',
            once: false
        });
    }

    async run(interaction) {
        if (interaction.customId !== 'select-lfg-create-abyssal-dungeon') return;

        const partyEmbed = interaction.message.embeds[0]
            .setTitle(`${data[interaction.values[0]].title}`)
            .setDescription(`${interaction.message.embeds[0].description}\n${data[interaction.values[0]].description}`)
            .setImage(`${data[interaction.values[0]].url}`);  

        return await interaction.update(
            {
                embeds: [partyEmbed],
                components: []
            }
        );
    }
}

exports.abyssalDungeonInteractionListener = abyssalDungeonInteractionListener;
