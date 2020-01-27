import React, { Component } from "react";

class WidgetButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: null,
    };
  }

  handleOnClick = (name) => {
    this.props.handleOnClick(name);
    if (name === this.state.active)
      this.setState({
        active: null,
      });
    else
      this.setState({
        active: name,
      });
  };

  render() {
    const buttons = this.props.widgetlist.map((widget, k) => (
      <button
        key={k}
        className={`calendar-widget-btn ${this.state.active == widget.name ? "active" : ""}`}
        type="button"
        onClick={() => this.handleOnClick(widget.name)}
      >
        {widget.name}
      </button>
    ));
    return <> {buttons} </>;
  }
}

export default WidgetButton;
