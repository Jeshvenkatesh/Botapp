import React from 'react';
import DatatablePage from "./DataTable";
import classes from "./ExchangeTable.module.css";
import { withRouter } from 'react-router-dom';

class ExchangeTable extends React.Component {

    state={
        currentUser:this.props.currentUser,
        userName:this.props.userName,
        userId:this.props.userId,
    }

    handleAddExchange=()=>{
        this.props.history.push('/Exchange');
    }
    render(){
        return(
            <div>
                <div className={classes.searchSection}>
                <button type="button"  onClick={this.handleAddExchange}>Add Exchange</button>
                </div>
                <DatatablePage currentUser={this.state.currentUser} userId={this.state.userId} userName={this.state.userName}/>
            </div>
        )
    }
}
export default withRouter(ExchangeTable);