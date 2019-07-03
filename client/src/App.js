import React from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Login from "./components/login/Login";
import Home from "./components/home/Home";
import Register from "./components/register/Register";
import Articles from "./components/articles/Articles";
import CreateArticle from "./components/addArticle/CreateArticle";
import EditArticle from "./components/editArticle/EditArticle";
import OneArticle from "./components/articles/article/OneArticle";

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
          <Route path="/article" component={Articles} />
          <Route path="/addArticle" component={CreateArticle} />
          <Route path="/editArticle/" component={EditArticle} />
          <Route path="/oneArticle" component={OneArticle} />
        </div>
      </Router>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    token: state.user.token
  };
}

export default connect(mapStateToProps)(App);
