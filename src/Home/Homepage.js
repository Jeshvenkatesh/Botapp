import React from 'react';
import DatatablePage from "./DataTable";

class HomePage extends React.Component {

    state={
        currentUser:this.props.currentUser,
        userName:this.props.userName,
        userId:this.props.userId,
    }

    render(){
        return(
            <div>
                <DatatablePage currentUser={this.state.currentUser} userId={this.state.userId} userName={this.state.userName}/>
            </div>
        )
    }
}
export default HomePage;
