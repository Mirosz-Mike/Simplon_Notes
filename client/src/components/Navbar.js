import React, { Component } from "react";
import { connect } from "react-redux";
import "./Navbar.css";

class Navbar extends Component {
  render() {
    return (
      <div className="navbar">
        <a href="/" className="link">
          Accueil
        </a>
        {!!this.props.name ? (
          <h4 className="white">{`Bienvenue ${this.props.name}`}</h4>
        ) : (
          <a href="/register" className="link">
            Inscription
          </a>
        )}
        {!!this.props.token ? (
          <a href="/article" className="button">
            Mes Articles
          </a>
        ) : (
          ""
        )}
        {!!this.props.token ? (
          <button
            className="button"
            onClick={() => this.props.remove(this.props.token)}
          >
            Deconnexion
          </button>
        ) : (
          <a href="/login" className="link">
            Connexion
          </a>
        )}
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

function mapDispatchToProps(dispatch) {
  return {
    remove: removeToken => {
      dispatch({ type: "REMOVE_USER_TOKEN", token: removeToken });
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar);
