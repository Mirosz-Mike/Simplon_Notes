import React, { Component } from "react";
import { connect } from "react-redux";

class Home extends Component {
  state = {};

  componentDidMount() {
    console.log("props");
  }
  render() {
    return <div>Home</div>;
  }
}

function mapStateToProps(state) {
  console.log("state", state.user.token);
  return {
    token: state.user.token
  };
}

export default connect(mapStateToProps)(Home);
