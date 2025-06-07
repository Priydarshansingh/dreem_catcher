# 🌙 Dream Hunters Discord Bot

A feature-rich Discord bot for gaming communities with currency systems, spirit collection, and interactive hunting mechanics.

## ✨ Features

### 💰 Currency System
- **Nox** - Primary currency earned through activities
- **Vex** - Premium currency earned through voice chat and daily rewards
- Daily rewards with `!sleep` command
- Balance tracking and leaderboards

### 👻 Spirit Collection
- Hunt for spirits with `!dreamhunt` 
- Summon rare spirits with `!summon`
- Multiple rarity tiers: Common, Rare, Epic, Legendary
- Personal spirit collection viewing

### 📈 Progression System
- XP gained from chat activity
- Level progression (100 XP per level)
- Voice chat time tracking
- Activity logging and rewards

### 🏆 Community Features
- Global leaderboards for Nox, Vex, and Level
- User profiles with detailed stats
- Rich embed messages with beautiful formatting

## 🚀 Installation

### Prerequisites
- Node.js 18+ 
- Discord Bot Token
- Basic knowledge of Discord bot setup

### Quick Setup

1. **Clone/Download** this project
2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run setup script:**
   ```bash
   npm run setup
   ```

4. **Configure your bot:**
   - Edit `.env` file with your Discord bot token
   - Get your token from [Discord Developer Portal](https://discord.com/developers/applications)

5. **Start the bot:**
   ```bash
   npm start
   ```

### Environment Variables

Create a `.env` file with:

```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_bot_client_id_here
GUILD_ID=your_test_server_id_here
PREFIX=!
```

## 🎮 Commands

### Profile Commands
- `!profile [@user]` - View Dream Hunter profile
- `!balance [@user]` - Check currency balance  
- `!spirits [@user]` - View spirit collection

### Activity Commands  
- `!dreamhunt` - Hunt for Nox and spirits (1min cooldown)
- `!summon` - Spend 5 Vex to summon spirits (better rates)
- `!sleep` - Daily reward claim (24hr cooldown)

### Community Commands
- `!leaderboard [nox/vex/level]` - View top players
- `!help` - Show all commands
- `!ping` - Bot response test

## 🗄️ Database

Uses SQLite for data persistence with tables:
- `users` - Player profiles and stats
- `spirits` - Spirit collection data  
- `activity_log` - Activity tracking

## 🎨 Customization

### Adding New Spirits
Edit `utils/spirits.js` to add new spirit names and adjust rarity rates.

### Modifying Rewards
Update reward amounts in individual command files:
- Daily rewards: `commands/sleep.js`
- Hunt rewards: `commands/dreamhunt.js`

### Custom Commands
Add new `.js` files to `/commands` folder following the existing structure.

## 🔧 Advanced Setup

### Voice Activity Rewards
The bot automatically tracks voice channel time and awards 1 Vex per 30 minutes.

### XP System  
Users gain 1 XP per message and level up every 100 XP.

### Cooldown System
Built-in cooldown management prevents command spam.

## 📊 Hosting

### Development
```bash
npm run dev  # Auto-restart on file changes
```

### Production (VPS/Server)
1. Install PM2: `npm install -g pm2`
2. Start bot: `pm2 start index.js --name "dream-hunters"`
3. Save PM2 config: `pm2 save && pm2 startup`

### Cloud Hosting
Works with Heroku, Railway, Render, or any Node.js hosting platform.

## 🛡️ Security

- Environment variables for sensitive data
- Input validation on all commands
- Rate limiting through cooldowns
- Error handling and logging

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m "Add feature"`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## 📄 License

MIT License - feel free to modify and use for your community!

## 🆘 Support

For setup help or questions:
- Check the console for error messages
- Ensure bot has proper Discord permissions
- Verify environment variables are set correctly

---

**Made with 💜 for Discord gaming communities**

*Happy dream hunting! 🌙✨*