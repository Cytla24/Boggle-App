import React from 'react';
import { Button } from 'react-bootstrap';
import './mycomponent.css';

class Square extends React.Component {

  buttStyle = {

  }

  render() {
    return (
      // <Button variant="info">Info</Button>
      <button className="cell-control">
        {this.props.value}
        {"  "}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square value={i} />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(this.props.rows[0][0])}
          {this.renderSquare(this.props.rows[0][1])}
          {this.renderSquare(this.props.rows[0][2])}
          {this.renderSquare(this.props.rows[0][3])}
          {this.renderSquare(this.props.rows[0][4])}
        </div>
        <div className="board-row">
          {this.renderSquare(this.props.rows[1][0])}
          {this.renderSquare(this.props.rows[1][1])}
          {this.renderSquare(this.props.rows[1][2])}
          {this.renderSquare(this.props.rows[1][3])}
          {this.renderSquare(this.props.rows[1][4])}
        </div>
        <div className="board-row">
          {this.renderSquare(this.props.rows[2][0])}
          {this.renderSquare(this.props.rows[2][1])}
          {this.renderSquare(this.props.rows[2][2])}
          {this.renderSquare(this.props.rows[2][3])}
          {this.renderSquare(this.props.rows[2][4])}
        </div>
        <div className="board-row">
          {this.renderSquare(this.props.rows[3][0])}
          {this.renderSquare(this.props.rows[3][1])}
          {this.renderSquare(this.props.rows[3][2])}
          {this.renderSquare(this.props.rows[3][3])}
          {this.renderSquare(this.props.rows[3][4])}
        </div>
        <div className="board-row">
          {this.renderSquare(this.props.rows[4][0])}
          {this.renderSquare(this.props.rows[4][1])}
          {this.renderSquare(this.props.rows[4][2])}
          {this.renderSquare(this.props.rows[4][3])}
          {this.renderSquare(this.props.rows[4][4])}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
    };
  }

  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      xIsNext: !this.state.xIsNext,
    });
  }
  
  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            rows={this.props.grids}
            onClick={(i) => this.handleClick(i)}
            />
        </div>
      </div>
    );
  }
}


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default Game;