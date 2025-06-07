import { EmbedBuilder } from 'discord.js';
import { getUser, updateUser, logActivity } from '../utils/database.js';

export default {
    data: {
        name: 'sleep',
        description: 'Claim your daily rewards by sleeping',
        aliases: ['daily'],
        cooldown: 5
    },
    async execute(message, args) {
        const user = await getUser(message.author.id);
        const now = new Date();
        const lastDaily = user.last_daily ? new Date(user.last_daily) : null;
        
        // Check if 24 hours have passed
        if (lastDaily && (now - lastDaily) < 24 * 60 * 60 * 1000) {
            const timeLeft = 24 * 60 * 60 * 1000 - (now - lastDaily);
            const hours = Math.floor(timeLeft / (60 * 60 * 1000));
            const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
            
            const embed = new EmbedBuilder()
                .setColor(0xFF6B6B)
                .setTitle('😴 Still Tired...')
                .setDescription(`You need to wait **${hours}h ${minutes}m** before you can sleep again!`)
                .setFooter({ text: 'Daily rewards reset every 24 hours' });
                
            return message.reply({ embeds: [embed] });
        }
        
        // Generate rewards
        const noxReward = Math.floor(Math.random() * 51) + 50; // 50-100 Nox
        const vexChance = Math.random() < 0.1; // 10% chance
        const vexReward = vexChance ? 1 : 0;
        
        // Update user
        await updateUser(message.author.id, {
            nox: user.nox + noxReward,
            vex: user.vex + vexReward,
            last_daily: now.toISOString()
        });
        
        await logActivity(message.author.id, 'daily_reward', noxReward);
        
        const embed = new EmbedBuilder()
            .setColor(0x9370DB)
            .setTitle('😴 Sweet Dreams!')
            .setDescription('You drift off to sleep and enter the dream realm...')
            .addFields(
                { name: '🌟 Nox Gained', value: `+${noxReward}`, inline: true },
                { name: '💎 Vex Gained', value: vexReward ? '+1 ✨' : 'None', inline: true },
                { name: '💰 New Balance', value: `${(user.nox + noxReward).toLocaleString()} Nox\n${(user.vex + vexReward).toLocaleString()} Vex`, inline: true }
            )
            .setFooter({ text: 'Come back tomorrow for more rewards!' })
            .setTimestamp();
            
        await message.reply({ embeds: [embed] });
    }
};