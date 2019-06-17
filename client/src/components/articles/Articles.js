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
        console.log(response)
        this.setState({ dataArticles: response.data });
      })
      .catch(error => {
        this.setState({ message: error.response.data.message });
        this.props.removeToken(this.props.token);
        this.props.history.push("/");
      });
  }

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
        console.log(error.response);
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

  showButtonEditAndDelete = (userId, id) => {
    if (this.props.userId === userId) {
      return (
        <div className="centerButton">
          <button onClick={() => this.deleteArticleById(id)}>supprimer</button>
          <button onClick={() => this.redirectToEditArticle(id)}>
            Modifier
          </button>
        </div>
      );
    }
    return null;
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    const { dataArticles, search } = this.state;
    console.log(dataArticles)
    const filteredArticlesByTitle = dataArticles.filter(article => {
      return article.title.toLowerCase().includes(search.toLowerCase());
    });
    return (
      <div>
        <div className="rightButton">
          <button onClick={() => this.redirectToAddArticle()}>
            Ajouter un article
          </button>
        </div>
        <div className="centerInput">
          <input
            type="text"
            name="search"
            placeholder="Votre recherche"
            value={search}
            onChange={this.handleChange}
          />
        </div>
        <div className="wrapper">
          {filteredArticlesByTitle.map(articleObj => {
            return (
              <div className="card" key={articleObj.id}>
                <img
                  src={articleObj.image}
                  alt="Avatar"
                  style={{ width: "100%" }}
                />
                <div className="container">
                  <h4>{articleObj.title}</h4>
                  <h6>{articleObj.subtitle}</h6>
                  {this.showButtonEditAndDelete(
                    articleObj.user_id,
                    articleObj.id
                  )}
                  <button
                    onClick={() => this.redirectToSeeArticle(articleObj.id)}
                  >
                    Voir l'article
                  </button>
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
    token: state.user.token
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
