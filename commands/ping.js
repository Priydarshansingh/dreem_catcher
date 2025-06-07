import { EmbedBuilder } from 'discord.js';

export default {
    data: {
        name: 'ping',
        description: 'Test command to check if the bot is responsive',
        aliases: ['p'],
        cooldown: 3
    },
    async execute(message, args) {
        const embed = new EmbedBuilder()
            .setColor(0x7B68EE)
            .setTitle('🌙 Pong!')
            .setDescription('Dream Hunters Bot is awake and ready!')
            .addFields(
                { name: '📡 Latency', value: `${Date.now() - message.createdTimestamp}ms`, inline: true },
                { name: '💓 API Latency', value: `${Math.round(message.client.ws.ping)}ms`, inline: true }
            )
            .setTimestamp();

        await message.reply({ embeds: [embed] });
    }
};