import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class Navbar extends Component {
  disconnect = () => {
    this.props.remove(this.props.token);
    this.props.history.push("/");
  };

  showNavIsLoggin = () => {
    if (!!this.props.token) {
      return (
        <a href="/article" className="button is-light">
          Mes Articles
        </a>
      );
    }
    return "";
  };

  showButtonDisconnect = () => {
    if (!!this.props.token) {
      return (
        <button className="button is-light" onClick={this.disconnect}>
          Deconnexion
        </button>
      );
    }
    return (
      <a href="/login" className="button is-danger is-inverted is-outlined">
        Connexion
      </a>
    );
  };

  render() {
    return (
      <nav className="navbar Navbar_background_color">
        <div className="navbar-start navbar-item">
          <a href="/" className="button is-danger is-inverted is-outlined">
            Accueil
          </a>
        </div>
        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              {!!this.props.name ? (
                <h4 className="titre-h1">{`Bienvenue ${this.props.name}`}</h4>
              ) : (
                <a
                  href="/register"
                  className="button is-danger is-inverted is-outlined"
                >
                  Inscription
                </a>
              )}
              {this.showNavIsLoggin()}
              {this.showButtonDisconnect()}
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

function mapStateToProps(state) {
  return {
    token: state.user.token,
    name: state.user.userName
  };
}

function mapDispatchToProps(dispatch) {
  return {
    remove: removeToken => {
      dispatch({ type: "REMOVE_USER_TOKEN", token: removeToken });
    }
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Navbar)
);
