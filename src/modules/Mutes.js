module.exports = class muteManager {
    constructor(client) {
        this.client = client;
    }

    async start() {
        const mutes = await this.client.database.ref(`RedeLegit/mutados/`).once('value').then(d => d.val() || {});
        
        const guild = this.client.guilds.cache.get('564398372161585162');
        
        const role = guild.roles.cache.find(r => r.name === 'Silenciado');
        
        for(const [key, value] of Object.entries(mutes)) {
            if(Date.now() >= value.endAt) {
                const member = guild.members.cache.get(key);
                
                if(member) member.roles.remove([role.id], 'Usuário desmutado automaticamente')
            } else {
                const member = guild.members.cache.get(key);
                
                this.client.mutes.set(key, setTimeout(() => {
                    member.roles.remove([role.id], 'Usuário desmutado automaticamente');
                    
                    this.client.mutes.delete(key);
                    
                }, value.endAt - Date.now()))
            }
        }
    }
}