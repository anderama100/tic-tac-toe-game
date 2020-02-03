// JavaScript Document
(function() {

  //Initializing variables, capturing event start
  var game;
  var startBtn = document.getElementById('restartButton');
  var cntner = document.querySelector('.ttt');
  var gameSt = document.getElementById('gameState');

  startBtn.addEventListener('click', restart);
  cntner.addEventListener('click', ClkTry);

  function TTT() {
    //starting game
    this.outcomes = null;
    this.state = 'playing'; 
    this.player = 'X';
    this.round = 0;
    this.strct = [
      [ null, null, null],
      [ null, null, null],
      [ null, null, null],
    ];
  }

    function ClkTry(event) {
      //Function for click event
    var obj = event.target;
    var inset = obj.dataset;


    if ( inset && inset.row ) {

      var outcome = game.input(inset.row, inset.column);

      if (outcome) {
        if (outcome.game === 'Won') {
          gameSt.innerHTML = 'Player ' + outcome.player + ' Wins!!!!';
        }

        if (outcome.game === 'Tie') {
          gameSt.innerHTML = 'Tie Game';
        }
      }
      render(game.output());
    }
  }

  TTT.prototype.input = function (row, column) {
    //checks input

    if (this.getState() === 'Over') {
      return this.getOutcome();
    }

    if (this.setValue(row, column)) {
      if (this.checkGame(row, column)) {
        this.setState('Over');
        this.setOutcome({
          player: this.player,
          game: 'Won'
        });
        return this.getOutcome();
      } else {
        this.SwitchPlayer();      
      }

      this.round++;
      if (this.round === 9) {
        this.setState('Over');
        this.setOutcome({
          game: 'Tie'
        });

        return this.getOutcome();
      }
    }
    return this.getOutcome();
  };


//getters & setters
  TTT.prototype.setState = function (state) {
    this.state = state;  
  };

  TTT.prototype.getState = function (state) {
    return this.state;
  };

  TTT.prototype.setOutcome = function (outcomes) {
    this.outcomes = outcomes;
  };

  TTT.prototype.getOutcome = function () { 
    return this.outcomes;
  };

  TTT.prototype.checkGame = function (row, column) {
    //checking game
    var strct = this.strct;
    var symbol = this.player;
    var inspect = [
      checkRow(strct, row, symbol),
      checkColumn(strct, column, symbol),
      checkDiagonal(strct, symbol),
      checkDiagonal2(strct, symbol)
    ];

    return inspect.reduce(function (acc, check) { 
      return acc + check;
    }, false);



    function checkRow(strct, row, symbol) {
      var row = strct[row];
      var length = row.length;
      for (var i = 0; i < length; i++) {
        var cell = row[i];
        if (cell !== symbol) {
          return false;
        }
      }
      return true;
    }

    function checkColumn(strct, column, symbol) {
      var length = strct.length;
      for (var i = 0; i < length; i++) {
        var cell = strct[i][column];
        if (cell !== symbol) {
          return false;
        }
      }
      return true;
    }

    function checkDiagonal(strct, symbol) {

      var length = strct.length;
      for (var i = 0; i < length; i++) {
        var cell = strct[i][i];
        if (cell !== symbol) {
          return false;
        }
      }
      return true;
    }

    function checkDiagonal2(strct, symbol) {

      var length = strct.length;
      for (var i = 0, j = length -1; i < length; i++) {
        var cell = strct[i][j];
        if (cell !== symbol) {
          return false;
        }
        j--;
      }
      return true;
    }
  };

  TTT.prototype.setValue = function (row, column) {
    var strct = this.strct;
    if (strct[row][column] === null) {
      strct[row][column] = this.player;    
      return true;
    }
    return false;
  };

  TTT.prototype.SwitchPlayer = function () {
    this.player = this.player === 'X' ? 'O' : 'X';
  };

  TTT.prototype.output = function () {
    return this.strct;
  };
  
  function render(strct) {
    //Returns cell index
    var values = strct.reduce(function(array, row, rowIndex) {
      return array.concat(row.map(function (cell, cellIndex) {
        return {
          value: cell,
          id: 'cell-' + rowIndex + '-' + cellIndex
        };
      }));
    }, []);

    values.forEach(function(cell){
      
      var cellElement = document.getElementById(cell.id);
      cellElement.innerHTML = cell.value !== null ? cell.value : '';
    });
  }
  
  function restart() {
    // starting & rendering

    game = new TTT();
    render(game.output());
    gameSt.innerHTML = 'Playing';
  }




  restart();
}());
