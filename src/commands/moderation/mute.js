const { Command } = require('../../client/index');

const ms = require('ms');

module.exports = class MuteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'mute',
            description: 'Mute um usuário',
            permissions: ['send_messages'],
            required_roles: ['ajudante'],
            options: [{
                name: 'user',
                type: 6,
                description: 'Usuário a ser mutado',
                required: true
            }, {
               name: 'duração',
                type: 3,
                description: 'Duração do mute',
                required: true
            }, {
                name: 'motivo',
                type: 3,
                description: 'Motivo do mute',
                required: true
            }, {
                name: 'prova',
                type: 6,
                description: 'Prova do mute',
                required: false
            }]
        })
    }

    async run({ message, args }) {
        const member = message.options.getMember('user');
        
        if(member.roles.cache.has('876917665925562418')) return message.reply({
            content: 'Você não pode mutar um membro da equipe!',
            ephemeral: true
        })// Equipe Role
        
        const tempo = message.options.getString('duração');
        
        const time = ms(tempo);
        
        if(!time || time < 0) return message.reply({
            content: 'Este tempo é inválido!',
            ephemeral: true
        });
        
        const motivo = message.options.getString('motivo');
        
        const prova = message.options.getString('prova') || 'Motivo não inserido';
        
        const muteRole = message.guild.roles.cache.find(r => r.name === 'Silenciado') || await message.guild.roles.create({
            name: 'Silenciado'
        }).then(r => {
            message.guild.channels.cache.forEach(channel => channel.permissionOverwrites.create(r.id, {
                SEND_MESSAGES: false
            }));
            
            return r
        });
        
        if(member.roles.cache.has(muteRole.id)) return message.reply({
            content: 'Este usuário já está mutado!',
            ephemeral: true
        });
        
        member.roles.add([muteRole.id], `Usuário mutado por ${message.user.tag} - Motivo: ${motivo}`).then(() => {
            message.reply({
                content: 'Usuário mutado com sucesso.',
                ephemeral: true
            });
            
            this.client.database.ref(`RedeLegit/mutados/${member.id}`).set({
                endAt: Date.now() + Number(time)
            });
            
            this.client.mutes.set(member.id, setTimeout(() => {
                member.roles.remove([muteRole.id], 'Usuário desmutado automaticamente.');
                
                this.client.mutes.delete(member.id)
            }, time));
            
        }).catch(() => {
            message.reply({
                content: 'Ocorreu um erro ao mutar o usuário',
                ephemeral: true
            })
        })
    }
}