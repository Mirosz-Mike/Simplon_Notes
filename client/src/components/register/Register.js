import React, { Component } from "react";
import axios from "axios";

class Register extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    userMsg: ""
  };

  handleSubmit = event => {
    event.preventDefault();

    const user = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password
    };

    axios
      .post("http://localhost:8012/auth/register", user)
      .then(response => {
        this.setState({ userMsg: response.data.message });
        setTimeout(() => {
          this.props.history.push("/login");
        }, 1000);
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
    const { name, email, password, userMsg } = this.state;

    return (
      <div>
        <div className="navbar-start navbar-item">
          <a href="/" className="button is-danger is-inverted is-outlined">
            Accueil
          </a>
        </div>
        <div className="Register__container field columns">
          <div className="Register__container__content__left column is-6">
            <h1 className="title-h2">Inscription</h1>
            <p className="text">Faut bien s'inscrire</p>
          </div>
          <div className="Register__container__form column is-6">
            <form onSubmit={this.handleSubmit}>
              <div className="control">
                <input
                  className="Register__container__input"
                  onChange={this.handleChange}
                  value={name}
                  name="name"
                  type="text"
                  placeholder="Prénom"
                  required
                />
              </div>

              <p>{userMsg}</p>
              <input
                className={
                  userMsg.length > 0
                    ? "input is-danger"
                    : "Register__container__input"
                }
                onChange={this.handleChange}
                value={email}
                type="text"
                name="email"
                placeholder="Email"
                required
              />

              <input
                className="Register__container__input"
                onChange={this.handleChange}
                value={password}
                name="password"
                type="password"
                placeholder="Mot de passe"
                required
              />
              <button className="button is-link" onSubmit={this.handleSubmit}>
                M'inscrire
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
