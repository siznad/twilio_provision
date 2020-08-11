const fs = require('fs')
const got = require('got');
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
var request = require('request');
var RateLimiter = require('limiter').RateLimiter;
var limiter = new RateLimiter(1, 10);

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
    element['action'] = 'delete'
    limiter.removeTokens(1, async function() {
        const {body} = await got.post('https://auburn-goldfish-8475.twil.io/provision', {
            json: element,
            responseType: 'json'
        })
        console.log(body);
    })
});