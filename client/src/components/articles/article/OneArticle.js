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
          <h2 className="pt-3 title-h2-black">{title}</h2>
          <h4 className="title-h3">{subtitle}</h4>
          {image.split(",").map(image => (
            <img src={image} alt="Avatar" style={{ width: "100%" }} />
          ))}
          {body.length < 100
            ? "Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500..."
            : body}
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
