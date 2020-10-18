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
import TextLoop from "react-text-loop";
import ShowAll from './components/ShowAll';


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
      solArr: found,
      sol: allWords,
      wordsFound : [
      ],
      shouldHide: true,
      isDone:false,
    };

  }

  startGame = (e) => {
    if (!this.state.shouldHide){
      window.location.reload(false);
    }
    this.setState( {shouldHide : false});
  }

  endGame = (e) => {
    // this.setState( {shouldHide : true});
    this.setState( {isDone : true});
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
        var array = [...this.state.solArr];
        var index = array.indexOf(title);
        array.splice(index, 1);
        this.setState( { solArr : array})
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
        <div className="grid-st">
          <h1 className="animation">
            Boggle {' '}
            <TextLoop>
              <span>Solver</span>
              <span>Genius</span>
              <span>Algorithms</span>
            </TextLoop>{" "}
          </h1>
          <>
            <Button variant="primary" onClick={this.startGame}>Start!</Button>{' '}
            <Button variant="danger" onClick={this.endGame}>Stop!</Button>
          </>
            <div className={this.state.shouldHide ? 'hidden' : ''}>
              <Game grids={this.state.grid}/>
            </div>
        </div> 
        <div>
              <h1 className="announce" style={{paddingTop:"20px"}}>
                Slowly Making Boggle Easy!
              </h1>
            </div>     
        <div>
          <AddWord addWord={this.addWord}/>
          <h4 className="announce">Words Found...</h4>
          <Words words={this.state.wordsFound}/>
          <div className={this.state.isDone ? '' : 'hidden'}>
            <ShowAll rWords={this.state.solArr} />
          </div>
        </div>

      </div>
    );
  }
  
}

export default App;
