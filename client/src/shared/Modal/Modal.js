import React, { Component } from "react";

class Modal extends Component {
  render() {
    if (!this.props.show) return null;
    const showHideClassName = this.props.show
      ? "Modal__container display-block"
      : "Modal__container display-none";
    return (
      <div className={showHideClassName}>
        <div className="Modal__main">
          <h3 className="text-bold">{this.props.children}</h3>
        </div>
      </div>
    );
  }
}

export default Modal;
