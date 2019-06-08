import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";

import "./Article.css";

class Article extends Component {
  state = {
    dataArticles: [],
    message: ""
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
        this.props.remove(this.props.token);
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
    return this.props.history.push("/addArticle");
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  // @Todo Ajouter barre de recherche
  // @Todo Ajouter Multer
  // @Todo Ajouter authentification via gmail

  render() {
    const { dataArticles } = this.state;
    return (
      <div>
        <h1>{this.state.message}</h1>
        <div className="rightButton">
          <button onClick={() => this.redirectToAddArticle()}>
            Ajouter un article
          </button>
        </div>
        <div className="wrapper">
          {dataArticles.map(articleObj => {
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
                    <button>Modifier</button>
                  ) : null}

                  <button>Voir plus</button>
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
    remove: removeToken => {
      dispatch({ type: "REMOVE_USER_TOKEN", token: removeToken });
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Article);
