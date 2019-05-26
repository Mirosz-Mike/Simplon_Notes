import React, { Component } from "react";
import { connect } from "react-redux";

class Home extends Component {
  state = {};

  render() {
    return <div>Home</div>;
  }
}

const mapStateToProps = state => {
  console.log("state redux", state);
  return state;
};

export default connect(mapStateToProps)(Home);
