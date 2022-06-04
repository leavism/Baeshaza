const { ScheduledTask } = require('@sapphire/plugin-scheduled-tasks');

class ReminderTask extends ScheduledTask {
    async run(payload) {
        console.log("Ran reminder");
        const user = await this.container.client.users.fetch(payload);

        if (user) {
            await user.send('This is a reminder.');
        }
    }

    async onLoad()
    {
        console.log("Loaded reminder task");
        return;
    }
}

exports.ReminderTask = ReminderTask;