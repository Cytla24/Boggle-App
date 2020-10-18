import React from 'react';
import logo from './logo.svg';
import './App.css';
import Game from './components/mycomponents';
import Header from './components/layout/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import Words from './components/Words';
import AddWord from './components/AddWord';
import { v4 as uuidv4 } from 'uuid';
import {findAllSolutions} from "./boggle_solver";
import {RandomGrid} from "./random_grid";
import data from "./data.json";
import Axios from 'axios';


class App extends React.Component {

  constructor (props){
    super(props);
    const newGrid = RandomGrid();
    const allWords = {};
    const dict = data[0].words;
    const found = findAllSolutions(newGrid, dict);
    for (var inp of found){
      allWords[inp] = true;
    }

    this.state = {
      grid : newGrid,
      sol: allWords,
      wordsFound : [
        {
          id: uuidv4(),
          title: "hi"
        },
        {
          id: uuidv4(),
          title: "word2"
        },
        {
          id: uuidv4(),
          title: "word3"
        }
      ],
      shouldHide: true
    };

  }

  startGame = (e) => {
    this.setState( {shouldHide : false});
  }

  endGame = (e) => {
    this.setState( {shouldHide : true});
  }

  addWord = (title) => {
    const newWord = {
      id:uuidv4(), 
      title
    }
    // this.setState( {wordsFound : [...this.state.wordsFound, newWord] });
    const inp_title = title;
    if (inp_title in this.state.sol){
      let check = this.state.wordsFound.length;
      for (var ind in this.state.wordsFound){
        if (this.state.wordsFound[ind].title === inp_title){
          break;
        }
        check--;
      }
      if (Number(check) === 0){
        this.setState( {wordsFound : [...this.state.wordsFound, newWord] });
      }else{
        alert("You already entered this word!");
      }
    }else{
      alert("Word doesn't exist");
    }
  }

  render(){
    return (
      <div className="App">
        <Header />
        <>
          <Button variant="primary" onClick={this.startGame}>Start!</Button>{' '}
          <Button variant="danger" onClick={this.endGame}>Stop!</Button>
        </>
        <header className="App-header">
          <div className={this.state.shouldHide ? 'hidden' : ''}>
            <Game grids={this.state.grid}/>
          </div>
          <div>
            <AddWord addWord={this.addWord}/>
            <h4>Words Found</h4>
            <Words words={this.state.wordsFound}/>
          </div>
        </header>

      </div>
    );
  }
  
}

export default App;
