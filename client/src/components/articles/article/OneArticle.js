import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";

class OneArticle extends Component {
  state = {
    imageArticles: []
  };

  componentDidMount() {
    this.fetchImagesArticles();
  }

  fetchImagesArticles() {
    axios
      .get(`${process.env.REACT_APP_API_URL}/articles/images`, {
        headers: { "x-auth-token": this.props.token }
      })
      .then(response => {
        const imagesByArticles = response.data.filter(
          articleById => articleById.article_id === this.props.oneArticle.id
        );
        const onlyImageUrl = imagesByArticles.map(imageUrl => imageUrl.image);
        this.setState({ imageArticles: onlyImageUrl });
      })
      .catch(error => {
        console.log(error.message);
      });
  }

  formatDate = date => {
    const formatDate = new Date(date);
    return formatDate.toLocaleString("fr-FR", { timeZone: "Europe/Paris" });
  };

  render() {
    const { title, author, subtitle, body, updated_at } = this.props.oneArticle;

    return (
      <div className="container">
        <div className="ml-5 mr-5 pt-5">
          <img
            className="mb-3 OneArticle__Background__Image"
            src={
              this.state.imageArticles.length
                ? `${process.env.REACT_APP_API_URL}/${
                    this.state.imageArticles[0]
                  }`
                : null
            }
            alt="Avatar"
            style={{ width: "100%" }}
          />
          <h2 className="OneArticle__title">{title}</h2>
          <h4 className="OneArticle__subtitle">{subtitle}</h4>
          <div className="OneArticle__align__content">
            <p className="OneArticle__text__author">{author}</p>|
            <p className="OneArticle__text__date">
              {" "}
              {this.formatDate(updated_at)}
            </p>
          </div>
          <div className="row mb-5">
            {this.state.imageArticles.length  &&
            this.state.imageArticles[1] ? (
              <img
                src={`${process.env.REACT_APP_API_URL}/${
                  this.state.imageArticles[1]
                }`}
                alt="No available"
                style={{ width: "100%", paddingRight: "15px" }}
              />
            ) : null}
          </div>
          <p className="text-justify mb-3 OneArticle__body">{body}</p>
          <div className="row mb-5">
            {this.state.imageArticles.length  &&
            this.state.imageArticles[2] ? (
              <img
                src={`${process.env.REACT_APP_API_URL}/${
                  this.state.imageArticles[2]
                }`}
                alt="No available"
                style={{ width: "100%", paddingRight: "15px" }}
              />
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    token: state.token,
    oneArticle: state.oneArticle
  };
}
export default connect(mapStateToProps)(OneArticle);
