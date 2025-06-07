import { existsSync, writeFileSync } from 'fs';
import { initializeDatabase } from './utils/database.js';

console.log('🔧 Setting up Dream Hunters Bot...\n');

// Check if .env exists
if (!existsSync('.env')) {
    console.log('📝 Creating .env file...');
    const envContent = `# Discord Bot Configuration
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_bot_client_id_here
GUILD_ID=your_test_server_id_here

# Bot Settings
PREFIX=!
BOT_NAME=Dream Hunters Bot
BOT_VERSION=1.0.0

# Database
DB_PATH=./database/dreamhunters.db
`;
    
    writeFileSync('.env', envContent);
    console.log('✅ .env file created! Please fill in your bot token and IDs.\n');
} else {
    console.log('✅ .env file already exists.\n');
}

// Initialize database
console.log('🗄️ Initializing database...');
try {
    await initializeDatabase();
    console.log('✅ Database setup complete!\n');
} catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
}

console.log('🌟 Setup complete! Next steps:');
console.log('1. Fill in your Discord bot token in the .env file');
console.log('2. Install dependencies: npm install');
console.log('3. Start the bot: npm start');
console.log('\n🌙 Happy dream hunting!');