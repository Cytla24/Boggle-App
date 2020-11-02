import React from 'react';
import logo from './logo.svg';
import './App.css';
import Game from './components/mycomponents';
import Header from './components/layout/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Spinner, Button } from 'react-bootstrap';
import Words from './components/Words';
import AddWord from './components/AddWord';
import { v4 as uuidv4 } from 'uuid';
import {findAllSolutions} from "./boggle_solver";
import {RandomGrid} from "./random_grid";
import data from "./data.json";
import TextLoop from "react-text-loop";  
import ShowAll from './components/ShowAll';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyDORrA3RQFRDSyxABlLorVZW-IXG-6rHtA",
  authDomain: "boggle-solveur.firebaseapp.com",
  databaseURL: "https://boggle-solveur.firebaseio.com",
  projectId: "boggle-solveur",
  storageBucket: "boggle-solveur.appspot.com",
  messagingSenderId: "400172083802",
  appId: "1:400172083802:web:d930081ca9894b93764663",
  measurementId: "G-PQ0ZC9H6YL"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

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
      grid : {
        grid1:found,
        grid2:found,
        grid3:found
      },
      solArr: {
        grid1:found,
        grid2:[],
        grid3:[]
      },
      sol: {
        grid1:allWords,
        grid2:[],
        grid3:[]
      },
      highScores: {
        grid1:[0,''],
        grid2:[0,''],
        grid3:[0,'']
      },
      wordsFound : [
      ],
      dictionary: data[0].words,
      shouldHide: true,
      isDone:false,
      score:0,
      isSigned:false,
      isLoaded:false,
      currGrid: '',
      firstClick:0,
      shouldLoad:false
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
    var sgrid1 = firestore.collection("grids").doc("3Dd0iarEUhiDGL4LeQ2t");
    var sgrid2 = firestore.collection("grids").doc("FM5WjPTngzOwuYbpdJSx");
    var sgrid3 = firestore.collection("grids").doc("TEC0xceJcfI4S9E1C3vv");

    // console.log(this.state.score, this.state.highScores[this.state.currGrid]);
    if (this.state.score > this.state.highScores[this.state.currGrid][0]){
      // console.log("HI HERE!");
      if (this.state.currGrid === "grid1"){
        sgrid1.update({
          HighScore: this.state.score,
          HighUser: this.getUserName()
        })
      }else if (this.state.currGrid === "grid2"){
        // console.log("HI HERE again!");
        sgrid2.update({
          HighScore: this.state.score,
          HighUser: this.getUserName()
        })
      }else{
        sgrid3.update({
          HighScore: this.state.score,
          HighUser: this.getUserName()
        })
      }
      this.setState( {shouldLoad : true});
    }
    this.setState( {isDone : true});
  }

  addWord = (title) => {
    const newWord = {
      id:uuidv4(), 
      title
    }
    // this.setState( {wordsFound : [...this.state.wordsFound, newWord] });
    const inp_title = title;
    // console.log(this.state.currGrid);
    if (inp_title in this.state.sol[this.state.currGrid]){
      let check = this.state.wordsFound.length;
      for (var ind in this.state.wordsFound){
        if (this.state.wordsFound[ind].title === inp_title){
          break;
        }
        check--;
      }
      if (Number(check) === 0){
        this.setState( {wordsFound : [...this.state.wordsFound, newWord] });
        var temp_score = this.state.score;
        temp_score += Number(title.length);
        this.setState( {score:temp_score} );
        var array = [...this.state.solArr[this.state.currGrid]];
        var index = array.indexOf(title);
        array.splice(index, 1);
        var temp_solArr = this.state.solArr;
        temp_solArr[this.state.currGrid] = array;
        this.setState( { solArr:temp_solArr})

      }else{
        alert("You already entered this word!");
      }
    }else{
      alert("Word doesn't exist");
    }
  }

  signInWithGoogle = () => {   
    // if (!this.state.shouldHide){
    //   window.location.reload(false);
    // }
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
    this.setState({isSigned:true})
  }

  signOut = () => {
    if (firebase.auth().currentUser){
      firebase.auth().signOut();
      this.setState({isSigned:false});
      this.setState({isLoaded:false});
    }
    window.location.reload(false);
  }

  loadPuzzles = () => {
    if (this.state.firstClick == 0 || this.state.shouldLoad){
      firestore.collection("grids").get()
      .then(querySnapshot => {
        const data = querySnapshot.docs.map(doc => doc.data());
        var ind = 0;
        var temp_arr = [data[ind].l1,data[ind].l2,data[ind].l3,data[ind].l4,data[ind].l5];
        ind++;
        var temp_arr2 = [data[ind].l1,data[ind].l2,data[ind].l3,data[ind].l4,data[ind].l5];
        ind++;
        var temp_arr3 = [data[ind].l1,data[ind].l2,data[ind].l3,data[ind].l4,data[ind].l5];
        var temp_dict = {
          grid1: temp_arr, 
          grid2: temp_arr2,
          grid3: temp_arr3
        };
        var temp_HS = {
          grid1: [data[0].HighScore, data[0].HighUser],
          grid2: [data[1].HighScore, data[1].HighUser],
          grid3: [data[2].HighScore, data[2].HighUser]
        };
        this.setState({grid:temp_dict});
        this.setState({highScores:temp_HS});
        // console.log(this.state.solArr)
        // console.log(this.state.highScores);
        // console.log(temp_HS);
        temp_arr = [];
        var temp_arr_dict = [];
        for (var tGrid in this.state.grid){
          var allWords1 = {};
          var found1 = findAllSolutions(this.state.grid[tGrid], this.state.dictionary);
          // console.log(found1);
          for (var inp of found1){
            allWords1[inp] = true;
          }
          temp_arr.push(found1);
          temp_arr_dict.push(allWords1);
        }
        var temp_solarr = {
          grid1: temp_arr[0], 
          grid2: temp_arr[1],
          grid3: temp_arr[2]
        };
        var temp_sol = {
          grid1: temp_arr_dict[0], 
          grid2: temp_arr_dict[1],
          grid3: temp_arr_dict[2]
        };
        this.setState({solArr:temp_solarr});
        this.setState({sol:temp_sol});


        this.setState({isLoaded:true});
        this.setState({shouldHide:false});
        this.setState({shouldLoad:false});
        this.setState({currGrid: ''});
    })
    }else{
      // console.log("llooood");
      this.setState({isLoaded:true});
      this.setState({shouldHide:false});
      this.setState({currGrid: ''});
    }
    
  }

  getUserName = () => {
    if (firebase.auth().currentUser){
      return firebase.auth().currentUser.displayName;
    }
  }

  selectPuzzle = (strGrid) => {
    // console.log(this.state.firstClick, this.state.firstClick % 2, this.state.shouldLoad);
    if (this.state.firstClick % 2 == 0 && !this.state.shouldLoad){
      this.setState( {currGrid:strGrid} );
      this.setState({wordsFound:[]});
      this.setState({score:0});
      var temp_click = this.state.firstClick + 1;
      this.setState({firstClick:temp_click});
    }else{
      this.loadPuzzles();
      var temp_click = this.state.firstClick + 1;
      this.setState({firstClick:temp_click});
      this.setState( {isDone : false});
    }
    // console.log(this.state.currGrid)
  }
  
  // initFirebaseAuth = () =>{
  //   firebase.auth().onAuthStateChanged(authStateObserver);
  // }

  render(){
    return (
      <div className="App">
        <Header />
        <div className={this.state.isSigned ? 'hidden' : ''} style={{paddingTop:"20px"}}>
          <Button variant="outline-secondary" onClick={this.signInWithGoogle}>Sign In With Google</Button>
        </div>
        <div className={this.state.isSigned && ! this.state.isLoaded ? '' : 'hidden'}>
          <div className="grid-st">
            <h1 className="announce" style={{paddingTop:"20px", color:"#fff"}}>
              Welcome {this.getUserName()}
            </h1>
          </div>
          <Button variant="outline-secondary" onClick={this.loadPuzzles}>Load Puzzles!</Button>
        </div>
        <div className={this.state.isLoaded ? '' : 'hidden'}>
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
              <Button variant="danger" onClick={this.endGame}>Stop!</Button>{' '}
              <Button variant="danger" onClick={this.signOut}>Sign Out</Button>
            </>
              <div className={this.state.shouldHide || (this.state.currGrid !== '' && this.state.currGrid !== "grid1") ? 'hidden' : ''}>
                <Game grids={this.state.grid.grid1}/>
                <div style={{paddingTop:"20px", color:"#fff"}}>Current HighScore - {this.state.highScores.grid1[0]} - {this.state.highScores.grid1[1]}</div>
                <Button variant="secondary" onClick={this.selectPuzzle.bind(this,"grid1")}>{this.state.firstClick % 2 == 0 ? 'Select Puzzle 1' :'Load Puzzles'}</Button>
              </div>
              <div className={this.state.shouldHide || (this.state.currGrid !== '' && this.state.currGrid !== "grid2") ? 'hidden' : ''}>
                <Game grids={this.state.grid.grid2}/>
                <div style={{paddingTop:"20px", color:"#fff"}}>Current HighScore - {this.state.highScores.grid2[0]} - {this.state.highScores.grid2[1]}</div>
                <Button variant="secondary" onClick={this.selectPuzzle.bind(this,"grid2")}>{this.state.firstClick % 2 == 0 ? 'Select Puzzle 2' :'Load Puzzles'}</Button>
              </div>
              <div className={this.state.shouldHide || (this.state.currGrid !== '' && this.state.currGrid !== "grid3") ? 'hidden' : ''}>
                <Game grids={this.state.grid.grid3}/>
                <div style={{paddingTop:"20px", color:"#fff"}}>Current HighScore - {this.state.highScores.grid3[0]} - {this.state.highScores.grid3[1]}</div>
                <Button variant="secondary" onClick={this.selectPuzzle.bind(this,"grid3")}>{this.state.firstClick % 2 == 0 ? 'Select Puzzle 3' :'Load Puzzles'}</Button>
              </div>
          </div> 
          <div className={this.state.shouldHide || this.state.currGrid === '' ? 'hidden' : ''}>
                <h1 className="announce" style={{paddingTop:"20px"}}>
                  Slowly Making Boggle Easy!
                </h1>
          </div>     
          <div className={this.state.shouldHide || this.state.currGrid === '' ? 'hidden' : ''}>
            <AddWord addWord={this.addWord}/>
            <h4 className="announce">CurrentScore...</h4>
            <h4 className="announce">{this.state.score} </h4>
            <h4 className="announce">Words Found...</h4>
            <Words words={this.state.wordsFound}/>
            <div className={this.state.isDone ? '' : 'hidden'}>
              <div className={this.state.shouldHide || (this.state.currGrid !== '' && this.state.currGrid !== "grid1") ? 'hidden' : ''}>
              <ShowAll rWords={this.state.solArr.grid1} />
              </div>
              <div className={this.state.shouldHide || (this.state.currGrid !== '' && this.state.currGrid !== "grid2") ? 'hidden' : ''}>
              <ShowAll rWords={this.state.solArr.grid2} />
              </div>
              <div className={this.state.shouldHide || (this.state.currGrid !== '' && this.state.currGrid !== "grid3") ? 'hidden' : ''}>
              <ShowAll rWords={this.state.solArr.grid3} />
              </div>
              
            </div>
          </div>
        </div>

      </div>
    );
  }
  
}

export default App;
