// JavaScript Document
(function() {

  //Initializing variables, capturing event start
  var game;
  var startBtn = document.getElementById('startButton');
  var cntner = document.querySelector('.ttt');
  var gameSt = document.getElementById('gameState');

  startBtn.addEventListener('click', start);
  cntner.addEventListener('click', onCellClick);

  function TTT() {
    //starting game
    this.results = null;
    this.state = 'playing'; 
    this.player = 'X';
    this.round = 0;
    this.matrix = [
      [ null, null, null],
      [ null, null, null],
      [ null, null, null],
    ];
  }

    function onCellClick(event) {
      //Function for click event
    var target = event.target;
    var dataset = target.dataset;


    if ( dataset && dataset.row ) {

      var results = game.input(dataset.row, dataset.column);

      if (results) {
        if (results.game === 'Won') {
          gameSt.innerHTML = 'Player ' + results.player + ' Wins!!!!';
        }

        if (results.game === 'Tie') {
          gameSt.innerHTML = 'Tie Game';
        }
      }
      render(game.output());
    }
  }

  TTT.prototype.input = function (row, column) {
    //checks input

    if (this.getState() === 'Over') {
      return this.getResults();
    }

    if (this.setValue(row, column)) {
      if (this.checkGame(row, column)) {
        this.setState('Over');
        this.setResults({
          player: this.player,
          game: 'Won'
        });
        return this.getResults();
      } else {
        this.togglePlayer();      
      }

      this.round++;
      if (this.round === 9) {
        this.setState('Over');
        this.setResults({
          game: 'Tie'
        });

        return this.getResults();
      }
    }
    return this.getResults();
  };


//getters & setters
  TTT.prototype.setState = function (state) {
    this.state = state;  
  };

  TTT.prototype.getState = function (state) {
    return this.state;
  };

  TTT.prototype.setResults = function (results) {
    this.results = results;
  };

  TTT.prototype.getResults = function () { 
    return this.results;
  };

  TTT.prototype.checkGame = function (row, column) {
    //checking game
    var matrix = this.matrix;
    var symbol = this.player;
    var checks = [
      checkRow(matrix, row, symbol),
      checkColumn(matrix, column, symbol),
      checkDiagonal(matrix, symbol),
      checkAntiDiagonal(matrix, symbol)
    ];

    return checks.reduce(function (acc, check) { 
      return acc + check;
    }, false);



    function checkRow(matrix, row, symbol) {
      var row = matrix[row];
      var length = row.length;
      for (var i = 0; i < length; i++) {
        var cell = row[i];
        if (cell !== symbol) {
          return false;
        }
      }
      return true;
    }

    function checkColumn(matrix, column, symbol) {
      var length = matrix.length;
      for (var i = 0; i < length; i++) {
        var cell = matrix[i][column];
        if (cell !== symbol) {
          return false;
        }
      }
      return true;
    }

    function checkDiagonal(matrix, symbol) {

      var length = matrix.length;
      for (var i = 0; i < length; i++) {
        var cell = matrix[i][i];
        if (cell !== symbol) {
          return false;
        }
      }
      return true;
    }

    function checkAntiDiagonal(matrix, symbol) {

      var length = matrix.length;
      for (var i = 0, j = length -1; i < length; i++) {
        var cell = matrix[i][j];
        if (cell !== symbol) {
          return false;
        }
        j--;
      }
      return true;
    }
  };

  TTT.prototype.setValue = function (row, column) {
    var matrix = this.matrix;
    if (matrix[row][column] === null) {
      matrix[row][column] = this.player;    
      return true;
    }
    return false;
  };

  TTT.prototype.togglePlayer = function () {
    this.player = this.player === 'X' ? 'O' : 'X';
  };

  TTT.prototype.output = function () {
    return this.matrix;
  };
  
  function render(matrix) {
    //concats X & O 
    var values = matrix.reduce(function(array, row, rowIndex) {
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
  
  function start() {
    // starting & rendering

    game = new TTT();
    render(game.output());
    gameSt.innerHTML = 'Playing';
  }




  start();
}());

