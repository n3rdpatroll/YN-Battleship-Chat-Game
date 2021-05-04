
//Features Customizable Set
//Basics Settings
let streamerName = "N3rdPatroll";



let maxTimeForAnswers = 15; //in seconds
let palayerAnswers = [];
let playerScores = [];
let getAnswers = true;
let thisCorrectAnswer = '';
let correctLeterAns = '';
let broadcastId;
let userId;
let error = false;
//let publicStreamerId = '7081785';
let lastMessage = '';
let proxyUrl = 'https://younow-cors-header.herokuapp.com/?q='
//------------------------------------- BASICS -----------------------------------//
async function RunCode()
{
    startEventListeners ();
}

async function Retry()
{
    console.log ("Retrying in 5 seconds");
    await sleep (5000);
    error = false;
    FetchBroadcastId ();
}

async function FetchBroadcastId()
{
    console.log ("Fetching Broadcast....");
    var targetUrl = 'https://api.younow.com/php/api/broadcast/info/curId=0/user=' + streamerName;
    var json = fetch (proxyUrl + targetUrl)
        .then (blob => blob.json ())
        .then (data =>
        {
            json = JSON.stringify (data, null, 2);
            var done = JSON.parse (json);
            //console.log("date on connect : " + done);
            if (json.length < 1)
            {
                broadcastConnection = false;
                console.log ("No Data Found");
                error = true;
            } else if (done.errorCode != 0)
            {broadcastConnection = false;
                console.log ("User not online or not found");
                error = true;
            }
            if (error)
            {
                console.log ("Error Found Retrying")
                broadcastConnection = false;
                Retry ();
                return;
            } else
            {
                
                userId = done.userId;
                broadcastId = done.broadcastId;
                console.log ("Data Found");
                // console.log(done); //the stream data
                FetchEvent ();
                return;
            }
        })
        .catch (e =>
        {
        });
}

function FetchEvent()
{
    //First Startup Connection:
    console.log ("Succesfully Connected to WebSocket");
   
    let pusher = new Pusher ('d5b7447226fc2cd78dbb', {
        cluster: "younow"
    });

    let channel = pusher.subscribe ("public-channel_" + userId);

    channel.bind ('onChat', function (data)
    {
        if (data.message !== "undefined")
        {
            for (let i = 0; i < data.message.comments.length; i++)
            {
                
                console.log(data);
                lastMessage = data.message.comments[i].comment;
                let isSub = data.message.comments[i].subscriptionType;
                let isMod = data.message.comments[i].broadcasterMod;
                let nickName = data.message.comments[i].name;
                let input = data.message.comments[i].comment;
                let id = data.message.comments[i].userId;
                let crownsAmount = data.message.comments[i].globalSpenderRank;
                let streamerId = data.message.comments[i].broadcasterId;
                publicStreamerId = streamerId;
                //console.log(isSub);
                // if(currentUsers[nickName]) return;
               
                if(isMod || isSub || (nickName == streamerName) || (nickName == "N3rdPatroll")){
                    //gives mods, subs, or streamer the ability defined below
                    input = input.toUpperCase(); //to all uppercase
                    console.log(nickName);
                    if (input.includes('RESETGAME')){
                        document.location.reload();
                        //model.generateShipLocations();
                    }else if (input.includes('SOMETHING ELSE')){
                        //do something else
                    }
                }
                // getAnswers = true;
                //check to see if watching for answer
                if(getAnswers){
                    //check the chat message for a well formed answer
                    //input = correctLeterAns + input
                    var emptyString = "";
                    var alphabet = "ABCDEFG";
                    var numGuess = Math.floor(Math.random() * 7) + 0 ;
                    let thisAnsw = input.substring(0,2);
                //    while (emptyString.length < 1) {
                //    emptyString += alphabet[Math.floor(Math.random() * (alphabet.length - 1))];
                //    thisAnsw = emptyString + numGuess;
                //    input = thisAnsw;
                //    } 
                    
                    if(input.length <= 2){  
                    //console.log('This guess is ' + thisAnsw.toUpperCase());
                    console.log(thisAnsw.toUpperCase());
                    thisAnsw = input.toUpperCase(); //to all uppercase
                    //console.log("Guessing " + thisAnsw);
                    controller.processGuess(thisAnsw, id);       
                }  
            }              
            }
        }
    });

}

async function FetchChatterId()
{
    console.log ("Fetching Broadcast....");
    var proxyUrl = 'https://younow-cors-header.herokuapp.com/?q=',
        targetUrl = 'https://api.younow.com/php/api/broadcast/info/curId=0/user=' + streamerName;
    var json = fetch (proxyUrl + targetUrl)
        .then (blob => blob.json ())
        .then (data =>
        {
            json = JSON.stringify (data, null, 2);
            var done = JSON.parse (json);
            //console.log("date on connect : " + done);
            if (json.length < 1)
            {
                console.log ("No Data Found");
                error = true;
            } else if (done.errorCode != 0)
            {
                console.log ("User not online or not found");
                error = true;
            }
            if (error)
            {
                console.log ("Error Found Retrying")
                Retry ();
                return;
            } else
            {
                userId = done.userId;
                broadcastId = done.broadcastId;
                console.log ("Data Found");
                console.log(done);
                FetchEvent ();
                return;
            }
        })
        .catch (e =>
        {
        });
}
//----------------------------- Additional Functions -----------------------------------------//

function sleep(milliseconds)
{
    return new Promise (resolve => setTimeout (resolve, milliseconds));
}






