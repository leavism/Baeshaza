const { PieceContext } = require('@sapphire/framework');
const { ScheduledTask } = require('@sapphire/plugin-scheduled-tasks');

class ManualTask extends ScheduledTask {
    constructor(context = PieceContext) {
        super(context, 
            {
                name: 'updatePing'
            }
        );
    }

    async run(payload) {
        this.container.logger.info(payload);
    }
}

exports.manual = ManualTask;