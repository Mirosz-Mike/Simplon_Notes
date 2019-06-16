import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import {
  getUserToken,
  getUserName,
  getUserId
} from "../../redux/actions/user_action";

class Login extends Component {
  state = {
    email: "",
    password: "",
    userMsg: ""
  };

  handleSubmit = event => {
    event.preventDefault();

    const user = {
      email: this.state.email,
      password: this.state.password
    };

    axios
      .post("http://localhost:8012/auth/login", user)
      .then(response => {
        this.props.availableToken(response.data.token);
        this.props.availableName(response.data.name);
        this.props.availableUserId(response.data.userId);
        this.props.history.push("/");
      })
      .catch(error => {
        this.setState({ userMsg: error.response.data.message });
      });
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
      userMsg: ""
    });
  };

  render() {
    const { email, password, userMsg } = this.state;
    return (
      <div>
        <div className="navbar-start navbar-item">
          <a href="/" className="button is-danger is-inverted is-outlined">
            Accueil
          </a>
        </div>
        <div className="Login__container field columns">
          <div className="Login__container__content__left column is-6">
            <h1 className="title-h2">Connexion</h1>
            <p className="text">Avant de pourvoir, créer, éditer et partagez</p>
          </div>
          <div className="Login__container__form column is-6">
            <form onSubmit={this.handleSubmit}>
              <p>{userMsg}</p>
              <input
                className={
                  userMsg.length > 0
                    ? "input is-danger"
                    : "Login__container__input"
                }
                onChange={this.handleChange}
                value={email}
                type="text"
                name="email"
                placeholder="Email"
                required
              />
              <input
                className="Login__container__input"
                onChange={this.handleChange}
                value={password}
                name="password"
                type="password"
                placeholder="Mot de passe"
                required
              />
              <div className="Login__container__buttons">
                <button className="button is-link">Via gmail</button>
                <button
                  className="button is-danger"
                  onSubmit={this.handleSubmit}
                >
                  Se connecter
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    token: state
  };
}

function mapDispatchToProps(dispatch) {
  return {
    availableToken(token) {
      dispatch(getUserToken(token));
    },
    availableName(name) {
      dispatch(getUserName(name));
    },
    availableUserId(userId) {
      dispatch(getUserId(userId));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
