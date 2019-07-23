import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import {
  getUserToken,
  getUserName,
  getUserId
} from "../../redux/actions/action";

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
      .post(`${process.env.REACT_APP_API_URL}/auth/login`, user)
      .then(response => {
        this.props.availableToken(response.data.token);
        this.props.availableName(response.data.name);
        this.props.availableUserId(response.data.userId);
        this.props.history.push("/article");
      })
      .catch(error => {
        this.setState({ userMsg: error.response.data.message });
      });
  };

  redirectToHome = () => {
    this.props.history.push("/");
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
        <div className="Login__content__form container">
          <h1 className="Login__content__text__simplon">
            SIMPLON
            <span className="Login__content__text__notes">notes</span>
          </h1>
          <h1 className="Login__content__text__welcome">CONNEXION</h1>
          {userMsg}
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <input
                className="form-control"
                onChange={this.handleChange}
                value={email}
                type="text"
                name="email"
                placeholder="Email"
                required
              />
            </div>
            <div className="form-group">
              <input
                className={"form-control"}
                onChange={this.handleChange}
                value={password}
                name="password"
                type="password"
                placeholder="Mot de passe"
                required
              />
              <p className="mt-2">{userMsg}</p>
            </div>
            <div className="Login__content__align__buttons">
              <button
                onSubmit={this.handleSubmit}
                type="submit"
                className="Login__content__custom__button__signup"
              >
                Se connecter
              </button>
              <button
                onClick={() => this.redirectToHome()}
                className="Login__content__custom__button__home"
              >
                Accueil
              </button>
            </div>
          </form>
        </div>

        <div className="Login__content__move__element">
          <div className="Login__content__right__font" />
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
