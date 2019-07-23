import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

const PrivateRoute = props => {
  return !!props.token ? <Route {...props} /> : <Redirect to="/" />;
};

function mapStateToProps(state) {
  return {
    token: state.user.token
  };
}

export default connect(mapStateToProps)(PrivateRoute);
