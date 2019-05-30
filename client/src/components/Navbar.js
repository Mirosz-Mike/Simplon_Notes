import React, { Component } from "react";
import { connect } from "react-redux";

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "black",
    height: "40px"
  },
  link: {
    textDecoration: "none",
    color: "white"
  },
  button: {
    color: "white",
    border: "none",
    cursor: "pointer",
    backgroundColor: "black",
    fontSize: 15,
    textDecoration: "none",
    outline: "none"
  },
  white: {
    color: "white"
  }
};

class Navbar extends Component {
  render() {
    return (
      <div style={styles.navbar}>
        <a href="/" style={styles.link}>
          Accueil
        </a>
        {!!this.props.name ? (
          <h4 style={styles.white}>{`Bienvenue ${this.props.name}`}</h4>
        ) : (
          <a href="/register" style={styles.link}>
            Inscription
          </a>
        )}
        {!!this.props.token ? (
          <a href="/article" style={styles.button}>
            Mes Articles
          </a>
        ) : (
          ""
        )}
        {!!this.props.token ? (
          <button
            style={styles.button}
            onClick={() => this.props.remove(this.props.token)}
          >
            Deconnexion
          </button>
        ) : (
          <a href="/login" style={styles.link}>
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
