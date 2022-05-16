const { SubCommandPluginCommand } = require('@sapphire/plugin-subcommands');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');

class UserCommand extends SubCommandPluginCommand {
    constructor(context, options) {
        super(context, {
            ...options,
            description: 'Hearthome custome party finder.',
            subCommands: ['create', 'edit']
        });
    }

    registerApplicationCommands(registry) {
        const builder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addSubcommand(subcommand =>
                subcommand
                    .setName('create')
                    .setDescription('Create a new party.')
                    .addIntegerOption(option =>
                        option
                            .setName('start-hour')
                            .setDescription('Set the hour the party will run from 1 to 12.')
                            .setRequired(true)
                            .setMinValue(1)
                            .setMaxValue(12)
                    )
                    .addIntegerOption(option =>
                        option
                            .setName('start-minute')
                            .setDescription('Set the hour the party will run from 1 to 59.')
                            .setRequired(true)
                            .setMinValue(1)
                            .setMaxValue(59)
                    )
                    .addStringOption(option =>
                        option
                            .setName('start-am-pm')
                            .setDescription('Set the hour the party will run from 1 to 59.')
                            .setRequired(true)
                            .addChoice('AM', 'am')
                            .addChoice('PM', 'pm')
                    )
                    .addStringOption(option =>
                        option
                            .setName('description')
                            .setDescription('Set an optional description')
                            .setRequired(false)

                    )
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName('edit')
                    .setDescription('Edit a party.'));
        registry.registerChatInputCommand(builder);
    }

    async chatInputRun(interaction) {
        const subcommand = interaction.options.getSubcommand(true);
        return this[subcommand](interaction);
    }

    async create(interaction){
        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('select-lfg-create')
                    .setPlaceholder('Nothing selected')
                    .addOptions([
                        {
                            label: 'Abyssal Dungeon',
                            description: 'Create a party for an abyssal dungeon.',
                            value: 'lfg-create-abyssal-dungeon',
                        },
                        {
                            label: 'Abyss Guardian',
                            description: 'Create a party to run an abyss guardian.',
                            value: 'lfg-create-abyss-guardian',
                        },
                    ])
            );
        
        return interaction.reply(
            {
                embeds: [this.buildPartyEmbed(interaction), this.buildInstructionEmbed(interaction)],
                components: [row]
            }
        );
    }

    async edit(interaction){
        return interaction.reply('This is edit');
    }

    toEpoch(date) {
        return Date.parse(date) / 1000;
    }

    buildPartyEmbed(interaction) {
        var date = new Date();
        var [hour, minute, ampm] = [interaction.options.getInteger('start-hour'),
            interaction.options.getInteger('start-minute'),
            interaction.options.getString('start-am-pm')];
        ampm === 'pm' ? hour = hour + 12 : hour;
        date.setHours(hour);
        date.setMinutes(minute);

        return new MessageEmbed()
            .setAuthor({
                name: `${interaction.user.tag}`,
                iconURL: `${interaction.user.avatarURL()}`
            })
            .setTitle('Let\'s party!')
            .setDescription(`${interaction.options.getString('description')}`)
            .addField('Start Time', `<t:${this.toEpoch(date)}:f>`);
    }

    buildInstructionEmbed(interaction) {
        return new MessageEmbed()
            .setAuthor({
                name: `${this.container.client.user.tag}`,
                iconURL: `${this.container.client.user.avatarURL()}`
            })
            .setTitle('Let\'s determine a few other things...')
            .setDescription('Choose what kind of party you are creating.');
    }
    
}

exports.UserCommand = UserCommand;
