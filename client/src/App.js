import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Login from "./components/login/Login";
import Home from "./components/home/Home";
import Register from "./components/register/Register";
import Articles from "./components/articles/Articles";
import CreateArticle from "./components/addArticle/CreateArticle";
import EditArticle from "./components/editArticle/EditArticle";
import OneArticle from "./components/articles/article/OneArticle";

const App = () => {
  return (
    <div>
      <Router>
        <Navbar />
        <div className="App">
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/article" component={Articles} />
          <Route path="/addArticle" component={CreateArticle} />
          <Route path="/editArticle" component={EditArticle} />
          <Route path="/oneArticle" component={OneArticle} />
        </div>
      </Router>
    </div>
  );
};

export default App;
