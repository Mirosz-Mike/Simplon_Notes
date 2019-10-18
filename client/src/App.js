import React from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Register from "./components/register/Register";
import Login from "./components/login/Login";
import Home from "./components/home/Home";
import HomeData from "./components/articles/HomeData";
import CreateArticle from "./components/addArticle/CreateArticle";
import CreateResource from "./components/addResource/CreateResource";
import EditArticle from "./components/editArticle/EditArticle";
import OneArticle from "./components/articles/article/OneArticle";
import PrivateRoute from "./PrivateRoute";

import "./sass/index.scss";

const App = props => {
  return (
    <div className="App">
      <Router>
        {!!props.token ? <Navbar /> : null}
        <div>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/addResource" component={CreateResource} />
          <Route path="/addArticle" component={CreateArticle} />
          <Route path="/editArticle/" component={EditArticle} />
          <Route path="/oneArticle" component={OneArticle} />
          <PrivateRoute path="/article" component={HomeData} />
        </div>
      </Router>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    token: state.token
  };
}

export default connect(mapStateToProps)(App);
