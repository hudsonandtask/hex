import React from 'react';

import './App.css';

import Header from './components/Header/Header';

import HexShelf from './components/Hexshelf/Hexshelf';  

import DataShelf from './components/Datashelf/Datashelf';  

import hexData from './components/Hexshelf/Hex/HexModel';

class App extends React.Component {
  constructor(props){
    super(props);

    this.updateStatefromComponent = this.updateStatefromComponent.bind(this);
    this.state = {
      shelfData: null,
      showShelf: false
    }
  }
  
  updateStatefromComponent(passedId, toggleDataShelf){
    const searchId = passedId;
    const localData = hexData;
    let showData = toggleDataShelf;

    // Filter objects from Data
    // Based on ID passed by event from HEX
    let renderData = (obj) => {
     return localData.filter((object) => {
        return object._id === searchId
      });
    }; 

    let newData = renderData(localData);

    this.setState((state, props) => {
      return {
        shelfData: newData[0],
        showShelf: showData
      };
    });

  }


  render(){
    return (
      <div className="App">
        <Header />         
        <HexShelf updateStatefromComponent={this.updateStatefromComponent} stateManager={this.stateManager}/> 
        <DataShelf shelfData={this.state.shelfData} showShelf={this.state.showShelf}/> 
      </div>
    );
  }
}

export default App;
