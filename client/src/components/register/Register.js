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
      [event.target.name]: event.target.value
    });
  };

  render() {
    const { name, email, password, userMsg } = this.state;

    return (
      <div className="field container">
        <div className="Register_form">
          <form onSubmit={this.handleSubmit} className="">
            {userMsg}
            <label className="label has-text-black">Votre prénom : </label>
            <div className="control">
              <input
                className="input is-info"
                onChange={this.handleChange}
                value={name}
                name="name"
                type="text"
                placeholder="Votre prénom"
                required
              />
            </div>
            <label className="label has-text-black">Votre email : </label>
            <input
              className="input is-info"
              onChange={this.handleChange}
              value={email}
              type="text"
              name="email"
              placeholder="Votre email"
              required
            />
            <label className="label has-text-black">Votre mot de passe :</label>
            <input
              className="input is-info"
              onChange={this.handleChange}
              value={password}
              name="password"
              type="password"
              placeholder="Votre mot de passe"
              required
            />
            <button className="button is-link" onSubmit={this.handleSubmit}>
              M'inscrire
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default Register;
