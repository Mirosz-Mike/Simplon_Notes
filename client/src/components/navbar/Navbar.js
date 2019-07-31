import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class Navbar extends Component {
  disconnect = () => {
    this.props.remove(this.props.token);
    this.props.history.push("/");
  };

  render() {
    return (
      <nav className="navbar Navbar_container">
        <div className="container">
          <a href="/" className="Navbar__content__text__simplon">
            SIMPLON<span className="Navbar__content__text__notes">notes</span>
          </a>
          <div className="Navbar__buttons">
            <h3 className="Navbar__content__text__user">{`bienvenue ${
              this.props.name
            }`}</h3>
            <a
              href="/article"
              className="Navbar__content__text__resources ml-3"
            >
              ressources
            </a>
            <button
              className="Navbar__content__text__disconnect ml-3"
              onClick={this.disconnect}
            >
              deconnexion
            </button>
          </div>
        </div>
      </nav>
    );
  }
}

function mapStateToProps(state) {
  return {
    token: state.token,
    name: state.userName
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
