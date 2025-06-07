import { EmbedBuilder } from 'discord.js';
import { getUser, updateUser, addSpirit, logActivity } from '../utils/database.js';
import { getRandomSpirit, RARITIES } from '../utils/spirits.js';

export default {
    data: {
        name: 'summon',
        description: 'Spend 5 Vex to summon a powerful spirit',
        aliases: ['summ'],
        cooldown: 10
    },
    async execute(message, args) {
        const user = await getUser(message.author.id);
        const cost = 5;
        
        if (user.vex < cost) {
            const embed = new EmbedBuilder()
                .setColor(0xFF6B6B)
                .setTitle('💎 Insufficient Vex')
                .setDescription(`You need **${cost} Vex** to perform a summoning ritual.\nYou currently have **${user.vex} Vex**.`)
                .setFooter({ text: 'Earn Vex through daily rewards and voice activity!' });
                
            return message.reply({ embeds: [embed] });
        }
        
        // Enhanced rates for summoning (better than hunting)
        const enhancedRand = Math.random();
        let spirit;
        
        if (enhancedRand < 0.05) { // 5% legendary
            spirit = getRandomSpirit();
            while (spirit.rarity !== 'legendary') {
                spirit = getRandomSpirit();
            }
        } else if (enhancedRand < 0.20) { // 15% epic
            spirit = getRandomSpirit();
            while (spirit.rarity !== 'epic') {
                spirit = getRandomSpirit();
            }
        } else if (enhancedRand < 0.50) { // 30% rare
            spirit = getRandomSpirit();
            while (spirit.rarity !== 'rare') {
                spirit = getRandomSpirit();
            }
        } else { // 50% common
            spirit = getRandomSpirit();
            while (spirit.rarity !== 'common') {
                spirit = getRandomSpirit();
            }
        }
        
        // Update user
        await updateUser(message.author.id, {
            vex: user.vex - cost
        });
        
        // Add spirit to collection
        await addSpirit(message.author.id, spirit.name, spirit.rarity);
        await logActivity(message.author.id, 'spirit_summon', cost);
        
        const embed = new EmbedBuilder()
            .setColor(spirit.color)
            .setTitle('✨ Summoning Ritual Complete!')
            .setDescription('The ethereal energies swirl and coalesce...')
            .addFields(
                { name: '👻 Summoned Spirit', value: `${spirit.emoji} **${spirit.name}**\n*${spirit.rarity.charAt(0).toUpperCase() + spirit.rarity.slice(1)} Rarity*`, inline: false },
                { name: '💎 Vex Spent', value: `-${cost}`, inline: true },
                { name: '💎 Remaining Vex', value: `${user.vex - cost}`, inline: true }
            )
            .setImage('https://images.pexels.com/photos/355952/pexels-photo-355952.jpeg') // Mystical summoning image
            .setFooter({ text: 'Summoned spirits have enhanced power!' })
            .setTimestamp();
            
        if (spirit.rarity === 'legendary') {
            embed.setDescription('🌟 **LEGENDARY SUMMON!** 🌟\nThe very fabric of reality trembles as an ancient power awakens!');
        } else if (spirit.rarity === 'epic') {
            embed.setDescription('🔮 **Epic Summoning!** 🔮\nPowerful energies surge as a mighty spirit manifests!');
        }
        
        await message.reply({ embeds: [embed] });
    }
};