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
          <img
            className="mb-3"
            src={
              !!image
                ? image.split(",")[0]
                : process.env.PUBLIC_URL + "/simplon.png"
            }
            alt="Avatar"
            style={{ width: "100%" }}
          />
          <h4 className="title-h4">Qu'est-ce que le Lorem Ipsum?</h4>
          <p className="text-justify mb-3">
            {body.length < 100
              ? "Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte. Il n'a pas fait que survivre cinq siècles, mais s'est aussi adapté à la bureautique informatique, sans que son contenu n'en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente de feuilles Letraset contenant des passages du Lorem Ipsum, et, plus récemment, par son inclusion dans des applications de mise en page de texte, comme Aldus PageMaker."
              : body}
          </p>
          <div className="row">
            <img
              className="col-md-6"
              src={
                !!image
                  ? image.split(",")[1]
                  : process.env.PUBLIC_URL + "/simplon.png"
              }
              alt="Avatar"
              style={{ width: "100%", paddingRight: "15px" }}
            />
            <div className="col-md-6">
              <h4 className="title-h4">Pourquoi l'utiliser?</h4>
              <p className="text-justify">
                {body.length < 100
                  ? `On sait depuis longtemps que travailler avec du texte lisible et
                contenant du sens est source de distractions, et empêche de se
                concentrer sur la mise en page elle-même. L'avantage du Lorem
                Ipsum sur un texte générique comme 'Du texte. Du texte. Du
                texte.' est qu'il possède une distribution de lettres plus ou
                moins normale, et en tout cas comparable avec celle du français
                standard. De nombreuses suites logicielles de mise en page ou
                éditeurs de sites Web ont fait du Lorem Ipsum leur faux texte
                par défaut, et une recherche pour 'Lorem Ipsum' vous conduira
                vers de nombreux sites qui n'en sont encore qu'à leur phase de
                construction. Plusieurs versions sont apparues avec le temps,
                parfois par accident, souvent intentionnellement (histoire d'y
                rajouter de petits clins d'oeil, voire des phrases
                embarassantes).`
                  : body}
              </p>
            </div>
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
