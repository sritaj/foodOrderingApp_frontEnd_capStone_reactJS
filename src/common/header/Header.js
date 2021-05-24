import React, {Component} from "react";
import "./Header.css";
import {withRouter} from "react-router-dom";
import Fastfood from "@material-ui/icons/Fastfood";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Button from "@material-ui/core/Button";
import Search from "@material-ui/icons/Search";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import Typography from "@material-ui/core/Typography";
import Modal from "react-modal";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from "prop-types";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import {Link} from "react-router-dom";
/* styles for signUp and login Modal */
const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
    },
};

/*
TabContainer componenet to house login and signup
*/
const TabContainer = (props) => {
    return (
        <Typography component="div" style={{padding: "0px", textAlign: "center"}}>
            {props.children}
        </Typography>
    );
};

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
};

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            value: 0,
            loginContactNumberRequired: "dispNone",
            loginContactNumber: "",
            loginContactError: "",
            loginPasswordRequired: "dispNone",
            loginPassword: "",
            loginPasswordError: "",
            firstNameRequired: "dispNone",
            firstName: "",
            lastName: "",
            emailRequired: "dispNone",
            email: "",
            emailError: "",
            signupPasswordRequired: "dispNone",
            signupPassword: "",
            signupPasswordError: "",
            signupContactNumberRequired: "dispNone",
            signupContactNumber: "",
            signupContactNumberError: "",
            snackBarOpen: false,
            snackBarMessage: "",
            loggedIn: sessionStorage.getItem("access-token") === null ? false : true,
            loggedInCustomerFirstName: sessionStorage.getItem("customer-name"),
            anchorE1: null,
        };
    }
    /*
    handler to open login and sign up modal
    */
    openModalHandler = () => {
        this.setState({
            modalIsOpen: true,
            value: 0,
        });
        if (this.props.changeBadgeVisibility) {
            this.props.changeBadgeVisibility();
        }
    };

    /*
    handler to close login and sign up modal
    */
    closeModalHandler = () => {
        this.setState({
            modalIsOpen: false,
            value: 0,
            loginContactNumberRequired: "dispNone",
            loginContactNumber: "",
            loginContactError: "",
            loginPasswordRequired: "dispNone",
            loginPassword: "",
            loginPasswordError: "",
            firstNameRequired: "dispNone",
            firstName: "",
            lastName: "",
            emailRequired: "dispNone",
            email: "",
            emailError: "",
            signupPasswordRequired: "dispNone",
            signupPassword: "",
            signupPasswordError: "",
            signupContactNumberRequired: "dispNone",
            signupContactNumber: "",
            signupContactNumberError: "",
        });

        if (this.props.changeBadgeVisibility) {
            this.props.changeBadgeVisibility();
        }
    };
    /*
    Handler to mantain tab change
    */
    tabChangeHandler = (event, value) => {
        this.setState({
            value,
        });
    };
    /*
    Handler for login user
    */
    loginClickHandler = () => {
        let error= false;
        this.state.loginContactNumber === ""
            ? this.setState({loginContactNumberRequired: "dispBlock"})
            : this.setState({loginContactNumberRequired: "dispNone"});
        this.state.loginPassword === ""
            ? this.setState({loginPasswordRequired: "dispBlock"})
            : this.setState({loginPasswordRequired: "dispNone"});

        // login contact number validation
        if (this.state.loginContactNumber === "") {
            this.setState({
                loginContactNumberRequired: "dispBlock",
                loginContactError: "required",
            });
            error= true;
        } else if (
            this.state.loginContactNumber.toString().match(/^(?=.*\d).{10,10}$/i) ===
            null
        ) {
            this.setState({loginContactNumberRequired: "dispBlock"});
            this.setState({
                loginContactError: "Invalid Contact",
            });
            error= true;
        } else {
            this.setState({loginContactNumberRequired: "dispNone"});
            this.setState({loginContactError: ""});
        }

        //login password validation
        if (this.state.loginPassword === "") {
            this.setState({
                loginPasswordRequired: "dispBlock",
                loginPasswordError: "required",
            });
            error= true;
        } else {
            this.setState({
                loginPasswordRequired: "dispNone",
                loginPasswordError: "",
            });
        }

        if (error) {
            return;
        }

        //xhr request for login
        let dataLogin = null;
        let xhrLogin = new XMLHttpRequest();
        let that = this;
        xhrLogin.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                if (xhrLogin.status === 200 || xhrLogin.status === 201) {
                    let loginResponse = JSON.parse(this.responseText);
                    sessionStorage.setItem("uuid", JSON.parse(this.responseText).id);
                    sessionStorage.setItem(
                        "access-token",
                        xhrLogin.getResponseHeader("access-token")
                    );
                    sessionStorage.setItem("customer-name", loginResponse.first_name);
                    that.setState({
                        loggedIn: true,
                        loggedInCustomerFirstName: loginResponse.first_name,
                    });
                    that.snackBarHandler("Logged in successfully!");
                    that.closeModalHandler();
                } else {
                    that.setState({loginPasswordRequired: "dispBlock"});
                    that.setState({
                        loginPasswordError: JSON.parse(this.responseText).message,
                    });
                }
            }
        });

        xhrLogin.open("POST", this.props.baseUrl + "customer/login");
        xhrLogin.setRequestHeader(
            "Authorization",
            "Basic " +
            window.btoa(
                this.state.loginContactNumber + ":" + this.state.loginPassword
            )
        );
        xhrLogin.setRequestHeader("Content-Type", "application/json");
        xhrLogin.setRequestHeader("Cache-Control", "no-cache");
        xhrLogin.send(dataLogin);
    };

    /*
    handler to set the change in contact number
    */
    loginContactNumberChangeHandler = (e) => {
        this.setState({loginContactNumber: e.target.value});
    };
    /*
    handler to set the change in password 
    */
    loginPasswordChangeHandler = (e) => {
        this.setState({loginPassword: e.target.value});
    };

    /*
    handler for sign up
    */
    signUpClickHandler = () => {
        let error= false;
        this.state.firstName === ""
            ? this.setState({firstNameRequired: "dispBlock"})
            : this.setState({firstNameRequired: "dispNone"});
        this.state.email === ""
            ? this.setState({emailRequired: "dispBlock"})
            : this.setState({emailRequired: "dispNone"});
        this.state.signupPassword === ""
            ? this.setState({signupPasswordRequired: "dispBlock"})
            : this.setState({signupPasswordRequired: "dispNone"});
        this.state.signupContactNumber === ""
            ? this.setState({signupContactNumberRequired: "dispBlock"})
            : this.setState({signupContactNumberRequired: "dispNone"});

        //email validation
        if (this.state.email === "") {
            this.setState({
                emailRequired: "dispBlock",
                emailError: "required",
            });
            error=true;
        } else if (
            this.state.email
                .toString()
                .match(/^([\w%+-]+)@([\w-]+\.)+([\w]{2,})$/i) === null
        ) {
            this.setState({emailRequired: "dispBlock"});
            this.setState({emailError: "Invalid Email"});
            error=true;
        } else {
            this.setState({emailRequired: "dispNone"});
            this.setState({emailError: ""});
        }

        //password validation
        if (this.state.signupPassword === "") {
            this.setState({signupPasswordRequired: "dispBlock"});
            this.setState({signupPasswordError: "required"});
            error=true;
        } else if (
            this.state.signupPassword
                .toString()
                .match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,32}$/i) === null
        ) {
            this.setState({signupPasswordRequired: "dispBlock"});
            this.setState({
                signupPasswordError:
                    "Password must contain at least one capital letter, one small letter, one number, and one special character",
            });
            error=true;
        } else {
            this.setState({signupPasswordRequired: "dispNone"});
            this.setState({signupPasswordError: ""});
        }

        //contact number validation
        if (this.state.signupContactNumber === "") {
            this.setState({signupContactNumberRequired: "dispBlock"});
            this.setState({signupContactNumberError: "required"});
            error=true;
        } else if (
            this.state.signupContactNumber.toString().match(/^(?=.*\d).{10,10}$/i) ===
            null
        ) {
            this.setState({signupContactNumberRequired: "dispBlock"});
            this.setState({
                signupContactNumberError:
                    "Contact No. must contain only numbers and must be 10 digits long",
            });
            error=true;
        } else {
            this.setState({signupContactNumberRequired: "dispNone"});
            this.setState({signupContactNumberError: ""});
        }

        if (error)
         {
            return;
        }

        //xhr request for signup

        let dataSignup = JSON.stringify({
            contact_number: this.state.signupContactNumber,
            email_address: this.state.email,
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            password: this.state.signupPassword,
        });

        let xhrSignup = new XMLHttpRequest();
        let that = this;
        xhrSignup.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                if (xhrSignup.status === 200 || xhrSignup.status === 201) {
                    that.snackBarHandler("Registered successfully! Please login now!");
                    that.openModalHandler();
                } else {
                    that.setState({signupContactNumberRequired: "dispBlock"});
                    that.setState({
                        signupContactNumberError: JSON.parse(this.responseText).message,
                    });
                }
            }
        });

        xhrSignup.open("POST", this.props.baseUrl + "customer/signup");
        xhrSignup.setRequestHeader("Content-Type", "application/json");
        xhrSignup.setRequestHeader("Cache-Control", "no-cache");
        xhrSignup.send(dataSignup);
    };

    /*
    handler to set the change in firstName 
    */
    firstNameChangeHandler = (e) => {
        this.setState({firstName: e.target.value});
    };

    /*
    handler to set the change in lastname 
    */
    lastNameChangeHandler = (e) => {
        this.setState({lastName: e.target.value});
    };

    
    /*
    handler to set the change in email 
    */
    emailChangeHandler = (e) => {
        this.setState({email: e.target.value});
    };

    /*
    handler to set the change in signup password 
    */
    signupPasswordChangeHandler = (e) => {
        this.setState({signupPassword: e.target.value});
    };

    /*
    handler to set the change in signup contact number 
    */
    signupContactNumberChangeHandler = (e) => {
        this.setState({signupContactNumber: e.target.value});
    };

    snackBarHandler = (message) => {
        // if any snackbar open already close that
        this.setState({snackBarOpen: false});
        // updating component state snackbar message
        this.setState({snackBarMessage: message});
        // Show snackbar
        this.setState({snackBarOpen: true});
    };

    /*
    handler to handle menu
    */
    handleMenu = (event) => {
        this.setState({anchorEl: event.currentTarget});
    };

    /*
    handler to handle close menu
    */
    handleClose = () => {
        this.setState({anchorEl: null});
    };

    /*
    handler for click of Profile Menu
    */
    handleProfileMenuClick = () => {
        this.setState({anchorEl: null});
    };

    /*
    handler for logout
    */
    handleLogoutMenuClick = () => {
        this.setState({anchorEl: null});

        //xhr for logout
        let logoutData = null;
        let that = this;
        let xhrLogout = new XMLHttpRequest();
        xhrLogout.addEventListener("readystatechange", function () {
            if (xhrLogout.readyState === 4 && xhrLogout.status === 200) {
                sessionStorage.removeItem("uuid");
                sessionStorage.removeItem("access-token");
                sessionStorage.removeItem("customer-name");
                that.setState({
                    ...that.state,
                    loggedIn: false,
                });
            }
        });

        xhrLogout.open("POST", this.props.baseUrl + "customer/logout");
        xhrLogout.setRequestHeader(
            "authorization",
            "Bearer " + sessionStorage.getItem("access-token")
        );
        xhrLogout.send(logoutData);
    };

    
    /*
    handler for input Search Change
    */
    inputSearchChangeHandler = (event) => {
        let that = this;
        let xhrSearchRestaurant = new XMLHttpRequest();
        if (!(event.target.value === "")) {
            xhrSearchRestaurant.addEventListener("readystatechange", function () {
                if (
                    xhrSearchRestaurant.readyState === 4 &&
                    xhrSearchRestaurant.status === 200
                ) {
                    var restaurant = JSON.parse(this.responseText).restaurants;
                    that.props.updateSearchRestaurant(restaurant);
                }
            });

            xhrSearchRestaurant.open(
                "GET",
                this.props.baseUrl + "restaurant/name/" + event.target.value
            );
            xhrSearchRestaurant.setRequestHeader("Content-Type", "application/json");
            xhrSearchRestaurant.setRequestHeader("Cache-Control", "no-cache");
            xhrSearchRestaurant.send();
        } else {
            xhrSearchRestaurant.addEventListener("readystatechange", function() {
                if (xhrSearchRestaurant.readyState === 4 && xhrSearchRestaurant.status === 200) {
                    var restaurant = JSON.parse(this.responseText).restaurants;
                    that.props.updateSearchRestaurant(restaurant);
                }
            });

            xhrSearchRestaurant.open("GET", this.props.baseUrl + "restaurant");
            xhrSearchRestaurant.setRequestHeader("Cache-Control", "no-cache");
            xhrSearchRestaurant.send();
        }
    };

    render() {
        return (
            <div>
                <header className="app-header">
                    <div className="flex-container-header">
                        <div className="app-logo">
                            <Fastfood style={{fontSize: "35px", color: "white"}}/>
                        </div>
                        {this.props.searchOptions === "true" ? (
                            <div className="app-search">
                                <Typography variant="h6">
                                    <Input
                                        type="text"
                                        placeholder="Search by Restaurant Name"
                                        inputProps={{"aria-label": "description"}}
                                        style={{color: "grey", width: 280}}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <Search style={{color: "white"}}/>
                                            </InputAdornment>
                                        }
                                        onChange={this.inputSearchChangeHandler}
                                    />
                                </Typography>
                            </div>
                        ) : (
                            ""
                        )}
                        <div className="app-login">
                            {this.state.loggedIn ? (
                                <div>
                                    <Button
                                        className="loggedInButton"
                                        disableRipple={true}
                                        variant="text"
                                        aria-owns={this.state.anchorEl ? "simple-menu" : undefined}
                                        aria-haspopup="true"
                                        onClick={this.handleMenu}
                                    >
                                        <AccountCircle
                                            style={{marginRight: 4}}
                                            htmlColor="#c2c2c2"
                                        />
                                        {this.state.loggedInCustomerFirstName}
                                    </Button>
                                    <Menu
                                        id="simple-menu"
                                        anchorEl={this.state.anchorEl}
                                        open={Boolean(this.state.anchorEl)}
                                        onClose={this.handleClose}
                                    >
                                        <Link
                                            to={"/profile"}
                                            className="linkedPage"
                                            underline="none"
                                        >
                                            <MenuItem
                                                className="menu-item linkedPage"
                                                disableGutters={false}
                                                onClick={this.handleProfileMenuClick}
                                            >
                                                My Profile
                                            </MenuItem>
                                        </Link>
                                        <MenuItem
                                            className="menu-item"
                                            onClick={this.handleLogoutMenuClick}
                                        >
                                            Logout
                                        </MenuItem>
                                    </Menu>
                                </div>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="default"
                                    onClick={this.openModalHandler}
                                >
                                    <AccountCircle style={{marginRight: 4}}/>
                                    LOGIN
                                </Button>
                            )}
                        </div>
                    </div>
                </header>
                <Modal
                    ariaHideApp={false}
                    isOpen={this.state.modalIsOpen}
                    contentLabel="Login"
                    onRequestClose={this.closeModalHandler}
                    style={customStyles}
                >
                    <Tabs
                        value={this.state.value}
                        onChange={this.tabChangeHandler}
                        className="tabs"
                    >
                        <Tab label="LOGIN"/>
                        <Tab label="SIGNUP"/>
                    </Tabs>
                    {this.state.value === 0 && (
                        <TabContainer>
                            <FormControl required className="formControl">
                                <InputLabel htmlFor="loginContactNumber">
                                    Contact No.
                                </InputLabel>
                                <Input
                                    id="loginContactNumber"
                                    type="number"
                                    logincontactnumber={this.state.loginContactNumber}
                                    value={this.state.loginContactNumber}
                                    onChange={this.loginContactNumberChangeHandler}
                                    className="input-fields"
                                    fullWidth={true}
                                />
                                <FormHelperText
                                    className={this.state.loginContactNumberRequired}
                                >
                                    <span className="red">{this.state.loginContactError}</span>
                                </FormHelperText>
                            </FormControl>
                            <br/>
                            <br/>
                            <FormControl required className="formControl">
                                <InputLabel htmlFor="loginPassword">Password</InputLabel>
                                <Input
                                    id="loginPassword"
                                    type="password"
                                    loginpassword={this.state.loginPassword}
                                    value={this.state.loginPassword}
                                    onChange={this.loginPasswordChangeHandler}
                                    className="input-fields"
                                    fullWidth={true}
                                />
                                <FormHelperText className={this.state.loginPasswordRequired}>
                                    <span className="red">{this.state.loginPasswordError}</span>
                                </FormHelperText>
                            </FormControl>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={this.loginClickHandler}
                            >
                                LOGIN
                            </Button>
                        </TabContainer>
                    )}

                    {this.state.value === 1 && (
                        <TabContainer>
                            <FormControl required className="formControl">
                                <InputLabel htmlFor="firstName">First Name</InputLabel>
                                <Input
                                    id="firstName"
                                    type="text"
                                    firstname={this.state.firstName}
                                    value={this.state.firstName}
                                    onChange={this.firstNameChangeHandler}
                                    className="input-fields"
                                    fullWidth={true}
                                />
                                <FormHelperText className={this.state.firstNameRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                            </FormControl>
                            <br/>
                            <br/>
                            <FormControl className="formControl">
                                <InputLabel htmlFor="lastName">Last Name</InputLabel>
                                <Input
                                    id="lastName"
                                    type="text"
                                    lastname={this.state.lastName}
                                    value={this.state.lastName}
                                    onChange={this.lastNameChangeHandler}
                                    className="input-fields"
                                    fullWidth={true}
                                />
                            </FormControl>
                            <br/>
                            <br/>
                            <FormControl required className="formControl">
                                <InputLabel htmlFor="email">Email</InputLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    email={this.state.email}
                                    value={this.state.email}
                                    onChange={this.emailChangeHandler}
                                    className="input-fields"
                                    fullWidth={true}
                                />
                                <FormHelperText className={this.state.emailRequired}>
                                    <span className="red">{this.state.emailError}</span>
                                </FormHelperText>
                            </FormControl>
                            <br/>
                            <br/>
                            <FormControl required className="formControl">
                                <InputLabel htmlFor="signupPassword">Password</InputLabel>
                                <Input
                                    id="signupPassword"
                                    type="password"
                                    signuppassword={this.state.signupPassword}
                                    value={this.state.signupPassword}
                                    onChange={this.signupPasswordChangeHandler}
                                    className="input-fields"
                                    fullWidth={true}
                                />
                                <FormHelperText className={this.state.signupPasswordRequired}>
                                    <span className="red">{this.state.signupPasswordError}</span>
                                </FormHelperText>
                            </FormControl>
                            <br/>
                            <br/>
                            <FormControl required className="formControl">
                                <InputLabel htmlFor="signupContactNumber">
                                    Contact No.
                                </InputLabel>
                                <Input
                                    id="signupContactNumber"
                                    type="number"
                                    signupcontactnumber={this.state.signupContactNumber}
                                    value={this.state.signupContactNumber}
                                    onChange={this.signupContactNumberChangeHandler}
                                    className="input-fields"
                                    fullWidth={true}
                                />
                                <FormHelperText
                                    className={this.state.signupContactNumberRequired}
                                >
                  <span className="red">
                    {this.state.signupContactNumberError}
                  </span>
                                </FormHelperText>
                            </FormControl>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={this.signUpClickHandler}
                            >
                                SIGNUP
                            </Button>
                        </TabContainer>
                    )}
                </Modal>
                <Snackbar
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                    open={this.state.snackBarOpen}
                    autoHideDuration={6000}
                    onClose={() => this.setState({snackBarOpen: false})}
                    ContentProps={{
                        "aria-describedby": "message-id",
                    }}
                    message={<span id="message-id">{this.state.snackBarMessage}</span>}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            onClick={() => this.setState({snackBarOpen: false})}
                        >
                            <CloseIcon/>
                        </IconButton>,
                    ]}
                />
            </div>
        );
    }
}

export default withRouter(Header);
