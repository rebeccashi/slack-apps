const { App, ExpressReceiver } = require('@slack/bolt')
//bolt js was originally built using Express
require('dotenv').config()

const receiver = new ExpressReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET
})

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
});
  
(async () => {
// Start your app
await app.start(process.env.PORT || 3000);

console.log('⚡️ Bolt app is running!');
})();

//github webhooks - can listen to starred or unstarred