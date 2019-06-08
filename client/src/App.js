import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Login from "./components/login/Login";
import Home from "./components/home/Home";
import Register from "./components/register/Register";
import Article from "./components/article/Article";

import "./App.css";

const App = () => {
  return (
    <div>
      <Router>
        <Navbar />
        <div className="App">
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/article" component={Article} />
        </div>
      </Router>
    </div>
  );
};

export default App;
