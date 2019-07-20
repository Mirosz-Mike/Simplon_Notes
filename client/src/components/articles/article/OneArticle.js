import React, { Component } from "react";
import { connect } from "react-redux";

class OneArticle extends Component {
  formatDate = date => {
    const formatDate = new Date(date);
    return formatDate.toLocaleString("fr-FR", { timeZone: "Europe/Paris" });
  };

  render() {
    const {
      title,
      author,
      subtitle,
      image,
      body,
      updated_at
    } = this.props.oneArticle;

    return (
      <div className="container">
        <div className="ml-5 mr-5 pt-5">
          <h2 className=" title-h2-black">{title}</h2>
          <h4 className="title-h3">{subtitle}</h4>
          <img
            className="mb-3"
            src={
              !!image
                ? typeof image.split(",")[0] === "undefined"
                  ? process.env.PUBLIC_URL + "/simplon.png"
                  : `${process.env.REACT_APP_API_URL}/${image.split(",")[0]}`
                : process.env.PUBLIC_URL + "/simplon.png"
            }
            alt="Avatar"
            style={{ width: "100%" }}
          />
          <p className="text-justify mb-3">{body}</p>
          <div className="row">
            <img
              src={
                !!image
                  ? typeof image.split(",")[1] === "undefined"
                    ? null
                    : `${process.env.REACT_APP_API_URL}/${image.split(",")[1]}`
                  : null
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
    oneArticle: state.user.oneArticle
  };
}
export default connect(mapStateToProps)(OneArticle);
