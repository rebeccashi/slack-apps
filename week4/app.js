const { App, ExpressReceiver } = require('@slack/bolt')
const express = require('express')
const axios = require('axios')
//bolt js was originally built using Express
require('dotenv').config()

const receiver = new ExpressReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET
})
receiver.router.use(express.json())

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    receiver,
});

(async () => {
    // Start your app
    await app.start(process.env.PORT || 3000);
    
    console.log('⚡️ Bolt app is running!');
    })();

receiver.router.post('/github-stars', async(req, res) => {
    console.log('hit my route for github-stars')

    const {action, repository, sender} = req.body
    const verb = action === 'deleted' ? 'unstarred': 'starred'
    const text = `${sender.login} just ${verb} the ${repository.name} repository, bringing the star count to ${repository.stargazers_count}`

    app.client.chat.postMessage({
        token: process.env.SLACK_BOT_TOKEN,
        channel: 'github',
        text,
    })

    res.sendStatus(200)
})

app.event('app_home_opened', async({ event, client}) => {
    //no ack for app.event
    const githubUrl = 'https://api.github.com/repos/rebeccashi/slack-apps'
    const {data: issues} = await axios.get(githubUrl)
    console.log(issues)

    const issuesBlocks = issues.map(issue => {
        type: 'setion',
        text: {
            type: 'mrkdwn',
            text: `<${issue.html_url}>|${issue.title} opened by `
        }
    })

    await client.views.publish({
        user_id: event.user,
        view: {
            type: 'home',
            blocks: [
                {
                    type: 'header',
                    text: {
                        type: 'plain_text',
                        text: 'Open Issues'
                    }
                },
                ...issuesBlocks
            ]
        }
    })
})

//github webhooks - can listen to starred or unstarred