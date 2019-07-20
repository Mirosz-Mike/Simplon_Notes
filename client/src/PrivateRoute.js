import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

// Todo trouver une solution si user n'a pas de compte redirect sur /register

const PrivateRoute = props => {
  return !!props.token ? <Route {...props} /> : <Redirect to="/login" />;
};

function mapStateToProps(state) {
  return {
    token: state.user.token
  };
}

export default connect(mapStateToProps)(PrivateRoute);
