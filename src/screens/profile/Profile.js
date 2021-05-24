import React, { Component } from "react";
import "./Profile.css";
import Header from '../../common/header/Header'
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
        <div>
            <Header
            baseUrl={this.props.baseUrl}
            searchOptions="false"
            changeBadgeVisibility={this.changeVisibility}
        />
        <div>My Profile Page</div>
    </div>
    );
  }
}

export default Profile;
