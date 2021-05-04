
var hitGuesses = [];
// testing the view
var view = {
	displayMessage: function(msg) {
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},

	displayHit: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},

	displayMiss: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	}

}; 

// view.displayMiss("00");
// view.displayHit("34");
// view.displayMiss("55");
// view.displayHit("12");
// view.displayMiss("25");
// view.displayHit("26");

view.displayMessage("Tap tap, is this thing on?");

// testing the model


var model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,
	
	ships: [
		{ locations: ["", "", ""], hits: ["", "", ""] },
		{ locations: ["", "", ""], hits: ["", "", ""] },
		{ locations: ["", "", ""], hits: ["", "", ""] }
	],

	fire: function(guess, userId) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);

			if (index >= 0) {
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("HIT!");
				// hitGuesses.push([userId, guess]);
				console.log(hitGuesses);
				if (this.isSunk(ship)) {
					view.displayMessage("You sank my battleship!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("You missed.");
		return false;
	},

	isSunk: function(ship) {
		for (var i = 0; i < this.shipLength; i++)  {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
	    return true;
	},

	generateShipLocations: function() {
		var locations;
		for (var i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
		}
		console.log("Ships array: ");
		console.log(this.ships);
	},

	generateShip: function() {
		var direction = Math.floor(Math.random() * 2);
		var row, col;

		if (direction === 1) { // horizontal
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
		} else { // vertical
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
			col = Math.floor(Math.random() * this.boardSize);
		}

		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},

	collision: function(locations) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	}
	
}; 


// model.fire("53"); // miss
// model.fire("06"); // hit
// model.fire("16"); // hit
// model.fire("26"); // hit
// model.fire("34"); // hit
//model.fire("24"); // hit
// model.fire("44"); // hit
// model.fire("12"); // hit
// model.fire("11"); // hit
// model.fire("10"); // hit



// testing parseGuess
function parseGuess(guess) {
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

	if (guess === null || guess.length !== 2) {
		//alert("Oops, please enter a letter and a number on the board.");
		view.displayMessage("Oops, please enter a letter and a number on the board.");
	} else {
		var row = alphabet.indexOf(guess.charAt(0));
		var column = guess.charAt(1);
		
		if (isNaN(row) || isNaN(column)) {
			//alert("Oops, that isn't on the board.");
			view.displayMessage("Oops, that isn't on the board.");
		} else if (row < 0 || row >= model.boardSize ||
		           column < 0 || column >= model.boardSize) {
			//alert("Oops, that's off the board!");
			view.displayMessage("Oops, that isn't on the board.");
		} else {
			return row + column;
		}
	}
	return null;
}


// console.log("Testing parseGuess");
// console.log(parseGuess("A0"));
// console.log(parseGuess("B6"));
// console.log(parseGuess("G3"));
// console.log(parseGuess("H0")); // invalid
// console.log(parseGuess("A7")); // invalid


// testing the controller

var controller = {
	guesses: 0,

	processGuess: function(guess, userId) {
		var location = parseGuess(guess);
		if (location) {
			this.guesses++;
			var hit = model.fire(location, userId);
			if (hit && model.shipsSunk === model.numShips) {
					view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses" +
					 "</br>A new game will begin in a moment.");
					setTimeout(() => {
						view.displayMessage("New game begins in a moment");
					}, 8000);
					setTimeout(() => {
						document.location.reload();
					}, 8000);
			}else if(hit){
				//post the user recording the hit				
				let addToBoard = true;
				hitGuesses.forEach( guessOut => {
					console.log(guessOut);
					if(guessOut.guess === guess){
						console.log('Alrady guessed ' + guess);
						addToBoard = false;
					}
				});
				if(addToBoard){
					hitGuesses.push({
						userid: userId,
						guess: guess,
					  });
				// 	let url = "https://younow-cors-header.herokuapp.com/?q=" + "https://ynassets.younow.com/user/live/" + 
				// 	userId + "/" + userId + ".jpg";					
				// 	document.getElementById('bannermessage').innerHTML += '<div class="banner-text"><img class="avatar" src="' +
				// url +
				// '" />  ' + guess + ' HIT!!</div>';		
				}
				updateLeaderBoard();
							
			}
		}
	}
}

function updateLeaderBoard() {
	const scores = document.getElementById('bannermessage');
	scores.innerHTML = "";
	scores.innerHTML = hitGuesses.reduce((html, { userid, guess }) => {
		let url = "https://younow-cors-header.herokuapp.com/?q=" + "https://ynassets.younow.com/user/live/" + 
		userid + "/" + userid + ".jpg";					
				// 	document.getElementById('bannermessage').innerHTML += '<div class="banner-text"><img class="avatar" src="' +
				// url +
				// '" />  ' + guess + ' HIT!!</div>';
	  return html + '<div class="banner-text"><img class="avatar" src="' +
	  url +
	  '" />  ' + guess + ' HIT!!</div>';;
	}, "");
  }
function init(){
	FetchBroadcastId();
    model.generateShipLocations();
    view.displayMessage("Let the GAMES begin!");
	
}

document.onload = init();
// You should see three ships on the board, one miss, and the message
// "You sank all my battleships in 10 guesses"
/*
controller.processGuess("A0"); // miss
controller.processGuess("A6"); // hit
controller.processGuess("B6"); // hit
controller.processGuess("C6"); // hit
controller.processGuess("C4"); // hit
controller.processGuess("D4"); // hit
controller.processGuess("E4"); // hit
controller.processGuess("B0"); // hit
controller.processGuess("B1"); // hit
controller.processGuess("B2"); // hit
*/