import { EmbedBuilder } from 'discord.js';
import { getUser, updateUser, addSpirit, logActivity } from '../utils/database.js';
import { getRandomSpirit } from '../utils/spirits.js';

export default {
    data: {
        name: 'dreamhunt',
        description: 'Hunt for dreams and spirits in the ethereal realm',
        aliases: ['hunt', 'dh'],
        cooldown: 60 // 1 minute cooldown
    },
    async execute(message, args) {
        const user = await getUser(message.author.id);
        
        // Generate rewards
        const noxReward = Math.floor(Math.random() * 21) + 10; // 10-30 Nox
        const spirit = getRandomSpirit();
        
        // Update user
        await updateUser(message.author.id, {
            nox: user.nox + noxReward,
            last_hunt: new Date().toISOString()
        });
        
        // Add spirit to collection
        await addSpirit(message.author.id, spirit.name, spirit.rarity);
        await logActivity(message.author.id, 'dream_hunt', noxReward);
        
        const embed = new EmbedBuilder()
            .setColor(spirit.color)
            .setTitle('🌌 Dream Hunt Results')
            .setDescription('You venture into the dream realm and discover...')
            .addFields(
                { name: '🌟 Nox Found', value: `+${noxReward} Nox`, inline: true },
                { name: '👻 Spirit Discovered', value: `${spirit.emoji} **${spirit.name}**\n*${spirit.rarity.charAt(0).toUpperCase() + spirit.rarity.slice(1)}*`, inline: true },
                { name: '💰 New Nox Balance', value: `${(user.nox + noxReward).toLocaleString()}`, inline: true }
            )
            .setFooter({ text: 'The dream realm holds infinite mysteries...' })
            .setTimestamp();
            
        await message.reply({ embeds: [embed] });
    }
};