const { Listener } = require('@sapphire/framework');
const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

class helpInteractionListener extends Listener {
    constructor(context, options = {}) {
        super(context, {
            ...options,
            event: 'interactionCreate',
            once: false
        });
    }

    async run(interaction) {
        const help = await this.container.client.buildHelp();
        if (interaction.message.interaction.commandName !== 'help') return;

        const content = await this.buildCategory(help, interaction.customId);
        return await interaction.reply({content: content.join(''), ephemeral: true});

    }

    async buildCategory (helpObj, category) {
        const helpMessage = [];
        helpMessage.push(`${category.titleCase()} Commands:`, '```asciidoc\n');
        
        const commands = helpObj[category];
        for (let commandIndex = 0; commandIndex < commands.length; commandIndex++){
            helpMessage.push(`• ${this.container.client.fetchPrefix()}${commands[commandIndex].name} :: ${commands[commandIndex].description}\n`);
        }

        helpMessage.push('```');
        return helpMessage;
    }
}

exports.helpInteractionListener = helpInteractionListener;
