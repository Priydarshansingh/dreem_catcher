import { EmbedBuilder } from 'discord.js';
import { getUser } from '../utils/database.js';

export default {
    data: {
        name: 'balance',
        description: 'Check your current Nox and Vex balance',
        aliases: ['bal', 'wallet'],
        cooldown: 3
    },
    async execute(message, args) {
        const targetUser = message.mentions.users.first() || message.author;
        const user = await getUser(targetUser.id);
        
        const embed = new EmbedBuilder()
            .setColor(0x32CD32)
            .setTitle(`💰 ${targetUser.username}'s Balance`)
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: '🌟 Nox', value: `${user.nox.toLocaleString()}`, inline: true },
                { name: '💎 Vex', value: `${user.vex.toLocaleString()}`, inline: true },
                { name: '💫 Level', value: `${user.level}`, inline: true }
            )
            .setFooter({ text: 'Use !sleep for daily rewards or !dreamhunt to earn more!' })
            .setTimestamp();
        
        await message.reply({ embeds: [embed] });
    }
};