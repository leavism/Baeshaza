const { SubCommandPluginCommand } = require('@sapphire/plugin-subcommands');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton, Modal, TextInputComponent, MessageSelectMenu } = require('discord.js');
const {
    getAllEventNamesOfType,
    getAllEvents,
    getAllEventsWithId,
    getAllEventsWithName,
    getAllEventsOnDate,
    getAllEventsOfType,
    filterEventsAfterTime,
    sortEventsByTime,
    getEventName,
    filterEventsOnDate
} = require('../../event_data/eventData.js');

const { months, adventureIslands } = require('../../event_data/constants.js');

class IslandCommand extends SubCommandPluginCommand {
    constructor(context, options) {
        super(context, {
            ...options,
            description: 'Adventure Islands.',
            subCommands: ['today','schedule', 'report']
        });
    }

    registerApplicationCommands(registry) {
        const builder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addSubcommand(subcommand =>
                subcommand
                    .setName('today')
                    .setDescription('Get the schedule for the adventure islands today.'))
            .addSubcommand(subcommand =>
                subcommand
                    .setName('schedule')
                    .setDescription('Find out when an adventure island will appear.'))
            .addSubcommand(subcommand =>
                subcommand
                    .setName('report')
                    .setDescription('Report a new Adventure island.'));

        registry.registerChatInputCommand(builder);
    }

    async chatInputRun(interaction) {
        const subcommand = interaction.options.getSubcommand(true);
        return this[subcommand](interaction);
    }

    async today(interaction) {
        const today = new Date();
        const [month, date, time] = [
            `${today.getMonth() + 1}`.padStart(2, '0'),
            `${today.getDate()}`.padStart(2, '0'),
            `${today.getHours()}`.padStart(2, '0') + `${today.getMinutes()}`.padStart(2, '0')
        ];
        const datetime = month + date + time;
        
        let islandTimes = getAllEventsOfType('Adventure Island');
        islandTimes = filterEventsOnDate(islandTimes, today.getMonth() + 1, today.getDate());
        islandTimes = filterEventsAfterTime(islandTimes, datetime);

        interaction.reply({
            embeds: [await this.buildTodayEmbed(islandTimes)]
        });
    }

    async schedule(interaction) {
        let islandsToday = [
            ...new Map(getAllEventsOnDate(5, 29).map((item) => [item['id'], item])).values(),
        ];
        
        const islandSelectMenuItems = this.buildIslandSelectorMenu(islandsToday);

        const modal = new Modal()
            .setCustomId('adventureisland-modal')
            .setTitle('Select which Adventure Island');
        
        const firstActionRow = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId('adventure-island-schedule')
                .setPlaceholder('Select an Adventure island')
                .addOptions(islandSelectMenuItems)
        );

        modal.addComponents(firstActionRow);
        
        return await interaction.showModal(modal);
    }

    buildIslandSelectorMenu(eventArray) {
        const islandSelectMenuItems = [];

        const islandArray = eventArray.filter(island => { 
            return adventureIslands.includes(island.name);
        });

        islandArray.forEach((island) => {
            islandSelectMenuItems.push(
                {
                    label: getEventName(island.id),
                    value: getEventName(island.id).toLowerCase().replace(' ', '_')
                }
            );
        });

        return islandSelectMenuItems;
    }

    async buildTodayEmbed(eventCollection) {
        const today = new Date();
        const outputIslands = [...new Set(eventCollection.map(laEvent => laEvent.name))];

        let outputTimes = [...new Set(eventCollection.map(laEvent => laEvent.time))];
        outputTimes = outputTimes.map((time) => {
            let date = new Date();
            date.setHours(Number(time.slice(0,2)), Number(time.slice(3,5)));
            return `<t:${this.toEpoch(date)}:t>`;
        });

        const todayEmbed = new MessageEmbed()
            .setAuthor({
                name: `${this.container.client.user.tag}`,
                iconURL: `${this.container.client.user.avatarURL()}`
            })
            .setDescription('Here are the Adventure islands and the remaining times they\'ll appear today.')
            .setFooter({
                text: 'Most of the date is drawn from lostarktimer.com.'
            })
            .addField(
                'Adventure Islands',
                `${outputIslands.join('\n')}`,
                true
            )
            .addField(
                'Remaining Times',
                `${outputTimes.join('\n')}`,
                true
            );
        return todayEmbed;
    }

    toEpoch(date) {
        return Date.parse(date) / 1000;
    }

}

exports.IslandCommand = IslandCommand;
