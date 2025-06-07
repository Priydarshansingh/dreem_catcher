import { EmbedBuilder } from 'discord.js';
import { getLeaderboard } from '../utils/database.js';

export default {
    data: {
        name: 'leaderboard',
        description: 'View the top Dream Hunters',
        aliases: ['lb', 'top'],
        cooldown: 10
    },
    async execute(message, args) {
        const type = args[0]?.toLowerCase() || 'nox';
        
        if (!['nox', 'vex', 'level'].includes(type)) {
            return message.reply('❌ Invalid leaderboard type! Use: `nox`, `vex`, or `level`');
        }
        
        const leaderboard = await getLeaderboard(type, 10);
        
        if (leaderboard.length === 0) {
            const embed = new EmbedBuilder()
                .setColor(0x808080)
                .setTitle('📊 Empty Leaderboard')
                .setDescription('No data available yet. Start hunting dreams!')
                .setFooter({ text: 'Be the first Dream Hunter on the leaderboard!' });
                
            return message.reply({ embeds: [embed] });
        }
        
        const emoji = {
            nox: '🌟',
            vex: '💎',
            level: '💫'
        };
        
        const description = leaderboard.map((user, index) => {
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
            const username = user.username || 'Unknown Hunter';
            const value = user[type].toLocaleString();
            
            return `${medal} **${username}** - ${value} ${emoji[type]}`;
        }).join('\n');
        
        const embed = new EmbedBuilder()
            .setColor(0xFFD700)
            .setTitle(`📊 ${type.charAt(0).toUpperCase() + type.slice(1)} Leaderboard`)
            .setDescription(description)
            .setFooter({ text: 'Keep hunting to climb the ranks!' })
            .setTimestamp();
        
        await message.reply({ embeds: [embed] });
    }
};