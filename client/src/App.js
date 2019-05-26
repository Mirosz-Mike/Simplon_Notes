import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Home from "./components/Home";
import Register from "./components/Register";
import { connect } from "react-redux";

import "./App.css";

const App = () => {
  return (
    <div>
      <Navbar />
      <Router>
        <div className="App">
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
        </div>
      </Router>
    </div>
  );
};

function mapStateToProps(state) {
  console.log("state", state);
  return {
    count: state
  };
}

export default connect(mapStateToProps)(App);
