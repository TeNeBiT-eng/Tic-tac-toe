(function Game() {
    // Elements
    var game = document.getElementById('game');
    var boxes = document.querySelectorAll('li');
    var resetGame = document.getElementById('reset-game');
    var turnDisplay = document.getElementById('whos-turn');
    var gameMessages = document.getElementById('game-messages');
    var playerOneScoreCard = document.getElementById('player-one-score');
    var playerTwoScoreCard = document.getElementById('player-two-score');
    
    // Vars
    var context = { 'player1' : 'x', 'player2' : 'o' };
    var board = [];
    
    var playerOneScore = 0;
    var playerTwoScore = 0;
    
    var turns;
    var currentContext;
    
    // Constructor
    var init = function() {
        turns = 0;
        
        // Get current context
        currentContext = computeContext();
        
        // Setup 3 x 3 board 
        board[0] = new Array(3);
        board[1] = new Array(3);
        board[2] = new Array(3);
        
        // bind events
        for(var i = 0; i < boxes.length; i++) {
            boxes[i].addEventListener('click', clickHandler, false);
        }
        
        resetGame.addEventListener('click', resetGameHandler, false);
    }
    
    //Keeps track of player's turn
    var computeContext = function() {
        return (turns % 2 == 0) ? context.player1 : context.player2;
    }
    
    // Bind the dom element to the click callback
    var clickHandler = function() {
        this.removeEventListener('click', clickHandler);
        
        this.className = currentContext;
        this.innerHTML = currentContext;
        
        var pos = this.getAttribute('data-pos').split(',');
        board[pos[0]][pos[1]] = computeContext() == 'x' ? 1 : 0;
        
        if(checkStatus()) {
            gameWon();
        }
        
        turns++;
        currentContext = computeContext();
        turnDisplay.className = currentContext;
    }
    
    
    // Check to see if player has won
    var checkStatus = function() {
        var used_boxes = 0;
        
        for(var rows = 0; rows < board.length; rows++ ) {
            var row_total = 0;
            var column_total = 0;
            
            for(var columns = 0; columns < board[rows].length; columns++) {
                row_total += board[rows][columns];
                column_total += board[columns][rows];
                
                if(typeof board[rows][columns] !== "undefined") {
                    used_boxes++;
                }
            }
            
            // Winning combination for diagonal scenario [0,4,8], [2,4,6]
            var diagonal_tl_br = board[0][0] + board[1][1] + board[2][2]; // diagonal top left to bottom right
            var diagonal_tr_bl = board[0][2] + board[1][1] + board[2][0]; // diagonal top right bottom left
            
            if(diagonal_tl_br == 0 || diagonal_tr_bl == 0 || diagonal_tl_br == 3 || diagonal_tr_bl == 3) {
                return true;
            }
            
            // Winning combination for row [0,1,2], [3,4,5], [6,7,8]
            // Winning combination for column [0,3,6], [1,4,7], [2,5,8]
            // Only way to win is if the total is 0 or if the total is 3. X are worth 1 point and O are worth 0 points
            if(row_total == 0 || column_total == 0 || row_total == 3 || column_total == 3) {
                return true;
            }
            
            // if all boxes are full - Draw!!!
            if(used_boxes == 9) {
                gameDraw();
            }
        }
    }
    var gameWon = function() {
        clearEvents();
        
        // show game won message
        gameMessages.className = 'player-' + computeContext() + '-win';
        
        // update the player score
        switch(computeContext()) {
            case 'x':
                playerOneScoreCard.innerHTML = ++playerOneScore;
                break;
            case 'o':
                playerTwoScoreCard.innerHTML = ++playerTwoScore;
        }
    }
    // Tells user when game is a draw.
    var gameDraw = function() {
        gameMessages.className = 'draw';
        clearEvents();
    }
    
    // Stops user from clicking empty cells after game is over
    var clearEvents = function() {
        for(var i = 0; i < boxes.length; i++) {
            boxes[i].removeEventListener('click', clickHandler);
        }
    }
    // Reset game to play again
    var resetGameHandler = function() {
        clearEvents();
        init();
        
        // Go over all the li nodes and remove className of either x,o
        // clear out innerHTML
        for(var i = 0; i < boxes.length; i++) {
            boxes[i].className = '';
            boxes[i].innerHTML = '';
        }
        
        // Change Who's turn class back to player1
        turnDisplay.className = currentContext;
        gameMessages.className = '';
    }
    
    game && init();
})();
























// window.addEventListener("DOMContentLoaded", () => {
//   const tiles = Array.from(document.querySelectorAll("tile"));
//   const playerDisplay = document.querySelector(".display-player");
//   const resetButton = document.querySelector("#reset");
//   const announcer = document.querySelector(".announcer");

//   let board = ['', '', '', '', '', '', '', '', ''];
//   let currentPlayer = "X";
//   let isGameActive = true;

//   const PLAYERX_WON = "PLAYERX_WON";
//   const PLAYERO_WON = "PLAYERO_WON";
//   const TIE = "TIE";

//   /*    
//         Indexes within the board
//         [0] [1] [2]
//         [3] [4] [5]
//         [6] [7] [8]
//     */

//   const winningConditions = [
//     [0, 1, 2],
//     [3, 4, 5],
//     [6, 7, 8],
//     [0, 3, 6],
//     [1, 4, 7],
//     [2, 5, 8],
//     [0, 4, 8],
//     [2, 4, 6]
//   ];

//   function handleResultValidation() {
//     let roundWon = false;
//     for (let i = 0; i <= 7; i++) {
//       const winCondition = winningConditions[i];
//       const a = board[winCondition[0]];
//       const b = board[winCondition[1]];
//       const c = board[winCondition[2]];
//       if (a === "" || b === "" || c === "") {
//         continue;
//       }
//       if (a === b && a === c) {
//         roundWon = true;
//         break;
//       }
//     }

//     if (roundWon) {
//       announce(currentPlayer === "X" ? PLAYERX_WON : PLAYERO_WON);
//       isGameActive = false;
//       return;
//     }
//     if (!board.includes("")) announce("TIE");
//   }

//   tiles.forEach((tile, index) => {
//     tile.addEventListener("click", () => userAction(tile, index));
//   });

//   const announce = (type) => {
//     switch (type) {
//       case PLAYERO_WON:
//         announcer.innerHTML = `Player <span class='PlayerO'>O</span> Won`;
//         break;
//       case PLAYERX_WON:
//         announcer.innerHTML = `Player <span class='PlayerX'>X</span> Won`;
//         break;
//       case TIE:
//         announcer.innerText = "It's A Tie";
//     }
//     announcer.classList.remove("hide");
//   };

//   const isValidAction = (tile) => {
//     if (tile.innerText === 'X' || tile.innerText === 'O') {
//         return false;
//     }
//     return true;
//   };

//   const updateBoard = (index) => {
//     board[index] = currentPlayer;
//   }

//   const changePlayer = () => {
//     playerDisplay.classList.remove(`player${currentPlayer}`);
//     currentPlayer = currentPlayer === "X" ? "O" : "X";
//     playerDisplay.innerText = currentPlayer;
//     playerDisplay.classList.add(`player${currentPlayer}`);
//   };

//   // This block of code represents a players turn in the game
//   const userAction = (tile, index) => {
//     if (isValidAction(tile) && isGameActive) {
//       tile.innerText = currentPlayer;
//       tile.classList.add(`player${currentPlayer}`);
//       updateBoard(index);
//       handleResultValidation();
//       changePlayer();
//     }
//   };

//   const resetBoard = () => {
//     board = ['', '', '', '', '', '', '', '', ''];
//     isGameActive = true;
//     announcer.classList.add('hide');

//     if (currentPlayer === 'O') {
//         changePlayer();
//     }

//     tiles.forEach(tile => {
//         tile.innerText = '';
//         tile.classList.remove(`PlayerX`);
//         tile.classList.remove(`PlayerO`);
//     });
//   }

//   resetButton.addEventListener("click", resetBoard);
// });
