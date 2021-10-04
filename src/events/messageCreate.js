module.exports = class messageEvent {
    constructor(client) {
        this.client = client;
    }

    async run(message) {
        if (message.channel.type === 'dm') return;

        if (message.author.bot) return;

        if (['875652717769547797', '876908169346035732', '748691110796329002', '876954213442256938'].includes(message.channel.id)) {

            message.delete();

            let obj = { content: message.content, files: message.attachments.map(a => a.url) };

            if (!message.content.length) delete obj.content;

            message.channel.send({ ...obj });
        }
    }
}