/* Globals */
var NUM_ROWS = 3,
  	NUM_COLS = 3,
  	NUM_SQUARES = NUM_ROWS * NUM_COLS,
  	GAMEBOARD = new Array(NUM_SQUARES),
    WIN_COMBOS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],
                  [1,4,7],[2,5,8],[0,4,8],[2,4,6]],
  	MAX_DEPTH,
  	AI_MOVE,
    PLAYER_CLASS = 'cross',
    COMPUTER_CLASS = 'nought',
    RUNNING = false;

$(document).ready(function() {
	/* Start a new game */
	new_game();

  /* Settings cog clicked, show the settings menu */
  $(".board__settings-cog").click(function() {
    if ($(".board__settings").css('visibility') == 'hidden') {
      $(".board__settings").css('visibility', 'visible');
    } else {
      $(".board__settings").css('visibility', 'hidden');
    }
  });

  /* Player class has been switched from the settings menu */
  $(".board__settings__choice-cross").click(function() {
    PLAYER_CLASS = 'cross';
    COMPUTER_CLASS = 'nought';
    $(".board__settings").css('visibility', 'hidden');
    console.log('set class to cross');
  });

  $(".board__settings__choice-nought").click(function() {
    PLAYER_CLASS = 'nought';
    COMPUTER_CLASS = 'cross';
    $(".board__settings").css('visibility', 'hidden');
  });

  /* Difficulty selected */
  $("div[class*=board__difficulty__button]").click(function() {
    var difficulty = $(this).attr("id");

    if (difficulty === 'easy') MAX_DEPTH = 1;
    else if (difficulty === 'medium') MAX_DEPTH = 3;
    else MAX_DEPTH = 6;

    $(".board__difficulty").removeClass('slideDown').addClass('slideUp');
    new_game();

  });

	/* Process a square being clicked */
  $(".board__slot").click(function() {
    if (RUNNING) {
  		var pos = Number($(this).attr("id"));

  		/* If the square is empty, process the click */
  		if (GAMEBOARD[pos] == "") {
  			$(this).addClass(PLAYER_CLASS + ' player-color');
  			GAMEBOARD[pos] = "X";

  			if (full(GAMEBOARD)) {
          RUNNING = false;
  				$(".board__header-difficulty").html("It's a tie!");
          $(".board__difficulty").removeClass('slideUp').addClass('slideDown');
  			} else if (wins(GAMEBOARD, "X")) {
          RUNNING = false;
  				$(".board__header-difficulty").html("You win!");
          $(".board__difficulty").removeClass('slideUp').addClass('slideDown');
  			} else {
  				minimax(GAMEBOARD, "O", 0);
  				GAMEBOARD[AI_MOVE] = "O";
  				$(".board__slot[id=" + AI_MOVE + "]").addClass(COMPUTER_CLASS + ' computer-color');

  				if (wins(GAMEBOARD, "O")) {
            RUNNING = false;
  					$(".board__header-difficulty").html("You lost!");
            $(".board__difficulty").removeClass('slideUp').addClass('slideDown');
  				}
  			}
  		}
    }
	});
});

/* Starts a new game */
function new_game() {
	/* Clear the table */
	$(".board__slot").each(function() {
		$(this).removeClass(PLAYER_CLASS + ' player-color computer-color ' + COMPUTER_CLASS);
	});

	/* Clear the gameboard */
	for (var i = 0; i < NUM_SQUARES; i++) {
		GAMEBOARD[i] = "";
	}

  RUNNING = true;
}

/* For a given state of the board, returns all the available moves */
function get_available_moves(state) {
	var all_moves = Array.apply(null, {length: NUM_SQUARES}).map(Number.call, Number);
	return all_moves.filter(function(i) { return state[i] == ""; });
}

/* Given a state of the board, returns true if the board is full */
function full(state) {
	return !get_available_moves(state).length;
}

/* Given a state of the board, returns true if the specified player has won */
function wins(state, player) {
	var win;

	for (var i = 0; i < WIN_COMBOS.length; i++) {
		win = true;
		for (var j = 0; j < WIN_COMBOS[i].length; j++) {
			if (state[WIN_COMBOS[i][j]] != player) {
				win = false;
			}
		}
		if (win) {
			return true;
		}
	}
	return false;
}

/* Given a state of the board, returns true if the board is full or a player has won */
function terminal(state) {
	return full(state) || wins(state, "X") || wins(state, "O");
}

/* Returns the value of a state of the board */
function score(state) {
	if (wins(state, "X")) {
		return 10;
	} else if (wins(state, "O")) {
		return -10;
	} else {
		return 0;
	}
}

/* Finds the optimal decision for the AI */
function minimax(state, player, depth) {
	if (depth >= MAX_DEPTH || terminal(state)) {
		return score(state);
	}

	var max_score,
		min_score,
		scores = [],
		moves = [],
		opponent = (player == "X") ? "O" : "X",
		successors = get_available_moves(state);

	for (var s in successors) {
		var possible_state = state;
		possible_state[successors[s]] = player;
		scores.push(minimax(possible_state, opponent, depth + 1));
		possible_state[successors[s]] = "";
		moves.push(successors[s]);
	}

	if (player == "X") {
		AI_MOVE = moves[0];
		max_score = scores[0];
		for (var s in scores) {
			if (scores[s] > max_score) {
				max_score = scores[s];
				AI_MOVE = moves[s];
			}
		}
		return max_score;
	} else {
		AI_MOVE = moves[0];
		min_score = scores[0];
		for (var s in scores) {
			if (scores[s] < min_score) {
				min_score = scores[s];
				AI_MOVE = moves[s];
			}
		}
		return min_score;
	}
}
