export default {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`🌙 ${client.user.tag} has awakened in the dream realm!`);
        console.log(`📊 Currently serving ${client.guilds.cache.size} servers`);
        console.log(`👥 Watching over ${client.users.cache.size} dream hunters`);
        
        // Set bot status
        client.user.setActivity('Dream Hunters | !help', { type: 'WATCHING' });
    },
};