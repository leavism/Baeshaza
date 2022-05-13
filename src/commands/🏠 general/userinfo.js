const { SubCommandPluginCommand } = require('@sapphire/plugin-subcommands');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

class userinfoCommand extends SubCommandPluginCommand {
    constructor(context, options) {
        super(context, {
            ...options,
            description: 'Get basic info. on a Discord user.'
        });
    }

    registerApplicationCommands(registry) {
        const builder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addUserOption(option => option.setName('user').setDescription('The target user').setRequired(false));
        registry.registerChatInputCommand(builder);

    }

    async chatInputRun(interaction) {
        const target = interaction.options.getMember('user') ? interaction.options.getMember('user') : interaction.member;
        await interaction.reply({
            embeds: [await this.constructUserinfoEmbed(target)],
        });
    }

    async constructUserinfoEmbed(memberObj) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const createdDaysAgo = `(${Math.round(
            (new Date() - memberObj.user.createdAt) / (24 * 60 * 60 * 1000)
        )} days ago)`;
        const joinedDaysAgo = `(${Math.round(
            (new Date() - memberObj.joinedAt) / (24 * 60 * 60 * 1000)
        )} days ago)`;
        const roles =
            memberObj.roles.cache.size === 1
                ? 'No roles :('
                : Array.from(memberObj.roles.cache.values())
                    .filter((m) => m.name !== '@everyone')
                    .join(' ');
        const sortedMembers = memberObj.guild.members.cache
            .sort(this.compareJoinedAt)
            .map((m) => m.user);

        return new MessageEmbed()
            .setAuthor({
                name: `${memberObj.user.tag} ${memberObj.nickname ? `(${memberObj.nickname})` : ''
                }`,
            })
            .setThumbnail(memberObj.user.displayAvatarURL())
            .setDescription(`${memberObj.user}`)
            .setColor(memberObj.displayHexColor)
            .addField(
                'Joined Discord on',
                `${memberObj.user.createdAt.toLocaleDateString(
                    'en-US',
                    options
                )}\n${createdDaysAgo}`,
                true
            )
            .addField(
                `Joined ${memberObj.guild} on`,
                `${memberObj.joinedAt.toLocaleDateString(
                    'en-US',
                    options
                )}\n${joinedDaysAgo}`,
                true
            )
            .addField('Roles', roles, false)
            .setFooter({
                text: `Member #${sortedMembers.indexOf(memberObj.user) + 1
                } | User ID: ${memberObj.id}`,
            });
    }

    compareJoinedAt(firstMember, secondMember) {
        if (firstMember.joinedAt > secondMember.joinedAt) return 1;
        else if (firstMember.joinedAt < secondMember.joinedAt) return -1;
        return 0;
    }
}

exports.userinfoCommand = userinfoCommand;
