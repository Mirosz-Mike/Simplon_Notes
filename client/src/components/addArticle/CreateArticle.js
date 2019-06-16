import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";

class CreateArticle extends Component {
  state = {
    title: "",
    subTitle: "",
    body: "",
    success: "",
    file: null,
    messageError: ""
  };

  handleSubmit = event => {
    event.preventDefault();
    const { title, body } = this.state;

    const article = {
      user_id: this.props.userId,
      title: this.state.title,
      subtitle: this.state.subTitle,
      body: this.state.body
    };

    if (title && body) {
      axios
        .post("http://localhost:8012/articles/", article, {
          headers: {
            "content-type": "multipart/form-data",
            "x-auth-token": this.props.token
          }
        })
        .then(response => {
          console.log("message", response);
          this.setState({ success: response.data.message });
          // setTimeout(() => {
          //   this.props.history.push("/");
          // }, 1000);
        })
        .catch(error => {
          this.setState({ messageError: error.response.data.message });
        });
    }
  };

  handleSubmitImage = event => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("myImage", this.state.file);
    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };
    axios
      .post("http://localhost:8012/articles/upload", formData, config)
      .then(response => {
        console.log(response);
        alert("The file is successfully uploaded");
      })
      .catch(error => {
        console.log(error);
      });
  };

  onChange = event => {
    this.setState({ file: event.target.files[0] });
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    return (
      <div>
        <div className="CreateArticle__container__form">
          <form className="form" onSubmit={this.handleSubmit}>
            <p>{this.state.messageError}</p>
            <p>{this.state.success}</p>
            <label>Titre</label>
            <input
              onChange={this.handleChange}
              name="title"
              type="text"
              placeholder="Title"
              className="CreateArticle__container__input"
              required
            />
            <label>Sous-titre</label>
            <input
              onChange={this.handleChange}
              name="subTitle"
              type="text"
              placeholder="subTitle"
              className="CreateArticle__container__input"
              required
            />
            <label>Image</label>
            <input
              name="myImage"
              type="file"
              onChange={this.onChange}
              className="CreateArticle__container__input "
            />
            <button onClick={this.handleSubmitImage}>Télécharger</button>
            <label>Corps</label>
            <textarea
              className="textarea"
              placeholder="Votre article"
              name="body"
              rows="5"
              cols="33"
              type="text"
              required
              onChange={this.handleChange}
            />
            <button className="button is-link" type="submit">
              Valider mon article
            </button>
          </form>
        </div>
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

export default connect(mapStateToProps)(CreateArticle);
