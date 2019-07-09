import React, { Component } from "react";
import { connect } from "react-redux";
import {
  removeUserToken,
  editArticle,
  oneArticle
} from "../../redux/actions/action";
import axios from "axios";

class Article extends Component {
  state = {
    dataArticles: [],
    dataResources: [],
    success: "",
    search: "",
    show: false,
    articleById: "",
    file: []
  };

  componentDidMount() {
    this.fetchArticles();
    this.fetchResources();
  }

  hideModal = () => {
    this.setState({ show: false });
  };

  fetchArticles() {
    axios
      .get(`${process.env.REACT_APP_API_URL}/articles`, {
        headers: { "x-auth-token": this.props.token }
      })
      .then(response => {
        this.setState({ dataArticles: response.data });
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

  fetchResources() {
    axios
      .get(`${process.env.REACT_APP_API_URL}/resources`, {
        headers: { "x-auth-token": this.props.token }
      })
      .then(response => {
        console.log(response);
        this.setState({ dataResources: response.data });
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

  formatDate = date => {
    const formatDate = new Date(date);
    return formatDate.toLocaleString("fr-FR", { timeZone: "Europe/Paris" });
  };

  deleteArticleById = id => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/articles/${id}`, {
        headers: { "x-auth-token": this.props.token }
      })
      .then(response => {
        this.setState(prevState => {
          return {
            show: false,
            success: response.data.message,
            dataArticles: prevState.dataArticles.filter(
              articleId => articleId.id !== id
            )
          };
        });
      })
      .catch(error => {
        console.log(error.response);
        const userDeconnect = error.response.status === 401;
        if (userDeconnect) {
          alert(error.response.data.message);
          this.props.removeToken(this.props.token);
          this.props.history.push("/");
        }
      });
  };

  redirectToAddArticle = () => {
    this.props.history.push("/addArticle");
  };

  redirectToAddResource = () => {
    this.props.history.push("/addResource");
  };

  redirectArticle = (editOrseeArticle, id) => {
    const articleById = this.state.dataArticles.find(articleId => {
      return articleId.id === id;
    });

    if (editOrseeArticle === "editArticle") {
      this.props.editArticle(articleById);
      this.props.history.push("/editArticle");
    }
    if (editOrseeArticle === "seeArticle") {
      this.props.oneArticle(articleById);
      this.props.history.push("/oneArticle");
    }
  };

  onChange = event => {
    this.setState({ file: event.target.files });
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    const { dataArticles, search, dataResource } = this.state;
    console.log(dataResource);

    const filteredArticlesByTitle = dataArticles.filter(article => {
      return article.title.toLowerCase().includes(search.toLowerCase());
    });
    return (
      <div className="container">
        {this.state.show ? (
          <div className="Modal__container">
            <div className="Modal__main">
              <h4>Êtes-vous sûr de vouloir supprimer ?</h4>
              <div className="Modal__confirmModal">
                <button
                  className="btn btn-primary"
                  onClick={() => this.deleteArticleById(this.state.articleById)}
                >
                  Oui
                </button>
                <button className="btn btn-danger" onClick={this.hideModal}>
                  Non
                </button>
              </div>
            </div>
          </div>
        ) : null}
        <div className="rightButton">
          <button
            className="btn btn-primary mr-3"
            onClick={() => this.redirectToAddResource()}
          >
            Ajouter une ressource
          </button>
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
          {filteredArticlesByTitle.map(articleObj => {
            return (
              <div className="card col-sm-6 col-md-4 mb-4" key={articleObj.id}>
                <div className="">
                  <img
                    className="card-img-top"
                    src={
                      !!articleObj.image
                        ? `${process.env.REACT_APP_API_URL}/${
                            articleObj.image.split(",")[0]
                          }`
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
                    {this.props.userId === articleObj.user_id ? (
                      <div className="containerButton">
                        <button
                          className="btn btn-success"
                          onClick={() =>
                            this.redirectArticle("seeArticle", articleObj.id)
                          }
                        >
                          Voir l'article
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            this.setState({
                              show: true,
                              articleById: articleObj.id
                            })
                          }
                        >
                          supprimer
                        </button>
                        <button
                          className="btn btn-primary"
                          onClick={() =>
                            this.redirectArticle("editArticle", articleObj.id)
                          }
                        >
                          Modifier
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}

          {/*TODO mettre les PDF sous forme de carte avec le logo PDF*/}
          {this.state.dataResources.map(resource => {
            return (
              <div>
                <h1>PDF</h1>
                <a
                  className="text-dark"
                  href={`${process.env.REACT_APP_API_URL}/${resource.name}`}
                  target="_blank"
                >
                  voir ressource
                </a>
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
