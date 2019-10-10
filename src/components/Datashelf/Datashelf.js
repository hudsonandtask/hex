import React from 'react';


function Datashelf(props) {

        let sData = props.shelfData;
        let sShow = props.showShelf;
        if(sData && sShow === true){
           return (
               <div className="hex-data-shelf">
                    <div className="name">{sData.name}</div>
                    <div className="company">{sData.company}</div>
                    <div>
                        <div className="address">{sData.address}</div> 
                        <div className="address">{sData.about}</div> 
                    </div>
               </div>
           )
        }else {
            return '';
        }

}

export default Datashelf;