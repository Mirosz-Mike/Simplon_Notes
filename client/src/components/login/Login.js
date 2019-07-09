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
        <nav className="Login__navbar">
          <a className="btn btn-outline-dark" href="/">
            Accueil
          </a>
        </nav>
        <div className="Login__container">
          <div className="row">
            <div className="col-md-6 Login__background__color">
              <div className="Login__content__left">
                <h1 className="title-h2">Connexion</h1>
                <p className="text">
                  Avant de pourvoir créer, éditer et partagez
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="Login__content__right">
                {userMsg}
                <form onSubmit={this.handleSubmit}>
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
                      className="form-control"
                      onChange={this.handleChange}
                      value={password}
                      name="password"
                      type="password"
                      placeholder="Mot de passe"
                      required
                    />
                  </div>
                  <div className="Login__content__buttons">
                    <button type="submit" className="btn btn-primary">
                      Via gmail
                    </button>
                    <button
                      onSubmit={this.handleSubmit}
                      type="submit"
                      className="btn btn-danger"
                    >
                      Connexion
                    </button>
                  </div>
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
