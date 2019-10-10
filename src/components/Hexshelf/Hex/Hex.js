import React from 'react';

// Hex will handle onclick events and passing data held in its context to its sibling
// which will display 

class Hex extends React.Component {
    constructor(props){
        super(props);
        // responsible for passing the clicke event from the hex to data
        this.handleClick = this.handleClick.bind(this);

    }

    handleClick(dataId, clickedId){
        this.props.updateStatefromComponent(dataId, clickedId);
    }

    render() {
            return (
                <div className="hex" data-uid={this.props.setHexData._id} onClick={(id) => this.handleClick(this.props.setHexData._id, this.props.setHexData.orderedId)}>
                        {this.props.setHexData.name}
                </div>
            ); 

    }
}

export default Hex;