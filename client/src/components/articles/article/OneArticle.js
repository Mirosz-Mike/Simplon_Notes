import React from "react";
import { connect } from "react-redux";
import "./OneArticle.css";
function OneArticle(props) {
  const { title, subtitle, image, body } = props.oneArticle;
  return (
    <div className="centerArticle">
      <div>
        <h2>{title}</h2>
        <h3>{subtitle}</h3>
        <img src={image} alt="Avatar" style={{ width: "100%" }} />
        <p>{body}</p>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    oneArticle: state.user.oneArticle
  };
}
export default connect(mapStateToProps)(OneArticle);
