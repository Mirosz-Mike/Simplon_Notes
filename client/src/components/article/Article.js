import React, { Component } from "react";
import { connect } from "react-redux";
import { removeUserToken, editArticle } from "../../redux/actions/user_action";
import axios from "axios";

import "./Article.css";

class Article extends Component {
  state = {
    dataArticles: [],
    message: "",
    search: ""
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
            dataArticles: prevState.dataArticles.filter(
              articleId => articleId.id !== id
            )
          };
        });
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

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };
  // @Todo Voir les issues

  render() {
    const { dataArticles, search } = this.state;
    const filteredArticles = dataArticles.filter(article => {
      return article.title.toLowerCase().indexOf(search.toLowerCase()) !== -1;
    });
    return (
      <div>
        <h1>{this.state.message}</h1>
        <div className="rightButton">
          <button onClick={() => this.redirectToAddArticle()}>
            Ajouter un article
          </button>
        </div>
        <input
          type="text"
          name="search"
          placeholder="Votre recherche"
          value={search}
          onChange={this.handleChange}
        />
        <div className="wrapper">
          {filteredArticles.map(articleObj => {
            return (
              <div className="card" key={articleObj.id}>
                <img
                  src="https://i.pinimg.com/originals/62/64/21/62642184fd45b733c2c77fa6fa13caf5.jpg"
                  alt="Avatar"
                  style={{ width: "100%" }}
                />
                <div className="container">
                  <h4>{articleObj.title}</h4>
                  <h6>{articleObj.subtitle}</h6>
                  {this.props.userId === articleObj.user_id ? (
                    <button
                      onClick={() => this.deleteArticleById(articleObj.id)}
                    >
                      supprimer
                    </button>
                  ) : null}

                  {this.props.userId === articleObj.user_id ? (
                    <button
                      onClick={() => this.redirectToEditArticle(articleObj.id)}
                    >
                      Modifier
                    </button>
                  ) : null}

                  <button>Voir l'article</button>
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
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Article);
