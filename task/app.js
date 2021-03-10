const { App } = require('@slack/bolt');
require('dotenv').config();

const { JsonDB} = require('node-json-db');
const db = new JsonDB('task_db', true, true);

const sampleTask = {
  "U01LFS3BN92": {
    data:[
      {
        "task": "Standup",
        "priority": "medium",
        "date": "2021/03/09",
        "time": "22:28",
      }
    ]
  }
}

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
  await ack();
  const {trigger_id} = body;
  //  user: {
  //   id: 'U01LFS3BN92',
  //   username: 'xs938',
  //   name: 'xs938',
  //   team_id: 'T01L9T9TE0K'
  // },
  const user = body.user;

  const time = new Date(Date.now())
  console.log(time)
  console.log(time.getDate())
  console.log(time.getTime())

  try {
    await client.views.open({
      trigger_id: trigger_id,
      view: {
        type: 'modal',
        callback_id: 'create_task_view',
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
            "block_id": "task_name",
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
            "block_id": "priority",
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
            "block_id": "date_pickers",
            "elements": [
              {
                "type": "datepicker",
                "initial_date": "1990-04-28",
                "placeholder": {
                  "type": "plain_text",
                  "text": "Select a date",
                  "emoji": true
                },
                "action_id": "select_date1"
              },
              // {
              //   "type": "datepicker",
              //   "initial_date": "1990-04-28",
              //   "placeholder": {
              //     "type": "plain_text",
              //     "text": "Select a date",
              //     "emoji": true
              //   },
              //   "action_id": "select_date2"
              // }
            ]
          },
          {
            "type": "actions",
            "block_id": "time_pickers",
            "elements": [
              {
                "type": "timepicker",
                "initial_time": "13:37",
                "placeholder": {
                  "type": "plain_text",
                  "text": "Select time",
                  "emoji": true
                },
                "action_id": "select_time1"
              },
              {
                "type": "timepicker",
                "initial_time": "13:37",
                "placeholder": {
                  "type": "plain_text",
                  "text": "Select time",
                  "emoji": true
                },
                "action_id": "select_time2"
              }
            ]
          },
        ]
      }
    })
  } 
  catch (error) {
    console.log(error.message)
  }
})

// send acks to buttons
app.action('select_date1', async ({ ack}) => {
  await ack();
})

app.action('select_date2', async ({ ack}) => {
  await ack();
})

app.action('select_time1', async ({ ack}) => {
  await ack();
})

app.action('select_time2', async ({ ack}) => {
  await ack();
})


// listens for and processes view submission
app.view('create_task_view', async ({ ack, body, client, view}) => {
  await ack();
  const values = view.state.values;
  const user = body.user;
  const id = user.id;
  // console.log(values)

  const taskName = values.task_name.content.value;
  const priority = values.priority.select_priority.selected_option.value;
  const date = values.date_pickers.select_date1.selected_date;
  const time = values.time_pickers.select_time1.selected_time;

  console.log(`${id} ${taskName} ${priority} ${date} ${time}`)

})
