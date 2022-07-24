const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
app.set("port", process.env.PORT || 5000);

let CONFIG = require("config");

//page handles

//button #3
const PLAY_AS_GUEST = 'button'
const USERNAME = 'input[type=username]'

//label 10 + 11
const CHECKBOX1 = "label"
const CHECKBOX2 = "label"

//button #6
const PLAY_BUTTON = "//button[contains(., 'Play')]"


const websocket;
function hookWebsocket() {
  let client = await page.target().createCDPSession()
    
  client.on('Network.webSocketCreated', ({requestId, url}) => {
    console.log('Network.webSocketCreated', requestId, url)
  })
      
  client.on('Network.webSocketClosed', ({requestId, timestamp}) => {
    console.log('Network.webSocketClosed', requestId, timestamp)
  })
      
  client.on('Network.webSocketFrameSent', ({requestId, timestamp, response}) => {
    console.log('Network.webSocketFrameSent', requestId, timestamp, response.payloadData)
  })

  client.on('Network.webSocketFrameReceived', ({requestId, timestamp, response}) => {
    console.log('Network.webSocketFrameReceived', requestId, timestamp, response.payloadData)
    
  })
}


const browserP = puppeteer.launch({
  args: ["--no-sandbox", "--disable-setuid-sandbox"]
});

app.get("/", (req, res) => {
  // FIXME move to a worker task; see https://devcenter.heroku.com/articles/node-redis-workers
  let page;
  (async () => {
    page = await (await browserP).newPage();
    await page.newPage();
    await page.goto(CONFIG.GAME_URL);
    //log in as guest

    websocket = hookWebsocket();
    //wait for load


  })()
    .catch(err => res.sendStatus(500))
    .finally(async () => await page.close())
  ;
});

app.listen(app.get("port"), () => 
  console.log("app running on port", app.get("port"))
);