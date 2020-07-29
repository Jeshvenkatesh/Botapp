import React from 'react';
import classes from './LoginPage.module.css';
import Axios from 'axios';
import { UserLoginAPI, UserSigninAPI, GetAllClientsAPI } from '.././Utilities/API';

class LoginPage extends React.Component {

    state = {
        loginBtnShow: true,
        validEmail: true,
        validPwd: true,
        showMessage: false,
        showRegisterMessage: false,
        currentUser: "",
        showVerification: false,
        showPwdVerification: false,
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const validEmail = this.state.validEmail;
        const validPwd = this.state.validPwd;
        const currentUser = e.target.email.value;
        this.setState({ currentUser: currentUser });
        this.getClientsData();

        if (validEmail && validPwd) {
            if (this.props.loginFormShow) {
                const LoginData = {
                    email: e.target.email.value,
                    password: e.target.pwd.value,
                }
                const API = UserLoginAPI;
                Axios.post(API, LoginData)
                    .then((response) => {
                        this.props.handleLoginStatus()
                        // this.props.handleMenuItemPos(0);
                    })
                    .catch((err) => {
                        console.log(err)
                        this.setState({ showMessage: true })
                    })
            } else {
                const sigupData = {
                    email: e.target.email.value,
                    password: e.target.pwd.value,
                    name: e.target.username.value
                }
                const signinAPI = UserSigninAPI;
                Axios.post(signinAPI, sigupData)
                    .then((response) => {
                        this.setState({ showRegisterMessage: true });
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                e.target.reset()
            }
        } else {
            alert("Please Enter valid details")
        }
    }

    handlePwdVerification = (e) => {
        e.preventDefault();
        // this.props.handleVerificationCode();
    }
    handleVerificationCode = (e) => {
        e.preventDefault();
        this.props.handlesubmitVerificationCode();
    }
    handleshowVerification = () => {
        this.setState({ showVerification: true })
    }
    handleshowPwdVerification = () => {
        this.setState({ showPwdVerification: true })
    }
    onSubmitVerificationCode = (e) => {
        e.preventDefault();
    }

    getClientsData() {
        const API = GetAllClientsAPI;
        Axios.get(API)
            .then((response) => {
                const getUser = response.data.clients.map((item, pos) => {
                    if (item.email == this.state.currentUser) {
                        const currentUserRole = item.role;
                        const userName = item.client_name;
                        const userId = item.id;
                        this.props.handlecurrentUserRole(currentUserRole, userName, userId);
                    }
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }
    handleloginSection = () => {
        this.setState({ loginBtnShow: !this.state.loginBtnShow })
    }
    handleCancelBtn = () => {
        this.setState({ showPwdVerification: false, showVerification: false });
        this.props.handleForgetPwd();
    }
    handleEmailField = (e) => {
        var fieldEmail = e.target.value;
        var validEmailPattern = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
        var email = fieldEmail.match(validEmailPattern);
        if (email === null) {
            this.setState({ validEmail: false })
        } else {
            this.setState({ validEmail: true })
        }
    }
    handlePwdField = (e) => {
        var fieldPwd = e.target.value;
        var validPwdPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        var pwd = fieldPwd.match(validPwdPattern);
        if (pwd === null) {
            this.setState({ validPwd: false })
        } else {
            this.setState({ validPwd: true })
        }
    }
    render() {
        return (
            <div>
                <div>
                    {
                        this.props.showForgotPwd === true ?
                            <div>
                                {
                                    this.props.loginFormShow === true ?
                                        <div className={classes.loginForm} >
                                            <div className={classes.loginFormHeading}>
                                                <p>Login</p>
                                                <i className="fas fa-user-lock"></i>
                                            </div>
                                            {this.state.showMessage === true ? <p style={{ color: "red" }}>Invalid credentials, could not log you in</p> : null}
                                            <form onSubmit={this.handleSubmit}>
                                                <div>
                                                    <p>Email Address : </p>
                                                    <input type="email" name="email" placeholder="Email Address" required onInput={this.handleEmailField} />
                                                    {
                                                        this.state.validEmail === true ? null :
                                                            <div className={classes.errorMessage}>
                                                                <p>Please Enter Valid Email</p>
                                                            </div>
                                                    }
                                                </div>
                                                <div>
                                                    <p>Password : </p>
                                                    <input type="password" name="pwd" placeholder="Password" required onChange={this.handlePwdField} />
                                                    {
                                                        this.state.validPwd === true ? null :
                                                            <div className={classes.errorMessage}>
                                                                <p>Minimum eight characters, at least one letter, one number and one special character</p>
                                                            </div>
                                                    }
                                                </div>
                                                <div className={classes.loginBtnWrapper}>
                                                    <button type="submit" >Login</button>
                                                    <div>
                                                        <span onClick={this.props.handleSigUpFormShow}><b>Or Create Account</b></span>
                                                    </div>
                                                    <div>
                                                        <span onClick={this.props.handleForgetPwd}><b>Or Forgot Password</b></span>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                        :
                                        <section className={classes.signupWrapper}>
                                            <div className={classes.loginForm} >
                                                <div>
                                                    <div className={classes.loginFormHeading}>
                                                        <p>Register</p>
                                                        <i className="fas fa-user-lock"></i>
                                                    </div>
                                                    {this.state.showRegisterMessage === true ? <p style={{ color: "green" }}>Your registration is in progress. Please contact admin.</p> : null}
                                                    <form onSubmit={this.handleSubmit}>
                                                        <div>
                                                            <p>Name : </p>
                                                            <input type="text" name="username" placeholder="Name" required />
                                                        </div>
                                                        <div>
                                                            <p>Email Address : </p>
                                                            <input type="email" name="email" placeholder="Email Address" required onInput={this.handleEmailField} />
                                                            {
                                                                this.state.validEmail === true ? null :
                                                                    <div className={classes.errorMessage}>
                                                                        <p>Please Enter Valid Email</p>
                                                                    </div>
                                                            }
                                                        </div>
                                                        <div>
                                                            <p>Password : </p>
                                                            <input type="password" name="pwd" placeholder="Password" required onChange={this.handlePwdField} />
                                                            {
                                                                this.state.validPwd === true ? null :
                                                                    <div className={classes.errorMessage}>
                                                                        <p>Minimum eight characters, at least one letter, one number and one special character</p>
                                                                    </div>
                                                            }
                                                        </div>
                                                        <div className={classes.loginBtnWrapper}>
                                                            <button type="submit" >SignUp</button>
                                                            <div>
                                                                <span onClick={this.props.handleLoginFormShow} ><b>Or Login</b></span>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </section>
                                }
                            </div>
                            :
                            <div className={classes.forgotForm}>
                                <form onSubmit={this.handlePwdVerification}>
                                    <div className={classes.emailForm}>
                                        <b><span>Email:</span></b>
                                        <input type="email" />
                                        <button type="submit" onClick={this.handleshowVerification}>Get Verification Code</button>
                                    </div>
                                </form>
                                {
                                    this.state.showVerification === true ?
                                        <form onSubmit={this.onSubmitVerificationCode}>
                                            <br />
                                            <div className={classes.emailForm}>
                                                <b><span>Verification Code:</span></b>
                                                <input type="text" />
                                                <button type="submit" onClick={this.handleshowPwdVerification}>Verify</button>
                                            </div>
                                        </form>
                                        :
                                        null
                                }
                                <br />
                                {
                                    this.state.showPwdVerification === true ?
                                        <form>
                                            <div className={classes.emailForm}>
                                                <b><span>Password:</span></b>
                                                <input type="password" />
                                            </div>
                                            <div className={classes.emailForm}>
                                                <b><span>Confirm Password:</span></b>
                                                <input type="password" />
                                            </div>
                                            <div className={classes.emailForm}>
                                                <button type="submit">Reset Password</button>
                                                <button type="button" onClick={this.handleCancelBtn}>Cancel</button>
                                            </div>
                                        </form>
                                        :
                                        null
                                }

                            </div>
                    }
                </div>
            </div>

        )
    }
    // onClick={this.props.handleForgetPwd}
}

export default LoginPage;