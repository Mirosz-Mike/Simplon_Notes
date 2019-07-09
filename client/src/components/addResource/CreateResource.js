import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Modal from "../../shared/Modal/Modal";

class CreateResource extends Component {
  state = {
    success: "",
    file: [],
    messageError: "",
    show: false
  };

  handleSubmit = event => {
    event.preventDefault();
    const formData = new FormData();

    const resourceArr = Array.from(this.state.file);
    resourceArr.forEach(resource => {
      formData.append("myResource", resource);
    });

    const resource = {
      user_id: this.props.userId
    };

    formData.append("myResource", JSON.stringify(resource));

    if (this.state.file.length > 0) {
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
          const userDeconnect = error.response.status === 401;
          if (userDeconnect) {
            alert(error.response.data.message);
            this.props.removeToken(this.props.token);
            this.props.history.push("/");
          }
        });
    } else {
      this.setState({ messageError: "Veuillez ajouter une ressource" });
    }
  };

  onChange = event => {
    this.setState({ file: event.target.files, messageError: "" });
  };

  render() {
    return (
      <div>
        <div className="CreateResource__container">
          <Modal show={this.state.show}>{this.state.success}</Modal>
          <form
            className="CreateResource__container__form mt-5"
            onSubmit={this.handleSubmit}
          >
            <p>{this.state.messageError}</p>
            <label>Ressource</label>
            <input
              name="myResource"
              type="file"
              multiple
              onChange={this.onChange}
              className="CreateResource__container__input "
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
    userId: state.user.userId,
    token: state.user.token,
    name: state.user.userName
  };
}

export default connect(mapStateToProps)(CreateResource);
