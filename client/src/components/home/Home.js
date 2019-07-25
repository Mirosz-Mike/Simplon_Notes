import React, { Component } from "react";
import { connect } from "react-redux";

class Home extends Component {
  hiddenButtonsIsLogin = () => {
    if (!this.props.token) {
      return (
        <div className="Home__container__button">
          <button
            onClick={() => this.props.history.push("/register")}
            className="Home__button__register"
          >
            Inscription
          </button>

          <button
            onClick={() => this.props.history.push("/login")}
            className="Home__button__login"
          >
            Connexion
          </button>
        </div>
      );
    }
    return null;
  };

  render() {
    return (
      <div className="Home__container">
        <div className="row">
          <div className="col-md-6">
            <div className="Home__center__content">
              <div className="Home__vertical__content">
                <h1 className="Home__text__simplon">
                  SIMPLON
                  <br />
                  <span className="Home__text__notes">notes</span>
                </h1>
                <p className="Home__text__slogan">
                  Stokez vos notes sur votre plateforme interne
                </p>
                {this.hiddenButtonsIsLogin()}
              </div>
            </div>
          </div>
          <div className="col-md-6 d-none d-lg-block">
            <div className="Home__container__right__logo__blue" />
            <div className="Home__container__right__logo__red" />
            <div className="Home__container__right__logo__black" />
            <div className="Home__container__right__logo__beige" />
          </div>
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
