import { EmbedBuilder } from 'discord.js';

export default {
    data: {
        name: 'help',
        description: 'Display all available commands',
        aliases: ['h', 'commands'],
        cooldown: 5
    },
    async execute(message, args) {
        const prefix = process.env.PREFIX || '!';
        
        const embed = new EmbedBuilder()
            .setColor(0x7B68EE)
            .setTitle('🌙 Dream Hunters Bot - Commands')
            .setDescription('Welcome to the Dream Realm! Here are all available commands:')
            .addFields(
                {
                    name: '👤 Profile Commands',
                    value: `\`${prefix}profile\` - View your Dream Hunter profile\n\`${prefix}balance\` - Check your Nox and Vex balance\n\`${prefix}spirits\` - View your spirit collection`,
                    inline: false
                },
                {
                    name: '🌌 Hunting Commands',
                    value: `\`${prefix}dreamhunt\` - Hunt for dreams and spirits (1min cooldown)\n\`${prefix}summon\` - Spend 5 Vex to summon a spirit\n\`${prefix}sleep\` - Claim daily rewards (24h cooldown)`,
                    inline: false
                },
                {
                    name: '📊 Community Commands',
                    value: `\`${prefix}leaderboard [nox/vex/level]\` - View top hunters\n\`${prefix}ping\` - Check bot responsiveness\n\`${prefix}help\` - Show this help message`,
                    inline: false
                },
                {
                    name: '💡 Tips',
                    value: '• Chat in servers to gain XP and level up\n• Stay in voice channels to earn Vex\n• Summoning gives better spirit rates than hunting\n• Collect spirits of different rarities',
                    inline: false
                }
            )
            .setFooter({ text: `Prefix: ${prefix} | Happy hunting!` })
            .setTimestamp();
        
        await message.reply({ embeds: [embed] });
    }
};