import React, { Component } from "react";
import { connect } from "react-redux";

class Home extends Component {
  state = {};

  render() {
    return <div>Home</div>;
  }
}

function mapStateToProps(state) {
  return {
    token: state.user.token,
    name: state.user.userName
  };
}

export default connect(mapStateToProps)(Home);
