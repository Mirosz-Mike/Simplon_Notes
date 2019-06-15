import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";

import "./EditArticle.css";

class EditArticle extends Component {
  state = {
    title: this.props.editArticle.title,
    subTitle: this.props.editArticle.subtitle,
    image: this.props.editArticle.image,
    body: this.props.editArticle.body,
    success: "",
    messageError: "",
    show: false
  };

  hideModal = () => {
    this.setState({ show: false });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { title, body } = this.state;

    const article = {
      user_id: this.props.userId,
      title: this.state.title,
      subtitle: this.state.subTitle,
      image: this.state.image,
      body: this.state.body
    };

    if (title && body) {
      axios
        .put(
          `http://localhost:8012/articles/${this.props.editArticle.id}`,
          article,
          {
            headers: { "x-auth-token": this.props.token }
          }
        )
        .then(response => {
          this.setState({ show: true, success: response.data.message });

          setTimeout(() => {
            this.setState({ show: false });
            this.props.history.push("/article");
          }, 1000);
        })
        .catch(error => {
          this.setState({ messageError: error.response.data.message });
        });
    }
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    return (
      <div className="form">
        <label>Titre</label>
        <input
          onChange={this.handleChange}
          name="title"
          type="text"
          value={this.state.title}
          placeholder="Title"
          required
        />
        <label>Sous-titre</label>
        <input
          onChange={this.handleChange}
          name="subTitle"
          type="text"
          value={this.state.subTitle}
          placeholder="subTitle"
          required
        />
        <label>Image</label>
        <input
          onChange={this.handleChange}
          name="image"
          type="text"
          value={this.state.image}
          placeholder="image"
          required
        />
        <label>Corps</label>
        <textarea
          name="body"
          rows="5"
          cols="33"
          type="text"
          value={this.state.body}
          required
          onChange={this.handleChange}
        />
        <button onClick={this.handleSubmit}>Modifier mon article</button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userId: state.user.userId,
    token: state.user.token,
    editArticle: state.user.editArticle
  };
}

export default connect(mapStateToProps)(EditArticle);
