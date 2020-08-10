const fs = require('fs')
const got = require('got');

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
    (async () => {
        const {body} = await got.post('https://auburn-goldfish-8475.twil.io/provision', {
            json: element,
            responseType: 'json'
        });
        console.log(body);
    })();
});


