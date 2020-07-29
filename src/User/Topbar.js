import React from 'react';
import classes from './Topbar.module.css';
import { Link } from 'react-router-dom';
import logo1 from "../Utilities/logo1.png";

class Topbar extends React.Component {

    state = {
        sidebarShow: false,
        menuItemPos: 0,
        user: this.props.currentUser,
    }
    handleSidebar = () => {
        this.setState({ sidebarShow: !this.state.sidebarShow })
    }
    render() {
        return (
            <div>
                <div className={classes.botsalogo_topbar}>
                    <div className={classes.botsalgo_logoSection}>
                        <h3>Dashboard(freelance project)</h3>
                        {/* <img src={logo1} /> */}
                    </div>
                    <p>{this.props.userName}</p>

                    {
                        this.props.LoginStatus === false ? <div className={classes.topbarBtnSWrapper}> <button onClick={this.props.handleLoginFormShow}>Login</button> <button onClick={this.props.handleSigUpFormShow}>SignUp</button></div>
                            :

                            <div className={classes.botalogo_menuItems}>
                                <div className={classes.menuItemSub}>
                                    <div >
                                        <Link to={'/'}><p className={classes.link} >Home <div className={classes.underline}></div></p></Link>

                                    </div>
                                    
                                    {
                                        this.props.currentUser === "Admin" ?

                                            <div className={classes.menuItem}>
                                                <p>Master</p>
                                                <ul className={classes.dropdown}>

                                                    <li>
                                                        <div>
                                                            <Link to={"/Client"} ><p className={classes.link} >Clients<div className={classes.underline}></div></p></Link>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div>
                                                            <Link to={"/ExchangeTable"} ><p className={classes.link} >Exchanges <div className={classes.underlineExe}></div></p></Link>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>

                                            : null
                                    }
                                     {
                                        this.props.currentUser === "Client" ?

                                            <div className={classes.menuItem}>
                                                <p>Master</p>
                                                <ul className={classes.dropdown}>
                                                    <li>
                                                        <div>
                                                            <Link to={"/ExchangeTable"} ><p className={classes.link} >Exchanges <div className={classes.underlineExe}></div></p></Link>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                            : null
                                    }
                                    <div className={classes.menuItem}>
                                        <p>Transactions</p>
                                        <ul className={classes.dropdown}>
                                            <li> <div>
                                                <Link to={"/ManualTra"} ><p className={classes.link} >Manual Trade <div className={classes.underlineExe}></div></p></Link>
                                            </div></li>
                                            <li> <div>
                                                <Link to={"/OpenTra"}  ><p className={classes.link} >View Open Transaction<div className={classes.underlineExe}></div></p></Link>
                                            </div></li>
                                        </ul>
                                    </div>
                                    <div className={classes.menuItem}>
                                        <p>Reports</p>
                                        <ul className={classes.dropdown}>
                                            <li>
                                                <div>
                                                    <Link to={"/TotalVolume"} style={{ color: 'inherit', textDecoration: 'inherit' }}><p className={classes.link} >Total Volume<div className={classes.underlineExe}></div></p></Link>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div>
                                    <Link to={"/Login"} style={{ color: 'inherit', textDecoration: 'inherit' }}
                                        onClick={this.props.handleLogoutStatus}> <p className={classes.link}>Logout <div className={classes.underlineLog}></div> </p></Link>
                                </div>
                            </div>
                    }
                </div>
                <div className={classes.sideBarIcons} onClick={this.handleSidebar}>
                    <i className="fas fa-bars" />
                </div>
                {
                    this.state.sidebarShow === false ? null :
                        <div>
                            <div className={classes.sidebarSubSection} onClick={this.handleSidebar}>
                            </div>
                            <div className={classes.sidebarWrapper}>
                                <Link to={'/'} style={{ color: 'inherit', textDecoration: 'inherit' }}><p>Home</p></Link>
                                <Link to={"/Client"} style={{ color: 'inherit', textDecoration: 'inherit' }}><p>Client</p></Link>
                                <Link to={"/Exchange"} style={{ color: 'inherit', textDecoration: 'inherit' }}><p>Exchange</p></Link>
                            </div>
                        </div>
                }
            </div>
        )
    }
}

export default Topbar;