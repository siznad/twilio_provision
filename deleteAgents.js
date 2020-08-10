const fs = require('fs')
const request = require('request')
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const loadAgents = () => {
    try {
        const dataBuffer = fs.readFileSync('agents.json')
        const dataJSON = dataBuffer.toString()
        return JSON.parse(dataJSON)
    } catch (e) {
        return []
    }
}

loadAgents().forEach(element => {
    client.taskrouter.workspaces(process.env.WORKSPACE_SID)
                 .workers
                 .list({friendlyName: element.friendlyName, limit: 1})
                 .then(workers => {
                    client.taskrouter.workspaces(process.env.WORKSPACE_SID)
                    .workers(workers[0].sid)
                    .remove();
                 })
});
