var model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,
    ships: [
        {locations: [0,0,0], hits: ["","",""]},
        {locations: [0,0,0], hits: ["","",""]},
        {locations: [0,0,0], hits: ["","",""]},
    ],
    fire: function(guess){
        for(var i=0; i < this.numShips; i++){
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);
            if(ship.hits[index]=== "hit"){
                view.displayMessage("Already guessed that location!");
                return true;
            }else if(index >=0){
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage(guess);
                if(this.isSunk(ship)){
                    view.displayMessage("You sank my battleship!");
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("Missed!")
        return false;
    },
    isSunk: function(ship){
        for(var i=0; i < this.shipLength; i++){
            if(ship.hits[i] !== "hit"){
                return false;
            }
        }
        return true;
    },
    generateShipLocations: function(){
        //console.log("generatingShipLocations");
        var location;
        for(var i = 0; i < this.numShips; i++){
            do {
                location = this.generateShip();
                console.log(location);
            } while (this.collision(location));
            this.ships[i].locations = location;            
        }
        console.log("Ships array: ");
        console.log(this.ships);
    },
    generateShip: function(){
        var direction = Math.floor(Math.random() * 2);
        var row, col;
        
        if(direction === 1){
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random * (this.boardSize - this.shipLength));
            col = Math.floor(Math.random * (this.boardSize - this.shipLength + 1));
        }else{
            //console.log(direction);
            row = Math.floor(Math.random * (this.boardSize - this.shipLength));
            row = Math.floor(Math.random * (this.boardSize - this.shipLength + 1));
            col = Math.floor(Math.random() * this.boardSize);
        }
        var newShipLocations = [];
        for (var i=0;i = this.shipLength; i++){
            if(direction === 1){
                newShipLocations.push(row + "" + (col + i));
            }else{
                newShipLocations.push((row + i) + "" + col);
            }
        }
        return newShipLocations;
    },
    collision: function(locations){
        for (var i = 0; i = this.numShips; i++){
            var ship = this.ships[i];
            console.log(ship);
            for(var j = 0;j < locations.length; j++){
                if(ship.locations.indexOf(locations[j]) >= 0){
                    return true;
                }
            }           
        }
        return false;
    }
};

var view = {
    displayMessage: function(msg){
        var messageArea = document.getElementById('messageArea');
        messageArea.innerHTML = msg;
    },
    displayHit: function(location){
        var cell = document.getElementById(location);
        cell.setAttribute('class', 'hit');
    },
    displayMiss: function(location){
        var cell = document.getElementById(location);
        cell.setAttribute('class', 'miss');
    }
};

var controller = {
    guesses: 0,
    processGuess: function(guess){
        var location = parseGuess(guess);
        this.guesses++;
        var hit = model.fire(location);
        if(hit && model.shipsSunk == model.numShips){
            view.displayMessage("You sank all the battleships in " 
            + this.guesses + " guesses!");
        }
    }
};

function parseGuess(guess){
    var alphabet = ["A","B","C","D","E","F","G"];
    if(guess === null || guess.length !== 2){
        console.log("No guess was made");
    }else{
        var firstChar = guess.charAt(0);
        var row = alphabet.indexOf(firstChar);
        var column = guess.charAt(1);

        if(isNaN(row) || isNaN(column)){
            console.log("Not a valid guess");
        }else if(row <0 || row >= model.boardSize ||
            column < 0 || column >= model.boardSize){
                console.log("Guess is outside the board!");
            }else{
            return row + column;
        }
    }
    return null;
};

//handle the chat guesses
// function handleFireButton(){

//     controller.processGuess(guess);
    
// }

function init(){
    model.generateShipLocations();
}
window.onload = init;
