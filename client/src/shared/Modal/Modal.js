import React, { Component } from "react";

class Modal extends Component {
  render() {
    if (!this.props.show) return null;
    return (
      <div className="Modal__container">
        <div className="Modal__content">
          <h3 className="text-bold">{this.props.children}</h3>
        </div>
      </div>
    );
  }
}

export default Modal;
