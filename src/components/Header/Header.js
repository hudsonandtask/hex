import React from 'react';


class Header extends React.Component {
    constructor(props){
        super(props);

        this.loginInfo = this.props.userInfo;
    }

    render() {
        return <div className="header-wrapper gib-bold">Header</div>
    }
}

export default Header;