import { EmbedBuilder } from 'discord.js';
import { getUserSpirits } from '../utils/database.js';
import { getSpiritsByRarity, RARITIES } from '../utils/spirits.js';

export default {
    data: {
        name: 'spirits',
        description: 'View your spirit collection',
        aliases: ['collection', 'inventory'],
        cooldown: 5
    },
    async execute(message, args) {
        const targetUser = message.mentions.users.first() || message.author;
        const spirits = await getUserSpirits(targetUser.id);
        
        if (spirits.length === 0) {
            const embed = new EmbedBuilder()
                .setColor(0x808080)
                .setTitle('👻 Empty Spirit Realm')
                .setDescription(`${targetUser.id === message.author.id ? 'You have' : targetUser.username + ' has'} no spirits yet.\n\nUse \`!dreamhunt\` or \`!summon\` to collect spirits!`)
                .setFooter({ text: 'Every dream hunter starts somewhere...' });
                
            return message.reply({ embeds: [embed] });
        }
        
        const grouped = getSpiritsByRarity(spirits);
        const totalCount = spirits.length;
        
        const embed = new EmbedBuilder()
            .setColor(0x7B68EE)
            .setTitle(`👻 ${targetUser.username}'s Spirit Collection`)
            .setDescription(`**Total Spirits:** ${totalCount}`)
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }));
        
        // Add spirits by rarity
        Object.entries(grouped).forEach(([rarity, spiritList]) => {
            if (spiritList.length > 0) {
                const rarityInfo = Object.values(RARITIES).find(r => r.name.toLowerCase() === rarity);
                const spiritNames = spiritList.slice(0, 10).map(s => `• ${s.spirit_name}`).join('\n');
                const extraCount = spiritList.length > 10 ? `\n*...and ${spiritList.length - 10} more*` : '';
                
                embed.addFields({
                    name: `${rarityInfo.emoji} ${rarityInfo.name} (${spiritList.length})`,
                    value: spiritNames + extraCount,
                    inline: false
                });
            }
        });
        
        embed.setFooter({ text: `Collection started ${new Date(spirits[spirits.length - 1].obtained_at).toLocaleDateString()}` })
             .setTimestamp();
        
        await message.reply({ embeds: [embed] });
    }
};