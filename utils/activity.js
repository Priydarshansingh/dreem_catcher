import { getUser, updateUser, logActivity } from './database.js';

const voiceSessions = new Map();

export async function trackActivity(userId) {
    const user = await getUser(userId);
    const newXp = user.xp + 1;
    let newLevel = user.level;
    
    // Level up every 100 XP
    if (newXp >= user.level * 100) {
        newLevel += 1;
        console.log(`🎉 User ${userId} leveled up to ${newLevel}!`);
    }
    
    await updateUser(userId, {
        xp: newXp,
        level: newLevel
    });
    
    if (newLevel > user.level) {
        await logActivity(userId, 'level_up', newLevel);
    }
}

export async function trackVoiceActivity(oldState, newState) {
    const userId = newState.id || oldState.id;
    
    // User joined a voice channel
    if (!oldState.channel && newState.channel) {
        voiceSessions.set(userId, Date.now());
        
        await updateUser(userId, {
            voice_start: new Date().toISOString()
        });
    }
    
    // User left a voice channel
    if (oldState.channel && !newState.channel) {
        const startTime = voiceSessions.get(userId);
        if (startTime) {
            const timeSpent = Date.now() - startTime;
            const minutesSpent = Math.floor(timeSpent / 60000);
            
            // Award 1 Vex for every 30 minutes
            const vexReward = Math.floor(minutesSpent / 30);
            
            if (vexReward > 0) {
                const user = await getUser(userId);
                await updateUser(userId, {
                    vex: user.vex + vexReward,
                    voice_time: user.voice_time + minutesSpent,
                    voice_start: null
                });
                
                await logActivity(userId, 'voice_reward', vexReward);
                console.log(`🎤 User ${userId} earned ${vexReward} Vex for ${minutesSpent} minutes in voice`);
            }
            
            voiceSessions.delete(userId);
        }
    }
}