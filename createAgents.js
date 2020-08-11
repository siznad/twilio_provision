const fs = require('fs')

const skills = ['en', 'es', 'fr', 'de']
const channels = ['default', 'voice', 'chat', 'sms', 'video']
const numAgents = 500
let agents = []

const generateNum = (min, max) => {  
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

const makeid = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const createSkills = () => {
    agentSkills = []
    specSkills = []
    numSkills = generateNum(1, skills.length)
    counter = numSkills
    
    while (counter !== 0) {
        skill = generateNum(1, numSkills)
        if (!specSkills.includes(skill)) {
            specSkills.push(skill)
        } else {
            counter--
        }
    }

    for (var i=0;i<specSkills.length;i++) {
        agentSkills.push(skills[i])
    }

    return(agentSkills)
}

const createChannels = () => {
    agentChannels = []
    specChannels = []
    channelObjects = {}
    numChannels = generateNum(1, channels.length)
    counter = numChannels
    
    while (counter !== 0) {
        task = generateNum(1, numChannels)
        if (!specChannels.includes(task)) {
            specChannels.push(task)
        } else {
            counter--
        }
    }

    for (var i=0;i<specChannels.length;i++) {
        agentChannels.push(channels[i])
    }

    for (var j=0;j<agentChannels.length;j++) {
        channelObjects[agentChannels[j]] = [generateNum(1,10), Boolean(generateNum(0, 1))]
    }

    return(channelObjects)
}

const createAgents = (agent) => {
    const dataJSON = JSON.stringify(agent)
    fs.appendFileSync('agents.json',dataJSON)
}

for (var i=0;i<numAgents;i++) {
    friendlyName = makeid(10)
    agents.push({
        "friendlyName": friendlyName,
        "attributes": {
            "languages": createSkills(),
            "contact_uri": "client:" + friendlyName,
        },
        "taskchannels": createChannels(),
        "workspace": "TEST"
    })
}

createAgents(agents)