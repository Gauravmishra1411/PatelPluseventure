// Script to seed stats data to Firebase
// Run with: node scripts/seed-stats.js

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Hero Stats Data
const heroStats = [
    {
        icon: "Award",
        title: "Projects Completed",
        number: "40",
        suffix: "+"
    },
    {
        icon: "Star",
        title: "Average Rating",
        number: "5",
        suffix: "★"
    },
    {
        icon: "Check",
        title: "Client Satisfaction",
        number: "99",
        suffix: "%"
    },
    {
        icon: "Clock",
        title: "Support Available",
        number: "24",
        suffix: "/7"
    }
];

// About Section Stats Data (for Counters)
const aboutStats = [
    {
        icon: "Award",
        title: "Projects Completed",
        number: "50",
        suffix: "+"
    },
    {
        icon: "Star",
        title: "Client Satisfaction",
        number: "100",
        suffix: "%"
    },
    {
        icon: "Clock",
        title: "Support Available",
        number: "24",
        suffix: "/7"
    },
    {
        icon: "Target",
        title: "Awards Won",
        number: "10",
        suffix: "+"
    }
];

async function seedStats() {
    try {
        console.log('🌱 Starting to seed stats data...\n');

        // Seed Hero Stats
        console.log('📊 Seeding Home Hero Stats...');
        const heroStatsRef = db.collection('home_hero_stats');

        // Clear existing data
        const heroSnapshot = await heroStatsRef.get();
        const heroDeletePromises = heroSnapshot.docs.map(doc => doc.ref.delete());
        await Promise.all(heroDeletePromises);
        console.log(`   Cleared ${heroSnapshot.size} existing hero stats`);

        // Add new data
        for (const stat of heroStats) {
            await heroStatsRef.add(stat);
            console.log(`   ✅ Added: ${stat.title} - ${stat.number}${stat.suffix}`);
        }

        // Seed About Stats
        console.log('\n📈 Seeding Home About Stats (Counters)...');
        const aboutStatsRef = db.collection('home_about_stats');

        // Clear existing data
        const aboutSnapshot = await aboutStatsRef.get();
        const aboutDeletePromises = aboutSnapshot.docs.map(doc => doc.ref.delete());
        await Promise.all(aboutDeletePromises);
        console.log(`   Cleared ${aboutSnapshot.size} existing about stats`);

        // Add new data
        for (const stat of aboutStats) {
            await aboutStatsRef.add(stat);
            console.log(`   ✅ Added: ${stat.title} - ${stat.number}${stat.suffix}`);
        }

        console.log('\n✨ Successfully seeded all stats data!');
        console.log('\n📝 Summary:');
        console.log(`   - Hero Stats: ${heroStats.length} items`);
        console.log(`   - About Stats: ${aboutStats.length} items`);
        console.log('\n🎉 Done! Your stats will now animate from 0 to the target numbers when viewed.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding stats:', error);
        process.exit(1);
    }
}

seedStats();
