import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";

class Home extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    userMsg: "",
    validPass: null
  };

  handleSubmit = event => {
    event.preventDefault();

    const user = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password
    };

    const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    const checkPassword = passwordReg.test(user.password);

    if (checkPassword) {
      axios
        .post(`${process.env.REACT_APP_API_URL}/auth/register`, user)
        .then(response => {
          this.setState({ userMsg: response.data.message, validPass: true });
          setTimeout(() => {
            this.props.history.push("/login");
          }, 1000);
        })
        .catch(error => {
          console.log(error.response);
          this.setState({ userMsg: error.response.data.message });
        });
    } else {
      this.setState({
        validPass: false,
        userMsg: ""
      });
    }
  };

  redirectToLogin = () => {
    this.props.history.push("/login");
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
      userMsg: ""
    });
  };

  render() {
    const { name, email, password, userMsg, validPass } = this.state;

    return (
      <div>
        <div className="Register__content__form container">
          <h1 className="Register__content__text__simplon">
            SIMPLON
            <span className="Register__content__text__notes">notes</span>
          </h1>
          <h1 className="Register__content__text__welcome">BIENVENUE</h1>
          {userMsg}
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <input
                className="form-control"
                onChange={this.handleChange}
                value={name}
                name="name"
                type="text"
                placeholder="Pseudo"
                required
              />
            </div>
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
                className={
                  validPass
                    ? "form-control is-valid"
                    : "form-control is-invalid"
                }
                onChange={this.handleChange}
                value={password}
                name="password"
                type="password"
                placeholder="Mot de passe"
                required
              />
              <p className="mt-2">
                {validPass
                  ? ""
                  : `Votre mot de passe doit contenir au moins
                          - 1 caractère alphabétique minuscule.
                          - 1 caractère alphabétique majuscule.
                          - 1 caractère numérique.
                          - 1 caractère spécial.
                          - Votre mot de passe doit comporter au minimum 8 caractères`}
              </p>
            </div>

            {!!this.props.token ? null : (
              <div className="Register__content__align__buttons">
                <button
                  onSubmit={this.handleSubmit}
                  type="submit"
                  className="Register__content__custom__button__signup"
                >
                  M'inscrire
                </button>
                <button
                  onClick={() => this.redirectToLogin()}
                  className="Register__content__custom__button__signin"
                >
                  Se connecter
                </button>
              </div>
            )}
          </form>
        </div>

        <div className="Register__content__move__element">
          <div className="Register__content__right__font" />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    token: state.user.token
  };
}

export default connect(mapStateToProps)(Home);
