import React, { Component } from "react";
import { connect } from "react-redux";

class Home extends Component {
  state = {};

  hiddenButtonsIsLogin = () => {
    if (!this.props.token) {
      return (
        <div className="Home__container__button">
          <a href="/register" className="btn btn-primary">
            Inscription
          </a>
          <a href="/login" className="btn btn-primary">
            Connexion
          </a>
        </div>
      );
    }
    return null;
  };

  render() {
    return (
      <div className="Home__container">
        <div className="row">
          <div className="col-md-6  col-sm">
            <div className="Home__center__content">
              <div className="Home__vertical__content">
                <h1 className="title-h1">
                  Simplon
                  <br />
                  Notes
                </h1>
                  <p className="text">Stokez vos notes sur votre plateforme interne</p>
                  {this.hiddenButtonsIsLogin()}
              </div>
            </div>
            </div>
            <div className="col-md-6 col-sm">
              <div className="Home__center__content">
                <div className="Home__vertical__content">
                 <div className="Home__container__logo " />
                </div>
              </div>
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
