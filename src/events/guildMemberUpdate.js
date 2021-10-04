module.exports = class guildMemberUpdateEvent {
    constructor(client) {
        this.client = client;
    }

    async run(oldMember, newMember) {
        if (oldMember.guild.id === process.env.PRINCIPAL_SERVER) {
            const servers = this.client.guilds.cache.filter(s => s.members.cache.has(oldMember.id) && s.id !== oldMember.guild.id).map(s => s);

            for (const server of servers) {

                const m = server.members.cache.get(oldMember.id);

                const addRoles = newMember.roles.cache.map(r => server.roles.cache.find(role => role.name.toLowerCase() === r.name.toLowerCase())).filter(r => r && r.hoist && !m.roles.cache.has(r.id));

                const removeRoles = oldMember.roles.cache.filter(r => !newMember.roles.cache.has(r.id)).map(r => server.roles.cache.find(role => role.name.toLowerCase() === r.name.toLowerCase())).filter(r => r && r.hoist && m.roles.cache.has(r.id));

                await m.roles.remove(removeRoles, 'Sincronização automática de cargos.').catch(() => true);

                await m.roles.add(addRoles, 'Sincronização automática de cargos.').catch(() => true);
            }
        }
    }
}