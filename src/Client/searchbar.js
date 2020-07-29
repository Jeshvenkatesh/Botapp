import React from 'react';
import classes from "./searchbar.module.css";
import { getCurrentDate } from "../Utilities/CurrentDate";

class PractiseTask extends React.Component {
    state={
        date:getCurrentDate(),
        pro:true,
    }
    datechange=(e)=>{
        const d=e.target.value;
        console.log(e.target.value.slice(8,10));
        const date=e.target.value.slice(8,10);
       const month = d.slice(5,7);
       console.log(month)
       const year = d.slice(0,4);
       console.log(year);
       if(date){
        const correctFormate = date+"/"+ month+"/"+year;
        console.log(correctFormate)
        this.setState({date:correctFormate})
       }
       else{
        this.setState({date:null})
       }
    }
    // mydate=()=>{
    //     this.setState({pro:!this.state.pro})
    // }
    render(){
        return(
            <section className={classes.mainWrapper}>
                    <div className={classes.mainDiv}>
                    <input type="text" className={classes.newDate} value={this.state.date} />
                     {/* {
                        this.state.pro===true? 
                        <input type="date" className={classes.dt} onInput={this.datechange} hidden/>
                        :  */}
                        <input type="date" className={classes.dt} onInput={this.datechange} />
                     
                    </div>
               
            </section>
        )
    }
}
export default PractiseTask;

// onClick={this.mydate}