const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('random_question')
        .setDescription("Picks a random question for you to answer"),
    async execute(interaction) {
        await interaction.reply("here is your question");
    }

}