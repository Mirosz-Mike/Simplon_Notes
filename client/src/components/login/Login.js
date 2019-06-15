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
      [event.target.name]: event.target.value
    });
  };

  render() {
    const { email, password, userMsg } = this.state;
    return (
      <div className="field container">
        <div className="Login_form">
          {userMsg}
          <form onSubmit={this.handleSubmit} className="">
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
              Connexion
            </button>
          </form>
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
