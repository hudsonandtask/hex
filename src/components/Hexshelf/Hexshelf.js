import React from 'react';
import Hex from './Hex/Hex';

import HexData from './Hex/HexModel';

// Hex will handle onclick events and passing data held in its context to its sibling
// which will display 

class HexShelf extends React.Component {
    constructor(props){
        super(props);
        this.updateStatefromComponent = this.updateStatefromComponent.bind(this);


        this.filterConnectionData = this.filterConnectionData.bind(this);
       
        this.hexShelfHandleHexes = this.hexShelfHandleHexes.bind(this);


        this.locatePrime = this.locatePrime.bind(this);

        this.showHexData = false;

        // Locate Prime sub 0 -- this is root user  

        let intialHex = this.locatePrime(0);
        let initialHexArr = [intialHex];
        let markedHex = this.markOrderDomObjects(initialHexArr);

        this.state = {
            hexes:markedHex,
            hexData: HexData,
            hexConnections: null, 
            hexClickPrime:initialHexArr        
        };

    }

    updateStatefromComponent(clickedDataId, clickedOrderId){
        // toggle showHex so the shelf can open/close. 
        // pass up props to app. 
        this.showHexData = !this.showHexData;
        this.props.updateStatefromComponent(clickedDataId, this.showHexData);
        
        this.hexShelfHandleHexes(clickedDataId, clickedOrderId);

    }

    locatePrimeInState(id, order){
        let stateHexes = this.state.hexes;

        let primeHexObj = stateHexes.reduce((acc, currentVal, currentInd, arr)=> {
            let newObj = {...currentVal};

            if(newObj._id === id && newObj.orderedId === order){
                newObj.active = !newObj.active;
                acc.push(newObj);
            }
            return acc;
        }, []);
        

        return primeHexObj;
    }

    hexShelfHandleHexes(passedDataId, passedOrderId){
        let newPrime = this.locatePrimeInState(passedDataId, passedOrderId);
        let connectionArr = this.filterConnectionData(passedDataId);
        
        // debugger;
        let domTree = [];
        let primeArr = [];

        let hexInfo = {
            id:newPrime._id, 
            primeData: newPrime,
            level: passedOrderId, 
            connectionData:connectionArr
        }

        // Collect data for Sorting
        // Call Sorting Method  
        // Pass Sorted Data to HEX Handler 
        
        let hexDom = this.handleDomHexArray(hexInfo);

        this.setState((state, props) => {
            return {
                hexes: hexDom.domObjects,
                hexCachePosition: hexDom.domPosition
            };
        }, () => {
            console.log(this.state);
        });

    }

    locatePrime(id){
        let copyData = HexData;
        let passedId = id;
        const primeData = copyData.filter((object)=>{
            return object._id === passedId;
        });    
        
        return primeData[0];
    }

    filterConnectionData(id){
        let mainDataArr = HexData;
        let newPrime = this.locatePrime(id);
        let connections = newPrime.connections;
        let mainConnectionArr = [];

        mainConnectionArr = mainDataArr.filter((object)=>{
            for (const [index, value] of connections.entries()) {
                if(object._id === value._id){
                    return object;
                };
            }         
        });

        return mainConnectionArr;
    }

    handleDomHexArray(treeData){
        // Take in Passed Prime and Conn
        // Evaluate Active Hexes and Levels
        let hexObjs = treeData; 
        let returnArrays = {
            domPosition: [],
            domObjects: []        
        };


        let primeNode = [];
        let positionArray = [];

        let clickedHexId = treeData.level;

        let inArrayIndex;
        let nodeAndConnection;
        let domType = this.state.hexes;

        nodeAndConnection = [...hexObjs.primeData, ...hexObjs.connectionData];

        if(hexObjs.primeData[0].active == true){
            

            // Locate element in the current dom state 

            // find position in array
            // theres prob a betr way to do this
            // I just need an insertion point
            inArrayIndex = this.grabHexIndex(clickedHexId, domType);
            // i have the node and connection data i need to create the hex in an arry 
            // loop the array and push each one into the array and a specific index splice()
            // delete the node representing the click
            // insert that node and its children 

            let deleteCount = 1;

            for(const[index, value] of nodeAndConnection.entries()){

            
                domType.splice(inArrayIndex, deleteCount, value);

                // find the index of the obj you just pushed
                const spliceIndex = domType.findIndex(obj => obj === value);
                // add that index to an array
                positionArray.push(spliceIndex);


                inArrayIndex = inArrayIndex + 1;
                deleteCount = 0;

            }

            let activesPosition = this.markActivesWithPosition(domType, positionArray, clickedHexId);
            let domObjects = this.markOrderDomObjects(activesPosition);

            returnArrays.domObjects = domObjects;

        }else{
            // Remove the child Nodes 
            // Grab the Position of the node/childs in the hexStateArray
            let cachePosition = this.returnCachePosition(clickedHexId);

            for(const[index, value] of cachePosition.entries()){
                // if you clicked on an obj don't remove it
                if(value == clickedHexId){
                    domType.splice(value, 1, hexObjs.primeData[0]);

                }else{
                      domType.splice(value, 1, null);
                }
            }

            let domObjects = this.markOrderDomObjects(domType);

            returnArrays.domObjects = domObjects;
        }

        return returnArrays;

    }

    returnCachePosition(clickedId){
        let cachedHexes = this.state.hexes;
        let connectionIndexes = [];
        
        // debugger;

        cachedHexes.filter((obj) => {
            if(obj.orderedId == clickedId){
                connectionIndexes = [...obj.connectionIndexes]
            }
        });

        return connectionIndexes;
    }

    markActivesWithPosition(dom, position, clickId){
        let domArray = [...dom];

        // debugger;
        let markedWithPositions = domArray.map((obj) => {
            // debugger;
            if(obj.orderedId == clickId){
                obj.connectionIndexes = position;
            }
            return obj;
        });

        return markedWithPositions;
    }

    markOrderDomObjects(domObjs){
        let domObjects;

        if(domObjs.constructor.toString().indexOf("Array") == -1){
            domObjects = {...domObjs};
            domObjects.orderedId = 0;
        }else{

            domObjects = domObjs.reduce((acc, currVal, currIndex, arr) => {
                if(currVal != null){
                    var returnVal =  {...currVal};

                    returnVal.orderedId = currIndex; 
    
                    acc.push(returnVal);
                }
                return acc;
            }, []);

        }

        return domObjects;
    }

    grabHexIndex(clickedId, hexDomArray){
        let arrayIndex;
        for(const [index, value] of hexDomArray.entries()){
            if(clickedId == value.orderedId){
                arrayIndex = index;
            }
        }
        return arrayIndex;
    }

    handleReactElements(reactHexes){
        let reactHexArray = reactHexes;
        let compareArray = [];
        let copyArray = [];

        // check if array or obj -- if obj push into arrs
        if(reactHexArray.constructor.toString().indexOf("Array") == -1){
            compareArray.push(reactHexArray);
        }else{
            compareArray = reactHexArray;
        }

        for (const [index, value] of compareArray.entries()) {
       
            copyArray.push(<Hex key={index} updateStatefromComponent={this.updateStatefromComponent} locatePrime={this.locatePrime} setHexData={value}/>);
        }      
        
        return copyArray;
    }
    render() {
        let reactElements = this.handleReactElements(this.state.hexes);

        return (
        <div className="hexshelf-wrapper">
                {reactElements}
        </div>
        )
    }
}

export default HexShelf;