import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "../common/Route";
import Home from "../screens/home/Home";
import Checkout from "../screens/checkout/Checkout";
import Details from "../screens/details/Details";
import Profile from "../screens/profile/Profile";

class FoodOrderingAppController extends Component {
  constructor() {
    super();
    this.baseUrl = "http://localhost:8080/api/";
    this.state = {
      loggedIn: sessionStorage.getItem("access-token") == null ? false : true,
    };
  }
  render() {
    return (
      <Router>
        <div className="main-container">
          <Switch>
            <Route
              exact
              path="/"
              render={(props) => <Home {...props} baseUrl={this.baseUrl} />}
            />
            <Route
              exact
              path="/restaurant/:id"
              render={(props) => <Details {...props} baseUrl={this.baseUrl} />}
            />
             <PrivateRoute
              exact
              path="/profile"
              component={Profile}
              baseUrl={this.baseUrl}
            /> 
            <PrivateRoute
              exact
              path="/checkout"
              component={Checkout}
              baseUrl={this.baseUrl}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default FoodOrderingAppController;
