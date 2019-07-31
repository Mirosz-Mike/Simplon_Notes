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
    console.log(this.state.imageArticles.map(image => image));

    return (
      <div className="container">
        <div className="ml-5 mr-5 pt-5">
          <h2 className=" title-h2-black">{title}</h2>
          <h4 className="title-h3">{subtitle}</h4>
          <img
            className="mb-3"
            src={
              this.state.imageArticles.length > 0
                ? `${process.env.REACT_APP_API_URL}/${
                    this.state.imageArticles[0]
                  }`
                : process.env.PUBLIC_URL + "/simplon.png"
            }
            alt="Avatar"
            style={{ width: "100%" }}
          />
          <p className="text-justify mb-3">{body}</p>
          <div className="row">
            <img
              src={
                this.state.imageArticles.length > 0
                  ? `${process.env.REACT_APP_API_URL}/${
                      this.state.imageArticles[1]
                    }`
                  : process.env.PUBLIC_URL + "/simplon.png"
              }
              alt="No available"
              style={{ width: "100%", paddingRight: "15px" }}
            />
          </div>
          <p className="OneArticle__grey">De {author}</p>
          <p className="OneArticle__grey">{this.formatDate(updated_at)}</p>
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
