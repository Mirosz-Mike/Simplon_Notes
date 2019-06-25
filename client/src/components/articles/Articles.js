import React, { Component } from "react";
import { connect } from "react-redux";
import {
  removeUserToken,
  editArticle,
  oneArticle
} from "../../redux/actions/user_action";
import axios from "axios";

import "./Articles.css";

class Article extends Component {
  state = {
    dataArticles: [],
    message: "",
    search: "",
    show: false
  };

  componentDidMount() {
    this.fetchArticles();
  }

  fetchArticles() {
    axios
      .get("http://localhost:8012/articles", {
        headers: { "x-auth-token": this.props.token }
      })
      .then(response => {
        console.log(response);
        this.setState({ dataArticles: response.data });
      })
      .catch(error => {
        this.props.removeToken(this.props.token);
        this.props.history.push("/");
      });
  }

  formatDate = date => {
    const formatDate = new Date(date);
    return formatDate.toLocaleString("fr-FR", { timeZone: "Europe/Paris" });
  };

  deleteArticleById = id => {
    axios
      .delete(`http://localhost:8012/articles/${id}`, {
        headers: { "x-auth-token": this.props.token }
      })
      .then(response => {
        this.setState(prevState => {
          return {
            show: true,
            message: response.data.message,
            dataArticles: prevState.dataArticles.filter(
              articleId => articleId.id !== id
            )
          };
        });

        setTimeout(() => {
          this.setState({ show: false });
        }, 1000);
      })
      .catch(error => {
        this.setState({ message: error.response.data.message });
      });
  };

  redirectToAddArticle = () => {
    this.props.history.push("/addArticle");
  };

  redirectToEditArticle = id => {
    const articleById = this.state.dataArticles.find(articleId => {
      return articleId.id === id;
    });

    this.props.editArticle(articleById);
    this.props.history.push("/editArticle");
  };

  redirectToSeeArticle = id => {
    const articleById = this.state.dataArticles.find(articleId => {
      return articleId.id === id;
    });

    this.props.oneArticle(articleById);
    this.props.history.push("/oneArticle");
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    const { dataArticles, search } = this.state;
    const filteredArticlesByTitle = dataArticles.filter(article => {
      return article.title.toLowerCase().includes(search.toLowerCase());
    });
    return (
      <div className="container">
        <div className="rightButton">
          <button
            className="btn btn-success"
            onClick={() => this.redirectToAddArticle()}
          >
            Ajouter un article
          </button>
        </div>
        <div>
          <input
            type="text"
            name="search"
            className="form-control mt-3 mb-3"
            placeholder="Votre recherche"
            value={search}
            onChange={this.handleChange}
          />
        </div>
        <div className="row">
          {/* Todo: faire en sorte 3 articles par rangé  */}
          {filteredArticlesByTitle.map(articleObj => {
            console.log(articleObj);
            return (
              <div className="card col-sm-4" key={articleObj.id}>
                <div className="">
                  <img
                    className="card-img-top"
                    src={
                      !!articleObj.image
                        ? articleObj.image.split(",")[0]
                        : process.env.PUBLIC_URL + "/simplon.png"
                    }
                    alt="Avatar"
                    style={{ width: "100%" }}
                  />
                  <div className="card-body">
                    <p className="card-title">De {articleObj.author}</p>
                    <p className="subtitle is-6">@{articleObj.author}</p>
                    <h4 className="title-h4">{articleObj.title}</h4>
                    <div className="card-text">
                      {articleObj.body.length < 100
                        ? "Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500..."
                        : articleObj.body}
                      <br />
                      <br />
                      <p>{this.formatDate(articleObj.updated_at)}</p>
                    </div>
                    <div className="containerButton">
                      <button
                        className="btn btn-success"
                        onClick={() => this.redirectToSeeArticle(articleObj.id)}
                      >
                        Voir l'article
                      </button>
                      {this.props.userId === articleObj.user_id ? (
                        <div>
                          <button
                            className="btn btn-danger"
                            onClick={() =>
                              this.deleteArticleById(articleObj.id)
                            }
                          >
                            supprimer
                          </button>
                          <button
                            className="btn btn-primary"
                            onClick={() =>
                              this.redirectToEditArticle(articleObj.id)
                            }
                          >
                            Modifier
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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

function mapDispatchToProps(dispatch) {
  return {
    removeToken(removeToken) {
      dispatch(removeUserToken(removeToken));
    },
    editArticle(article) {
      dispatch(editArticle(article));
    },
    oneArticle(getOneArticle) {
      dispatch(oneArticle(getOneArticle));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Article);
