import React, { Component } from "react";
import axios from "axios";
import "./Register.css";

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
      <div>
        <form onSubmit={this.handleSubmit} className="form">
          {userMsg}
          <label>Votre prénom : </label>
          <input
            onChange={this.handleChange}
            value={name}
            name="name"
            type="text"
            placeholder="enter your name"
            required
          />
          <label>Votre email : </label>
          <input
            onChange={this.handleChange}
            value={email}
            type="text"
            name="email"
            placeholder="enter your email"
            required
          />
          <label>Votre mot de passe : </label>
          <input
            onChange={this.handleChange}
            value={password}
            name="password"
            type="password"
            placeholder="enter your password"
            required
          />
          <button onSubmit={this.handleSubmit}>M'inscrire</button>
        </form>
      </div>
    );
  }
}

export default Register;
