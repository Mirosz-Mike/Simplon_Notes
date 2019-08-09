import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Modal from "../../shared/Modal/Modal";

import {
  deleteImageEditArticle,
  showMessageDelete
} from "../../redux/actions/action";

class EditArticle extends Component {
  state = {
    title: "",
    subTitle: "",
    file: [],
    imagesArticle: [],
    imageId: "",
    body: "",
    success: "",
    messageError: "",
    show: false
  };

  componentDidMount() {
    this.fetchImageArticle();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.showSuccessModal !== this.props.showSuccessModal) {
      this.fetchImageArticle();
      this.props.initializeShowMessage(false);
    }
  }

  fetchImageArticle = () => {
    const { title, subtitle, body } = this.props.editArticle;

    axios
      .get(`${process.env.REACT_APP_API_URL}/articles/images`, {
        headers: { "x-auth-token": this.props.token }
      })
      .then(response => {
        const imagesByArticle = response.data.filter(
          articleById => articleById.article_id === this.props.editArticle.id
        );

        const onlyImageUrl = imagesByArticle.map(imageUrl => {
          return {
            imageId: imageUrl.id,
            image: imageUrl.image,
            image_name: imageUrl.image_name
          };
        });

        this.setState({ imagesArticle: onlyImageUrl });
      })
      .catch(error => {
        console.log(error.message);
      });

    this.setState({
      title: title,
      subTitle: subtitle,
      body: body
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { title, body, imagesArticle } = this.state;
    const formData = new FormData();

    const imageArr = Array.from(this.state.file);
    imageArr.forEach(image => {
      formData.append("myImage", image);
    });

    // check si le format est valide ou non
    const extensionBadFormat = [".js", ".php", ".rb", ".sql", ".odt"];
    const nameImage = imageArr.map(img => img.name);

    const checkBadFormat = extensionBadFormat.map(extension => {
      return nameImage.map(fileExtension => fileExtension.includes(extension));
    });

    const article = {
      user_id: this.props.userId,
      title: this.state.title,
      subtitle: this.state.subTitle,
      body: this.state.body
    };

    formData.append("myArticle", JSON.stringify(article));

    if (title && body) {
      if (imagesArticle.length + imageArr.length <= 3) {
        if (!checkBadFormat.find(check => check === true)) {
          axios
            .put(
              `${process.env.REACT_APP_API_URL}/articles/${
                this.props.editArticle.id
              }`,
              formData,
              {
                headers: {
                  "content-type": "multipart/form-data",
                  "x-auth-token": this.props.token
                }
              }
            )
            .then(response => {
              console.log(response);
              this.setState({ show: true, success: response.data.message });

              setTimeout(() => {
                this.setState({ show: false });
                this.props.history.push("/article");
              }, 1300);
            })
            .catch(error => {
              console.log(error);
              const userDeconnect = error.response.status === 401;
              const fileExtension = error.response.status === 404;
              const numberImagesExceeded = error.response.status === 500;
              if (numberImagesExceeded) {
                this.setState({ messageError: error.response.data.message });
              }
              if (fileExtension) {
                this.setState({ messageError: error.response.data.message });
              }
              if (userDeconnect) {
                alert(error.response.data.message);
                this.props.removeToken(this.props.token);
                this.props.history.push("/");
              }
            });
        } else {
          this.setState({
            messageError: "Image non valide à cause du format"
          });
        }
      } else {
        this.setState({
          messageError: "Vous avez depassé la limite d'images, 3 par article"
        });
      }
    }
  };

  deleteImage(e, imageId, token) {
    e.preventDefault();
    this.props.removeImage(imageId, token);
  }

  onChange = event => {
    this.setState({ file: event.target.files });
  };

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
          <p>{this.state.messageError}</p>
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
            {this.state.imagesArticle.length > 0 ? (
              this.state.imagesArticle.map(img => {
                return (
                  <div
                    className="EditArticle__container__align__image"
                    key={img.imageId}
                  >
                    <div>
                      <p>{img.image_name}</p>
                      <button
                        onClick={e =>
                          this.deleteImage(e, img.imageId, this.props.token)
                        }
                        className="btn btn-danger"
                      >
                        Supprimer cette photo
                      </button>
                    </div>
                    <br />
                  </div>
                );
              })
            ) : (
              <p>Pas d'image</p>
            )}
          </div>
          <label>Image</label>
          <input
            name="myImage"
            type="file"
            multiple
            onChange={this.onChange}
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
    showSuccessModal: state.showSuccessModal,
    editArticle: state.editArticle
  };
}

function mapDispatchToProps(dispatch) {
  return {
    removeImage(imageId, token) {
      dispatch(deleteImageEditArticle(imageId, token));
    },
    initializeShowMessage(bool) {
      dispatch(showMessageDelete(bool));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditArticle);
