const { Listener } = require('@sapphire/framework');
const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

class helpInteractionListener extends Listener {
    constructor(context, options = {}) {
        super(context, {
            ...options,
            event: 'interactionCreate'
        });
    }

    async run(interaction) {
        if (!interaction.isButton()) return;
        if (interaction.message.interaction.commandName !== 'help') return;
        
        const help = await this.container.client.buildHelp();

        const content = await this.buildCategory(help, interaction.customId);
        return await interaction.reply({content: content.join(''), ephemeral: true});

    }

    async buildCategory (helpObj, category) {
        const helpMessage = [];
        helpMessage.push(`${category.titleCase()} Commands:`, '```asciidoc\n');
        
        const commands = helpObj[category];
        for (let commandIndex = 0; commandIndex < commands.length; commandIndex++){
            helpMessage.push(`• /${commands[commandIndex].name} :: ${commands[commandIndex].description}\n`);
        }

        helpMessage.push('```');
        return helpMessage;
    }
}

exports.helpInteractionListener = helpInteractionListener;
