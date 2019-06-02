import React, { Component } from "react";
import { connect } from "react-redux";
import "./Home.css";
class Home extends Component {
  state = {};

  render() {
    return (
      <div className="container">
        <div className="content_center">
          <h1>SimplonNotes</h1>
          <p>Votre plateforme de référence</p>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    token: state.user.token,
    name: state.user.userName
  };
}

export default connect(mapStateToProps)(Home);
