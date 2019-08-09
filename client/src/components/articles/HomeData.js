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
    filteredData: [],
    tabFilter: [
      "Filtrer par",
      "Articles",
      "Ressources",
      "Les plus récents",
      "Les plus anciennes"
    ],
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

  redirectToLinkResource = link => {
    window.open(link, "_blank");
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  resetFilter = () => {
    const { filteredData } = this.state;
    if (filteredData.length > 0) {
      this.setState({ filteredData: [] });
    }
  };

  selectFilter = event => {
    const currentValue = event.target.value;
    const { tabFilter, filteredData, dataResources } = this.state;

    if (currentValue === tabFilter[1]) {
      const filterByArticles = dataResources.filter(
        articles => articles.type_resource === "article"
      );
      this.setState({ filteredData: filterByArticles });
    }

    if (currentValue === tabFilter[2]) {
      const filterByResources = dataResources.filter(
        resources => resources.type_resource === "ressource"
      );
      this.setState({ filteredData: filterByResources });
    }

    if (currentValue === tabFilter[3]) {
      if (filteredData.length > 0) {
        this.setState({
          filteredData: filteredData.sort((a, b) =>
            b.updated_at > a.updated_at ? 1 : -1
          )
        });
      }
      this.setState({
        dataResources: dataResources.sort((a, b) =>
          b.updated_at > a.updated_at ? 1 : -1
        )
      });
    }

    if (currentValue === tabFilter[4]) {
      if (filteredData.length > 0) {
        this.setState({
          filteredData: filteredData.sort((a, b) =>
            b.updated_at < a.updated_at ? 1 : -1
          )
        });
      }
      this.setState({
        dataResources: dataResources.sort((a, b) =>
          b.updated_at < a.updated_at ? 1 : -1
        )
      });
    }
  };

  render() {
    const {
      dataResources,
      filteredData,
      search,
      data_id,
      tabFilter
    } = this.state;

    const ifFilteredData =
      filteredData.length > 0 ? filteredData : dataResources;

    const filteredDataByTitle = ifFilteredData.filter(resource => {
      return resource.title.toLowerCase().includes(search.toLowerCase());
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
        <h1 className="HomeData__content__text__resources">RESSOURCES</h1>
        <div className="HomeData__content__align">
          <input
            type="text"
            name="search"
            className="form-control HomeData__content__input mt-3 mb-3 mr-3"
            placeholder="Votre recherche"
            value={search}
            onChange={this.handleChange}
          />
          <select
            className="HomeData__dropdown btn btn-dark"
            onChange={this.selectFilter}
          >
            {tabFilter.map(filter => {
              return <option key={filter}>{filter}</option>;
            })}
          </select>

          <button
            className="HomeData__custom__buttons__reinit btn btn-dark"
            onClick={this.resetFilter}
          >
            Réinitialiser
          </button>
          <div className="HomeData__content__align__buttons">
            <button
              className="HomeData__content__custom__button mr-3"
              onClick={() => this.redirectToAddResource()}
            >
              Ajouter une ressource
            </button>
            <button
              className="HomeData__content__custom__button"
              onClick={() => this.redirectToAddArticle()}
            >
              Ajouter un article
            </button>
          </div>
        </div>
        <div className="HomeData__content__background">
          <div className="row">
            {filteredDataByTitle.map(data => {
              return data.type_resource.includes("article") ? (
                <div
                  className="HomeData__content__custom__card card mr-5 col-md-3"
                  key={data.id}
                >
                  <div className="card-body">
                    <div>
                      <h4 className="HomeData__content__title__h4">
                        {data.title}
                      </h4>
                      {this.props.userId === data.user_id ? (
                        <div className="HomeData__content__align__text__and__buttons">
                          <button
                            className="HomeData__content__button__see mr-2"
                            onClick={() =>
                              this.redirectArticle("seeArticle", data.id)
                            }
                          />
                          <button
                            className="HomeData__content__button__delete mr-2"
                            onClick={() =>
                              this.setState({
                                show: true,
                                data_id: data.id,
                                type_resource: data.type_resource
                              })
                            }
                          />
                          <button
                            className="HomeData__content__button__edit mr-2"
                            onClick={() =>
                              this.redirectArticle("editArticle", data.id)
                            }
                          />
                        </div>
                      ) : (
                        <div className="HomeData__content__align__text__and__buttons">
                          <button
                            className="HomeData__content__button__see mr-2"
                            onClick={() =>
                              this.redirectArticle("seeArticle", data.id)
                            }
                          />
                        </div>
                      )}
                    </div>
                    <p className="HomeData__content__text__author">
                      De {data.author}
                    </p>
                    <div className="HomeData__content__text text-justify">
                      {data.body.length < 100
                        ? "Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500..."
                        : data.body}
                      <br />
                      <br />
                      <p>{this.formatDate(data.updated_at)}</p>
                    </div>
                  </div>
                </div>
              ) : data.type_resource.includes("ressource") ? (
                <div
                  className="HomeData__content__custom__card card mr-5 col-md-3 mb-4"
                  key={data.id}
                >
                  <div className="card-body">
                    <h4 className="HomeData__content__title__h4">
                      {data.title}
                    </h4>
                    {this.props.userId === data.user_id ? (
                      <div>
                        <button
                          className="HomeData__content__button__see mr-2"
                          onClick={() =>
                            this.redirectToLinkResource(
                              `${process.env.REACT_APP_API_URL}/${
                                data.name_resource
                              }`
                            )
                          }
                        />
                        <button
                          className="HomeData__content__button__delete mr-2"
                          onClick={() =>
                            this.setState({
                              show: true,
                              data_id: data.id,
                              type_resource: data.type_resource
                            })
                          }
                        />
                      </div>
                    ) : <button
                          className="HomeData__content__button__see mr-2"
                          onClick={() =>
                            this.redirectToLinkResource(
                              `${process.env.REACT_APP_API_URL}/${
                                data.name_resource
                              }`
                            )
                          }
                        />
                      }
                    <p className="HomeData__content__text__author">
                      De {data.author}
                    </p>
                    <div className="HomeData__content__text text-justify">
                      <p>{this.formatDate(data.updated_at)}</p>
                    </div>
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userId: state.userId,
    token: state.token,
    name: state.userName
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
