import React from "react";
import classes from './Loader.module.css';
import logo from "./logo1.png";

class Loader extends React.Component{

    render(){
        return(
            <div className={classes.loaderTwo}>
            <div className={classes.loaderOne}>
                <div className={classes.loader}>
                     {/* <img src={logo} /> */}
                </div>
            </div>
            </div>
            // <div className={[classes.logoWrapper,classes.feedTwo].join(' ')}>
            //     <img src={logo} />
            // </div>

        )
    }
}
export default Loader;