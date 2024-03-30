const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js')
const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior, AudioPlayer, AudioPlayerStatus, demuxProbe } = require('@discordjs/voice')
const ytdl = require('ytdl-core')
const fs = require('fs')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a youtube link.')
        .addStringOption(option => 
            option.setName("link")
                .setDescription("The youtube link you wish to play")
                .setRequired(true)
        ),
    async execute(interaction) {
        const ytLink = interaction.options.getString("link") ?? null;
        let currVoiceChannel = interaction.member.voice.channelId;

        if (currVoiceChannel == null) {
            await interaction.reply("Join a voice channel before trying to play music!");
            return;
        }

        if (ytLink == null) {
            await interaction.reply("Please add a youtube link to the command")
            return;
        }

        let connection = joinVoiceChannel({
            channelId: currVoiceChannel,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator
        });

        const audioPlayer = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause
            }
        });
        const youtubeStream = ytdl(ytLink, {
            dlChunkSize: 0,
            quality: 'highestaudio'
        });

        const subscription = connection.subscribe(audioPlayer);
        let resource = createAudioResource(youtubeStream)

        audioPlayer.play(resource);
        audioPlayer.on(AudioPlayerStatus.Idle, () => {
            audioPlayer.stop();
            connection.destroy();
        })
        
        await interaction.reply(`Playing  ...`);
    }

}