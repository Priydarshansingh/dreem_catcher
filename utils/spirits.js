export const SPIRIT_NAMES = [
    // Common Spirits
    'Whisper Shade', 'Night Wisp', 'Moonbeam Spirit', 'Star Dancer', 'Dream Walker',
    'Shadow Sprite', 'Lunar Moth', 'Twilight Fox', 'Mist Guardian', 'Cloud Drifter',
    
    // Rare Spirits
    'Phantom Knight', 'Crystal Sage', 'Storm Rider', 'Fire Phoenix', 'Ice Dragon',
    'Thunder Beast', 'Wind Serpent', 'Earth Titan', 'Wave Master', 'Light Bearer',
    
    // Epic Spirits
    'Celestial Wolf', 'Void Walker', 'Time Keeper', 'Soul Reaper', 'Dream Weaver',
    'Nightmare King', 'Star Forger', 'Reality Bender', 'Fate Spinner', 'Chaos Lord',
    
    // Legendary Spirits
    'Eternal Guardian', 'Cosmic Entity', 'Divine Oracle', 'Infinity Dragon', 'Universe Creator'
];

export const RARITIES = {
    COMMON: { name: 'Common', chance: 0.60, emoji: '⚪', color: 0x808080 },
    RARE: { name: 'Rare', chance: 0.25, emoji: '🔵', color: 0x4169E1 },
    EPIC: { name: 'Epic', chance: 0.12, emoji: '🟣', color: 0x8A2BE2 },
    LEGENDARY: { name: 'Legendary', chance: 0.03, emoji: '🟡', color: 0xFFD700 }
};

export function getRandomSpirit() {
    const rand = Math.random();
    let rarity;
    
    if (rand < RARITIES.LEGENDARY.chance) {
        rarity = RARITIES.LEGENDARY;
    } else if (rand < RARITIES.LEGENDARY.chance + RARITIES.EPIC.chance) {
        rarity = RARITIES.EPIC;
    } else if (rand < RARITIES.LEGENDARY.chance + RARITIES.EPIC.chance + RARITIES.RARE.chance) {
        rarity = RARITIES.RARE;
    } else {
        rarity = RARITIES.COMMON;
    }
    
    const spiritName = SPIRIT_NAMES[Math.floor(Math.random() * SPIRIT_NAMES.length)];
    
    return {
        name: spiritName,
        rarity: rarity.name.toLowerCase(),
        emoji: rarity.emoji,
        color: rarity.color
    };
}

export function getSpiritsByRarity(spirits) {
    const grouped = {
        legendary: [],
        epic: [],
        rare: [],
        common: []
    };
    
    spirits.forEach(spirit => {
        grouped[spirit.rarity].push(spirit);
    });
    
    return grouped;
}