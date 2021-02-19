const { App } = require('@slack/bolt');
require('dotenv').config();

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

(async () => {
    // Start your app
    await app.start(process.env.PORT || 3000);
  
    console.log('⚡️ Bolt app is running!');
  })();


  //when a reaction is added
  app.event('team_join', async ({ event, client }) => {
    try {
      // Call chat.postMessage with the built-in client
      const result = await client.chat.postMessage({
        channel: welcomeChannelId,
        text: `Welcome to the team, <@${event.user}>! 🎉 You can introduce yourself in this channel.`
      });
      console.log(result);
    }
    catch (error) {
      console.error(error);
    }
  });

app.event('reaction_added', async( {event, client} ) => {
    // console.log('event: ' + JSON.stringify(event, 0, 2))
    // console.log('event: ' + event)
    //regular console.log just shows Object object

    const { item: {channel, ts}, reaction } = event;

    const language = getLanguageFromReaction(reaction);

    if (!language) return;

    //get the message with the ts from channel history
    const historyResult = await client.conversations.history({
        channel: channel,
        oldest: ts,
        latest: ts,
        inclusive: true,
        limit: 1
    })
    if (historyResult.messages.length <= 0) return;
    const {text: textToTranslate } = historyResult.messages[0];
    console.log(textToTranslate)

    const translatedText = await translate(textToTranslate, language);

    try {
        const result = await client.chat.postMessage({
            channel,
            thread_ts: ts,
            text: `Translation for :${reaction}:\n${translatedText}`
        })
        // console.log('result: ' + JSON.stringify(result, 0, 2));
    } catch {
        console.log(error)
    }
})

/**
 * Get language info from the Slack emoji reaction
 * @param {*} reaction 
 * cloud.google.com/translate/docs/languages
 * better ways: npm library that translates emoji --> la
 */
function getLanguageFromReaction(reaction) {
    const reactionToLanguageMap = {
        fr: {code: 'fr', name: 'French'},
        mx: {code: 'es', name: 'Spanish'},
        jp: {code: 'ja', name: 'Japanese'}
    }

    // const [prefix, emojiCode] = reaction.includes('flag-') ? reaction.split('-') : reaction
    // console.log([prefix, emojiCode])

    console.log(reaction)
    const language = reactionToLanguageMap[reaction]

    return language;
}

/**
 * Use the Google Translate API to translate the text
 * @param {String} textToTranslate 
 * @param {String} language 
 */
async function translate(textToTranslate, language) {
    return `Imagine this is in ${language.name}`
}