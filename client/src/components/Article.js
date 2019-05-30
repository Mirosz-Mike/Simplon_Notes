import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }
};

class Article extends Component {
  state = {
    title: "",
    subTitle: "",
    image: "",
    body: "",
    success: "",
    messageError: ""
  };

  handleSubmit = event => {
    event.preventDefault();

    const article = {
      user_id: this.props.userId,
      title: this.state.title,
      subtitle: this.state.subTitle,
      image: this.state.image,
      body: this.state.body
    };

    axios
      .post("http://localhost:8012/articles", article, {
        headers: { "x-auth-token": this.props.token }
      })
      .then(response => {
        this.setState({ success: response.data.message });
        setTimeout(() => {
          this.props.history.push("/");
        }, 1000);
      })
      .catch(error => {
        this.setState({ messageError: error.response.data.message });
      });
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    console.log(this.state.body);
    return (
      <div style={styles.form}>
        <p>{this.state.messageError}</p>
        <p>{this.state.success}</p>
        <label>Titre</label>
        <input
          onChange={this.handleChange}
          name="title"
          type="text"
          placeholder="Title"
          required
        />
        <label>Sous-titre</label>
        <input
          onChange={this.handleChange}
          name="subTitle"
          type="text"
          placeholder="subTitle"
          required
        />
        <label>Image</label>
        <input
          onChange={this.handleChange}
          name="image"
          type="text"
          placeholder="image"
          required
        />
        <label>Corps</label>
        <textarea
          name="body"
          rows="5"
          cols="33"
          type="text"
          required
          onChange={this.handleChange}
        />
        <button onClick={this.handleSubmit}>Valider mon article</button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userId: state.user.userId,
    token: state.user.token
  };
}

export default connect(mapStateToProps)(Article);
