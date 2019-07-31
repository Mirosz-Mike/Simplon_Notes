import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Modal from "../../shared/Modal/Modal";

import { deleteImgResource } from "../../redux/actions/action";

class EditArticle extends Component {
  state = {
    title: "",
    subTitle: "",
    image: [],
    imageName: [],
    body: "",
    success: "",
    messageError: "",
    show: false
  };

  componentDidMount() {
    const { title, subtitle, image, image_name, body } = this.props.editArticle;

    const listImageName = image_name.split(",");
    console.log(image);

    this.setState({
      title: title,
      subTitle: subtitle,
      image: [image],
      imageName: listImageName,
      body: body
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    const { title, body } = this.state;

    const article = {
      user_id: this.props.userId,
      title: this.state.title,
      subtitle: this.state.subTitle,
      image: this.state.image,
      //image_name: this.state.image_name,
      body: this.state.body
    };

    if (title && body) {
      axios
        .put(
          `${process.env.REACT_APP_API_URL}/articles/${
            this.props.editArticle.id
          }`,
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
          }, 1300);
        })
        .catch(error => {
          const userDeconnect = error.response.status === 401;
          if (userDeconnect) {
            alert(error.response.data.message);
            this.props.removeToken(this.props.token);
            this.props.history.push("/");
          }
        });
    }
  };

  deleteImage(e, image) {
    e.preventDefault();
    this.props.removeImage(image);

    console.log(image);
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    return (
      <div className="EditArticle__container">
        <Modal show={this.state.show}>{this.state.success}</Modal>
        <form className="EditArticle__container__form mt-5">
          <label>Titre</label>
          <input
            onChange={this.handleChange}
            name="title"
            type="text"
            value={this.state.title}
            placeholder="Title"
            className="EditArticle__container__input"
            required
          />
          <label>Sous-titre</label>
          <input
            onChange={this.handleChange}
            name="subTitle"
            type="text"
            value={this.state.subTitle}
            placeholder="subTitle"
            className="EditArticle__container__input"
            required
          />
          <div className="EditArticle__container__align__image">
            {this.state.imageName !== undefined ? (
              this.state.imageName.map(image => {
                return (
                  <div
                    className="EditArticle__container__align__image"
                    key={image.id}
                  >
                    <p>{image}</p>
                    <button
                      onClick={e => this.deleteImage(e, image)}
                      className="btn btn-danger"
                    >
                      Supprimer cette photo
                    </button>
                  </div>
                );
              })
            ) : (
              <p>Plus d'image</p>
            )}
          </div>
          <label>Image</label>
          <input
            type="file"
            name="image"
            placeholder="image"
            className="form-control-file"
          />
          <label>Corps</label>
          <textarea
            className="form-control"
            name="body"
            rows="5"
            cols="33"
            type="text"
            value={this.state.body}
            required
            onChange={this.handleChange}
          />
          <button className="btn btn-primary mt-2" onClick={this.handleSubmit}>
            Modifier mon article
          </button>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userId: state.userId,
    token: state.token,
    editArticle: state.editArticle
  };
}

function mapDispatchToProps(dispatch) {
  return {
    removeImage(image_name) {
      dispatch(deleteImgResource(image_name));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditArticle);
