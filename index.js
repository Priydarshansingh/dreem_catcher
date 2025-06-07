import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';
import { readdirSync } from 'fs';
import dotenv from 'dotenv';
import { initializeDatabase } from './utils/database.js';
import { trackActivity, trackVoiceActivity } from './utils/activity.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.commands = new Collection();
client.cooldowns = new Collection();

// Load commands
async function loadCommands() {
    const commandsPath = join(__dirname, 'commands');
    const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = pathToFileURL(join(commandsPath, file)).href;
        const command = await import(filePath);
        
        if ('data' in command.default && 'execute' in command.default) {
            client.commands.set(command.default.data.name, command.default);
            console.log(`✅ Loaded command: ${command.default.data.name}`);
        } else {
            console.log(`⚠️  Command ${file} is missing required "data" or "execute" property.`);
        }
    }
}

// Load events
async function loadEvents() {
    const eventsPath = join(__dirname, 'events');
    const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = pathToFileURL(join(eventsPath, file)).href;
        const event = await import(filePath);
        
        if (event.default.once) {
            client.once(event.default.name, (...args) => event.default.execute(...args));
        } else {
            client.on(event.default.name, (...args) => event.default.execute(...args));
        }
        console.log(`✅ Loaded event: ${event.default.name}`);
    }
}

client.once('ready', async () => {
    console.log(`🌙 ${client.user.tag} is online and ready!`);
    console.log(`📊 Serving ${client.guilds.cache.size} servers`);
    
    // Initialize database
    await initializeDatabase();
    console.log('📦 Database initialized successfully');
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    
    // Track activity for XP
    await trackActivity(message.author.id);
    
    // Handle prefix commands
    const prefix = process.env.PREFIX || '!';
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || 
                   client.commands.find(cmd => cmd.data.aliases && cmd.data.aliases.includes(commandName));

    if (!command) return;

    // Cooldown handling
    const { cooldowns } = client;
    if (!cooldowns.has(command.data.name)) {
        cooldowns.set(command.data.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.data.name);
    const cooldownAmount = (command.data.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`⏰ Please wait ${timeLeft.toFixed(1)} more seconds before using \`${command.data.name}\` again.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    // Execute command
    try {
        await command.execute(message, args);
    } catch (error) {
        console.error('Command execution error:', error);
        message.reply('❌ There was an error executing this command!');
    }
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    await trackVoiceActivity(oldState, newState);
});

// Initialize bot
async function startBot() {
    try {
        await loadCommands();
        await loadEvents();
        await client.login(process.env.DISCORD_TOKEN);
    } catch (error) {
        console.error('Failed to start bot:', error);
        process.exit(1);
    }
}

startBot();

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down Dream Hunters Bot...');
    client.destroy();
    process.exit(0);
});