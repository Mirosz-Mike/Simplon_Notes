import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import "./Navbar.css";

class Navbar extends Component {
  disconnect = () => {
    this.props.remove(this.props.token);
    this.props.history.push("/");
  };

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
          <button className="button" onClick={this.disconnect}>
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

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Navbar)
);
