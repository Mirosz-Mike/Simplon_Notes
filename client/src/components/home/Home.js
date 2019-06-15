import React, { Component } from "react";
import { connect } from "react-redux";

class Home extends Component {
  state = {};

  render() {
    return (
      <div className="Home__container">
        <div className="">
          <h1 className="title-h1">
            Simplon
            <br />
            Notes
          </h1>
          <p className="text has-text-centered">
            Stokez vos notes sur votre plateforme interne
          </p>
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
