import React, { Component } from "react";
import axios from "axios";

class Register extends Component {
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
          this.setState({ userMsg: error.response });
        });
    } else {
      this.setState({
        validPass: false,
        userMsg: ""
      });
    }
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
        <nav className="Register__navbar">
          <a className="btn btn-outline-dark" href="/">
            Accueil
          </a>
        </nav>
        <div className="Register__container">
          <div className="row">
            <div className="col-md-6 Register__background__color">
              <div className="Register__content__left">
                <h1 className="title-h2">Inscription</h1>
                <p className="text">Faut bien s'inscrire</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="Register__content__right">
                {userMsg}
                <form onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <label>Pseudo</label>
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
                    <label>Email</label>
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
                    <label>Mot de passe</label>
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
                  <button
                    onSubmit={this.handleSubmit}
                    type="submit"
                    className="btn btn-primary"
                  >
                    M'inscrire
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
