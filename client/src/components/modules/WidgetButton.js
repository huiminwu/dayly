import React, { Component } from "react";

class WidgetButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let buttons = this.props.widgetlist.map((widget, k) => (
      <button
        key={k}
        className="calendar-widget-btn"
        type="button"
        onClick={() => this.props.handleWidgetSelect(widget.name)}
      >
        {widget.name}
      </button>
    ));
    return { buttons };
  }
}
export default WidgetButton;
