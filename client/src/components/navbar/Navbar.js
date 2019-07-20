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
      <nav className="navbar Navbar_background_color">
        <a href="/" className="btn btn-outline-primary">
          Accueil
        </a>
        <div className="Navbar__buttons">
          <h3 className="">{`Bienvenue ${this.props.name}`}</h3>
          <a href="/article" className="btn btn-success ml-3">
            Mes Ressources
          </a>
          <button className="btn btn-primary ml-3" onClick={this.disconnect}>
            Deconnexion
          </button>
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
