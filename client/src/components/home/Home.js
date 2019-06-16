import React, { Component } from "react";
import { connect } from "react-redux";

class Home extends Component {
  state = {};

  hiddenButtonsIsLogin = () => {
    if (!this.props.token) {
      return (
        <div className="Home__container__button">
          <a href="/register" className="button is-link">
            Inscription
          </a>
          <a href="/login" className="button is-link">
            Connexion
          </a>
        </div>
      );
    }
    return null;
  };

  render() {
    return (
      <div className="Home__container columns is-desktop">
        <div className="column is-6">
          <h1 className="title-h1">
            Simplon
            <br />
            Notes
          </h1>
          <p className="text">Stokez vos notes sur votre plateforme interne</p>
          {this.hiddenButtonsIsLogin()}
        </div>
        <div className="Home__container__logo column is-6" />
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
