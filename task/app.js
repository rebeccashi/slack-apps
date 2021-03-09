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

app.event('app_home_opened', async ({ event, client, context }) => {
  try {
    /* view.publish is the method that your app uses to push a view to the Home tab */
    const result = await client.views.publish({

      /* the user that opened your app's app home */
      user_id: event.user,

      /* the view object that appears in the app home*/
      view: {
        type: 'home',
        callback_id: 'home_view',

        /* body of the view */
        blocks: [
          {
            type: "section",
            text: {
              "type": "mrkdwn",
              "text": "*Welcome to your _Tasks's Home_* :tada:"
            }
          },
          {
            type: "divider"
          },
          // {
          //   "type": "section",
          //   "text": {
          //     "type": "mrkdwn",
          //     //This button won't do much for now but you can set up a listener for it using the `actions()` method and passing its unique `action_id`. See an example in the `examples` folder within your Bolt app.
          //     "text": "Create a new event"
          //   }
          // },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "Create a New Event"
                },
                action_id: "create_event",
              }
            ]
          }
        ]
      }
    });
  }
  catch (error) {
    console.error(error);
  }
});

app.action("create_event", async ({ack}) => {
  await ack();
  console.log('Creating an event')
})