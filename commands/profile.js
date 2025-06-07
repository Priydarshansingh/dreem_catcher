import { EmbedBuilder } from 'discord.js';
import { getUser, getUserSpirits } from '../utils/database.js';

export default {
    data: {
        name: 'profile',
        description: 'View your Dream Hunter profile',
        aliases: ['prof', 'me'],
        cooldown: 5
    },
    async execute(message, args) {
        const targetUser = message.mentions.users.first() || message.author;
        const user = await getUser(targetUser.id);
        const spirits = await getUserSpirits(targetUser.id);
        
        const xpNeeded = user.level * 100;
        const xpProgress = (user.xp / xpNeeded) * 100;
        
        const embed = new EmbedBuilder()
            .setColor(0x4B0082)
            .setTitle(`🌙 ${targetUser.username}'s Dream Hunter Profile`)
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: '💫 Level', value: `${user.level}`, inline: true },
                { name: '⭐ Experience', value: `${user.xp}/${xpNeeded} XP`, inline: true },
                { name: '📊 Progress', value: `${xpProgress.toFixed(1)}%`, inline: true },
                { name: '🌟 Nox', value: `${user.nox.toLocaleString()}`, inline: true },
                { name: '💎 Vex', value: `${user.vex.toLocaleString()}`, inline: true },
                { name: '👻 Spirits', value: `${spirits.length}`, inline: true },
                { name: '🎤 Voice Time', value: `${Math.floor(user.voice_time / 60)}h ${user.voice_time % 60}m`, inline: true },
                { name: '📅 Joined', value: new Date(user.created_at).toLocaleDateString(), inline: true }
            )
            .setFooter({ text: 'Keep hunting dreams to grow stronger!' })
            .setTimestamp();

        await message.reply({ embeds: [embed] });
    }
};