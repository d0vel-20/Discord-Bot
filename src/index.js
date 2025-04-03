require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const TARGET_SERVER_ID = process.env.ID;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`Bot "${client.user.tag}" is online and running in ${client.guilds.cache.size} server(s).`);
});

console.log("Bot is starting...");

// send notifications to the target server
async function sendNotification(embed) {
    const targetServer = client.guilds.cache.get(TARGET_SERVER_ID);
    if (!targetServer) {
        console.log(`Target server with ID ${TARGET_SERVER_ID} not found.`);
        return;
    }

    const channel = targetServer.channels.cache.find(ch => ch.name === 'new-member-alert');
    if (!channel) {
        console.log(`"new-member-alert" channel not found in target server.`);
        return;
    }

    await channel.send({ embeds: [embed] });
}

// New members joining
client.on('guildMemberAdd', async (member) => {
    console.log(`New member joined "${member.guild.name}": ${member.user.tag} (ID: ${member.id})`);

    const embed = new EmbedBuilder()
        .setTitle("📢 New Member Alert!")
        .setDescription(`A new member **${member.user.tag}** joined **${member.guild.name}** 🎉`)
        .setColor("Green")
        .setThumbnail(member.user.displayAvatarURL());

    await sendNotification(embed);
});

// Members leaving
client.on('guildMemberRemove', async (member) => {
    console.log(`Member left "${member.guild.name}": ${member.user.tag} (ID: ${member.id})`);

    const embed = new EmbedBuilder()
        .setTitle("📢 Member Left")
        .setDescription(`A member **${member.user.tag}** left **${member.guild.name}** 😢`)
        .setColor("Red")
        .setThumbnail(member.user.displayAvatarURL());

    await sendNotification(embed);
});

client.login(process.env.TOKEN).then(() => {
    console.log("Attempting to log in...");
}).catch(err => {
    console.error("Failed to log in:", err);
});




