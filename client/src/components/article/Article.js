import React, { Component } from "react";
import { connect } from "react-redux";
import { removeUserToken, editArticle } from "../../redux/actions/user_action";
import axios from "axios";

import Modal from "../../shared/Modal";
import "./Article.css";

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

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    const { dataArticles, search } = this.state;
    const filteredArticles = dataArticles.filter(article => {
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
                    <div className="centerButton">
                      <button
                        onClick={() => this.deleteArticleById(articleObj.id)}
                      >
                        supprimer
                      </button>
                      <button
                        onClick={() =>
                          this.redirectToEditArticle(articleObj.id)
                        }
                      >
                        Modifier
                      </button>
                    </div>
                  ) : null}
                  <button>Voir l'article</button>
                </div>
              </div>
            );
          })}
        </div>
        {this.state.show && (
          <Modal show={this.state.show} handleClose={this.hideModal}>
            {this.state.message}
          </Modal>
        )}
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
