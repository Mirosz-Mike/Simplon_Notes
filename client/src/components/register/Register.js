import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";

import Modal from "../../shared/Modal/Modal";

class Register extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    userMsg: "",
    userMsgValid: "",
    validPass: null,
    show: false
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
          this.setState({
            show: true,
            userMsgValid: response.data.message,
            validPass: true
          });
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
        show: true,
        validPass: false,
        userMsg: ""
      });
    }
  };

  hideModal = () => {
    this.setState({ show: false });
  };

  redirectToLogin = () => {
    this.props.history.push("/login");
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
    const {
      name,
      email,
      password,
      userMsg,
      userMsgValid,
      validPass
    } = this.state;

    return (
      <div className="Register__container">
        <div className="row">
          <div className="col-md-6">
            <div className="row">
              <div className="col-md-11">
                <div className="Register__center__content">
                  <div className="Register__vertical__content">
                    <h1 className="Register__content__text__simplon">
                      SIMPLON <br />
                      <span className="Register__content__text__notes">
                        notes
                      </span>
                    </h1>
                    <p className="Register__text__slogan">
                      Stokez vos notes sur votre plateforme interne
                    </p>
                    {!!this.props.token ? null : (
                      <div className="Register__align__content">
                        <button
                          onClick={() => this.redirectToLogin()}
                          className="Register__content__custom__button__signin"
                        >
                          Se connecter
                        </button>
                        <button
                          onClick={() => this.redirectToHome()}
                          className="Register__content__custom__button__home"
                        >
                          Accueil
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-1">
                <hr className="Register__hr" />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="Register__center__content">
              <div className="Register__vertical__content">
                <h1 className="Register__content__text__inscription">
                  Inscription
                </h1>
                {userMsg}
                <form onSubmit={this.handleSubmit}>
                  <div className="form-group mb-4">
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
                    {/* {A refacto le systeme d'erreur en modal} */}
                    {this.state.show && !!userMsgValid ? (
                      <Modal show={this.state.show}>{userMsgValid}</Modal>
                    ) : null}
                    {this.state.show && !validPass ? (
                      <div className="Modal__container">
                        <div className="Modal__main">
                          <h4>Votre mot de passe doit contenir au moins</h4>
                          <ul>
                            <li> 1 caractère alphabétique minuscule.</li>
                            <li> 1 caractère alphabétique majuscule. </li>
                            <li> 1 caractère numérique.</li>
                            <li> 1 caractère spécial.</li>
                            <li>
                              Votre mot de passe doit comporter au minimum 8
                              caractères
                            </li>
                          </ul>
                          <div className="Modal__confirmModal">
                            <button
                              className="Register__button__modal"
                              onClick={this.hideModal}
                            >
                              ok
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {!!this.props.token ? null : (
                    <button
                      onSubmit={this.handleSubmit}
                      type="submit"
                      className="Register__content__custom__button__signup"
                    >
                      S'inscrire
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

export default connect(mapStateToProps)(Register);
