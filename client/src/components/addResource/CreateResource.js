import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Modal from "../../shared/Modal/Modal";

class CreateResource extends Component {
  state = {
    success: "",
    title: "",
    file: [],
    messageError: "",
    show: false,
    msgUserDisconnect: ''
  };

  handleSubmit = event => {
    event.preventDefault();
    const formData = new FormData();

    const resourceArr = Array.from(this.state.file);
    resourceArr.forEach(resource => {
      formData.append("myResource", resource);
    });

    const resource = {
      title: this.state.title,
      user_id: this.props.userId,
      author: this.props.name
    };

    formData.append("myResource", JSON.stringify(resource));

    if (this.state.file.length) {
      axios
        .post(`${process.env.REACT_APP_API_URL}/resources/`, formData, {
          headers: {
            "content-type": "multipart/form-data",
            "x-auth-token": this.props.token
          }
        })
        .then(response => {
          this.setState({ show: true, success: response.data.message });
          setTimeout(() => {
            this.setState({ show: false });
            this.props.history.push("/article");
          }, 1300);
        })
        .catch(error => {
          const fileExtension = error.response.status === 404;
          const userDeconnect = error.response.status === 401;
          if (fileExtension) {
            this.setState({ messageError: error.response.data.message });
          }
          if (userDeconnect) {
            this.setState({ msgUserDisconnect: error.response.data.message, show: true })
          }
        });
    } else {
      this.setState({ messageError: "Veuillez ajouter une ressource" });
    }
  };

  msgUserDisconnect = () => {
    this.props.removeToken(this.props.token);
    this.props.history.push("/");
  }

  handleChange = event => {
    this.setState({ title: event.target.value });
  };

  onChange = event => {
    this.setState({ file: event.target.files, messageError: "" });
  };

  render() {
    const { show, msgUserDisconnect } = this.state
    return (
      <div>
        <div className="CreateResource__container">
          <Modal show={this.state.show}>{this.state.success}</Modal>
          {
            show && !!msgUserDisconnect ? (
            <div className="Modal__container">
              <div className="Modal__main">
                <h4>{msgUserDisconnect}</h4>
                <button
                    className="btn btn-primary"
                    onClick={() => this.msgUserDisconnect()}
                  >
                    OK
                  </button>
              </div>
            </div>
            ) : null
          }
          <form
            className="CreateResource__container__form mt-5"
            onSubmit={this.handleSubmit}
          >
            <p>{this.state.messageError}</p>
            <label>Titre</label>
            <input
              onChange={this.handleChange}
              name="title"
              type="text"
              placeholder="Title"
              className="CreateResource__container__input"
              required
            />
            <label>Ressource</label>
            <input
              name="myResource"
              type="file"
              multiple
              onChange={this.onChange}
              className="CreateResource__container__input"
            />
            <button className="btn btn-success mt-2" type="submit">
              Valider ma resource
            </button>
          </form>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userId: state.userId,
    token: state.token,
    name: state.userName
  };
}

export default connect(mapStateToProps)(CreateResource);
