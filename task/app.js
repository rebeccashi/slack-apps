const { App } = require('@slack/bolt');
require('dotenv').config();

const { JsonDB} = require('node-json-db');
const db = new JsonDB('task_db', true, true);

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
          //sample task 
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              //This button won't do much for now but you can set up a listener for it using the `actions()` method and passing its unique `action_id`. See an example in the `examples` folder within your Bolt app.
              "text": "Standup at 10am"
            }
          },
          {
            type: "divider"
          },
          {
            type: "actions",
            block_id: "create_block",
            elements: [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "Create a New Event"
                },
                action_id: "create_task",
                value: "create_event_button"
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

// clicking the button is not triggering this function
app.action("create_task", async ({ack, body, client}) => {
  console.log('Creating an event')
  await ack();
  const {trigger_id} = body;

  try {
    await client.views.open({
      trigger_id: trigger_id,
      view: {
        type: 'modal',
        title: {
          type: 'plain_text',
          text: 'Create a Task'
        },
        submit: {
          type: 'plain_text',
          text: 'Create'
        },
        blocks: [
          // Text input
          {
            "type": "input",
            "block_id": "note01",
            "label": {
              "type": "plain_text",
              "text": "Task"
            },
            "element": {
              "action_id": "content",
              "type": "plain_text_input",
              "placeholder": {
                "type": "plain_text",
                "text": "Write down your task"
              },
              "multiline": true
            }
          },
          
          // Drop-down menu      
          {
            "type": "input",
            "block_id": "note02",
            "label": {
              "type": "plain_text",
              "text": "Priority",
            },
            "element": {
              "type": "static_select",
              "action_id": "select_priority",
              "options": [
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Urgent"
                  },
                  "value": "urgent"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "High"
                  },
                  "value": "high"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Medium"
                  },
                  "value": "medium"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Low"
                  },
                  "value": "low"
                }
              ]
            }
          
          },
          {
            "type": "actions",
            "elements": [
              {
                "type": "datepicker",
                "initial_date": "1990-04-28",
                "placeholder": {
                  "type": "plain_text",
                  "text": "Select a date",
                  "emoji": true
                },
                "action_id": "actionId-0"
              },
              {
                "type": "datepicker",
                "initial_date": "1990-04-28",
                "placeholder": {
                  "type": "plain_text",
                  "text": "Select a date",
                  "emoji": true
                },
                "action_id": "actionId-1"
              }
            ]
          },
          {
            "type": "actions",
            "elements": [
              {
                "type": "timepicker",
                "initial_time": "13:37",
                "placeholder": {
                  "type": "plain_text",
                  "text": "Select time",
                  "emoji": true
                },
                "action_id": "select_time"
              },
              {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "text": "Click Me",
                  "emoji": true
                },
                "value": "click_me_123",
                "action_id": "select_date"
              }
            ]
          }
        ]
      }
    })
  } 
  catch (error) {
    console.log(error.message)
  }
})

// const openModal = async (trigger_id) => {
  
//   const modal = 
// }