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

  redirectToRegister = () => {
    this.props.history.push("/register");
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
      <div className="Login__container">
        <div className="row">
          <div className="col-md-6">
            <div className="row">
              <div className="col-md-11">
                <div className="Login__center__content">
                  <div className="Login__vertical__content">
                    <h1 className="Login__content__text__simplon">
                      SIMPLON <br />
                      <span className="Login__content__text__notes">notes</span>
                    </h1>
                    <p className="Login__text__slogan">
                      Stokez vos notes sur votre plateforme interne
                    </p>
                    {!!this.props.token ? null : (
                      <div className="Login__align__content">
                        <button
                          onClick={() => this.redirectToRegister()}
                          className="Login__content__custom__button__signup"
                        >
                          S'inscrire
                        </button>
                        <button
                          onClick={() => this.redirectToHome()}
                          className="Login__content__custom__button__home"
                        >
                          Accueil
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-1">
                <hr className="Login__hr" />
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="Login__center__content">
              <div className="Login__vertical__content">
                <h1 className="Login__content__text__connexion">Connexion</h1>
                {userMsg}
                <form onSubmit={this.handleSubmit}>
                  <div className="form-group mb-4">
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
                      className="form-control"
                      onChange={this.handleChange}
                      value={password}
                      name="password"
                      type="password"
                      placeholder="Mot de passe"
                      required
                    />
                  </div>

                  {!!this.props.token ? null : (
                    <button
                      onSubmit={this.handleSubmit}
                      type="submit"
                      className="Login__content__custom__button__signin"
                    >
                      Se connecter
                    </button>
                  )}
                </form>
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
    token: state.token
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
