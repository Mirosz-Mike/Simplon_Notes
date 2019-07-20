import React, { Component } from "react";
import { connect } from "react-redux";
import {
  removeUserToken,
  editArticle,
  oneArticle
} from "../../redux/actions/action";
import axios from "axios";

class HomeData extends Component {
  state = {
    dataResources: [],
    success: "",
    search: "",
    show: false,
    data_id: "",
    type_resource: "",
    file: []
  };

  componentDidMount() {
    this.fetchData();
  }

  hideModal = () => {
    this.setState({ show: false });
  };

  fetchData() {
    const urlArticle = axios.get(`${process.env.REACT_APP_API_URL}/articles`, {
      headers: { "x-auth-token": this.props.token }
    });
    const urlResource = axios.get(
      `${process.env.REACT_APP_API_URL}/resources`,
      {
        headers: { "x-auth-token": this.props.token }
      }
    );

    Promise.all([urlArticle, urlResource])
      .then(response => {
        const tab = [];
        response.forEach(data => tab.push(data.data));
        const allData = tab[0].concat(tab[1]);

        this.setState({ dataResources: allData });
      })
      .catch(error => {
        const userDeconnect = error.response.data;
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

  deleteDataById = id => {
    const articleOrResource = this.state.type_resource.includes("article")
      ? `${process.env.REACT_APP_API_URL}/articles/${id}`
      : `${process.env.REACT_APP_API_URL}/resources/${id}`;
    axios
      .delete(articleOrResource, {
        headers: { "x-auth-token": this.props.token }
      })
      .then(response => {
        this.setState(prevState => {
          return {
            show: false,
            success: response.data.message,
            dataResources: prevState.dataResources.filter(
              articleId => articleId.id !== id
            )
          };
        });
      })
      .catch(error => {
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
    const articleById = this.state.dataResources.find(articleId => {
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
    const { dataResources, search, data_id } = this.state;

    const filteredDataByTitle = dataResources.filter(article => {
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
                  onClick={() => this.deleteDataById(data_id)}
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
          {filteredDataByTitle.map(data => {
            return data.type_resource.includes("article") ? (
              <div className="card col-sm-6 col-md-4 mb-4" key={data.id}>
                <div className="">
                  <img
                    className="card-img-top"
                    src={
                      !!data.image
                        ? `${process.env.REACT_APP_API_URL}/${
                            data.image.split(",")[0]
                          }`
                        : process.env.PUBLIC_URL + "/simplon.png"
                    }
                    alt="Avatar"
                    style={{ width: "100%" }}
                  />
                  <div className="card-body">
                    <p className="card-title">De {data.author}</p>
                    <p className="subtitle is-6">@{data.author}</p>
                    <h4 className="title-h4">{data.title}</h4>
                    <div className="card-text">
                      {data.body.length < 100
                        ? "Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500..."
                        : data.body}
                      <br />
                      <br />
                      <p>{this.formatDate(data.updated_at)}</p>
                      <div className="containerButton">
                        <button
                          className="btn btn-success"
                          onClick={() =>
                            this.redirectArticle("seeArticle", data.id)
                          }
                        >
                          Voir l'article
                        </button>
                      </div>
                    </div>
                    {this.props.userId === data.user_id ? (
                      <div>
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            this.setState({
                              show: true,
                              data_id: data.id,
                              type_resource: data.type_resource
                            })
                          }
                        >
                          supprimer
                        </button>
                        <button
                          className="btn btn-primary"
                          onClick={() =>
                            this.redirectArticle("editArticle", data.id)
                          }
                        >
                          Modifier
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : data.type_resource.includes("ressource") ? (
              <div className="card col-sm-6 col-md-4 mb-4" key={data.id}>
                <img
                  className="card-img-top"
                  src="https://www.sterkmiddendrenthe.nl/wp-content/uploads/2017/06/pdf-icon-png-17.png"
                  alt="Avatar"
                  style={{ width: "100%" }}
                />
                <div className="card-body">
                  <p className="card-title">De {data.author}</p>
                  <p className="subtitle is-6">@{data.author}</p>
                  <h4 className="title-h4">{data.title}</h4>
                  <p>{this.formatDate(data.updated_at)}</p>
                  <div className="card-text">
                    <a
                      className="btn btn-success"
                      href={`${process.env.REACT_APP_API_URL}/${
                        data.nameResource
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      voir ressource
                    </a>
                    {this.props.userId === data.user_id ? (
                      <div>
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            this.setState({
                              show: true,
                              data_id: data.id,
                              type_resource: data.type_resource
                            })
                          }
                        >
                          supprimer
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null;
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
)(HomeData);
