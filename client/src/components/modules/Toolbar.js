import React, { Component } from "react";
import "./Toolbar.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export class StyleButton extends Component {
  constructor() {
    super();

    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    let className = "";
    if (typeof this.props.label !== "string") {
      className = "toolbar-icon-btn";
    } else {
      className = "toolbar-btn";
    }

    if (this.props.active) {
      className += " toolbar-active-btn";
    }

    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    );
  }
}

class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDropdown: false,
    };

    this.onToggle = (e, style) => {
      e.preventDefault();
      this.props.onToggle(style, this.props.customStyleMap);
      this.setState({ showDropdown: false });
    };

    this.toggleMenu = (e) => {
      e.preventDefault();
      this.setState((prevState) => ({ showDropdown: !prevState.showDropdown }));
    };
  }

  render() {
    const currentStyle = this.props.editorState.getCurrentInlineStyle();
    // option refers to each individual style in the dropdown
    const currentOption = this.props.STYLE_LIST.filter((option) => currentStyle.has(option.style));
    // assuming unstyled text has default font styling
    let optionDisplayed = this.props.defaultOption;
    if (currentOption.length === 1) {
      optionDisplayed = currentOption[0].label;
    }

    // displays special icon if text color or highlight menu
    if (this.props.colorMenu) {
      optionDisplayed = (
        <div
          className="dropdown-color-first"
          style={{ borderBottom: `3px solid ${optionDisplayed}` }}
        >
          {/* text icon if text color (therefore default is #6e6e6e), highlight icon if highlight color*/}
          {this.props.defaultOption === "#6e6e6e" ? (
            <FontAwesomeIcon icon="font" />
          ) : (
            <FontAwesomeIcon icon="highlighter" />
          )}
        </div>
      );
    }

    const optionButtons = this.props.STYLE_LIST.map((option, k) => {
      return (
        <div
          key={k}
          // PLEASE CLEAN THIS UP IT'S AWFUL. THERE ARE 3 DIFFERENT WIDTHS I NEED
          className={`${this.props.wideMenu && "dropdown-btn-wide"} ${this.props.colorMenu &&
            "dropdown-btn-color"} ${option.label === optionDisplayed &&
            "dropdown-btn-active"} dropdown-btn`}
          onMouseDown={(e) => this.onToggle(e, option.style)}
        >
          {/* if color menu, display squares of color instead of just the name */}
          {this.props.colorMenu ? (
            <div className="dropdown-color" style={{ backgroundColor: option.label }}></div>
          ) : (
            option.label
          )}
        </div>
      );
    });

    return (
      <div className="dropdown-container">
        <div
          onMouseDown={(e) => this.toggleMenu(e)}
          className={`${this.props.wideMenu && "dropdown-btn-wide"} ${this.props.colorMenu &&
            "dropdown-btn-color"} dropdown-first-btn`}
        >
          {optionDisplayed}
          {!this.props.colorMenu && <FontAwesomeIcon icon="caret-down" />}
        </div>
        {this.state.showDropdown && (
          <div
            className={`${this.props.wideMenu && "dropdown-menu-wide"} ${this.props.colorMenu &&
              "dropdown-menu-color"} dropdown-menu`}
          >
            {optionButtons}
          </div>
        )}
      </div>
    );
  }
}

class InlineStyleControls extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const currentStyle = this.props.editorState.getCurrentInlineStyle();
    return (
      <div className="toolbar-btn-group">
        {this.props.INLINE_STYLES.map((type, k) => (
          <StyleButton
            key={"inline " + k}
            active={currentStyle.has(type.style)}
            label={type.label}
            onToggle={this.props.onToggle}
            style={type.style}
          />
        ))}
      </div>
    );
  }
}

export class BlockStyleControls extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const selection = this.props.editorState.getSelection();
    const blockType = this.props.editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();
    return (
      <div className="toolbar-btn-group">
        {this.props.BLOCK_TYPES.map((type, k) => (
          <StyleButton
            key={"block " + k}
            active={type.style === blockType}
            label={type.label}
            onToggle={this.props.onToggle}
            style={type.style}
          />
        ))}
      </div>
    );
  }
}

/**
 * Toolbar is a component for displaying the rich editor toolbar
 *
 * Proptypes
 * @param {Object} editorState
 * @param {Object} fontFamilyStyleMap
 * @param {Object} fontSizeStyleMap
 * @param {func} setInlineStyle
 * @param {func} toggleInlineStyle
 * @param {func} toggleBlockType
 **/
class Toolbar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const INLINE_STYLES = [
      { label: <FontAwesomeIcon icon="bold" />, style: "BOLD" },
      { label: <FontAwesomeIcon icon="italic" />, style: "ITALIC" },
      { label: <FontAwesomeIcon icon="underline" />, style: "UNDERLINE" },
      { label: <FontAwesomeIcon icon="strikethrough" />, style: "STRIKETHROUGH" },
    ];

    const BLOCK_TYPES = [
      {
        label: <FontAwesomeIcon icon="list-ul" />,
        style: "unordered-list-item",
      },
      {
        label: <FontAwesomeIcon icon="list-ol" />,
        style: "ordered-list-item",
      },
      { label: "Event", style: "CustomBullet1" },
      { label: "Note", style: "CustomBullet2" },
      { label: "Task", style: "CustomBullet3" },
    ];

    const FONT_FAMILIES = [
      { label: "Inconsolata", style: "INCONSOLATA" },
      { label: "Lora", style: "LORA" },
      { label: "Montserrat", style: "MONTSERRAT" },
      { label: "Neucha", style: "NEUCHA" },
      { label: "Poppins", style: "POPPINS" },
    ];

    const FONT_SIZES = [
      { label: "12", style: "12" },
      { label: "14", style: "14" },
      { label: "16", style: "16" },
      { label: "18", style: "18" },
      { label: "20", style: "20" },
      { label: "24", style: "24" },
      { label: "32", style: "32" },
    ];

    const HIGHLIGHT_COLORS = [
      { label: "rgba(0, 0, 0, 0)", style: "none" },
      { label: "#FFCFE2", style: "pinkHighlight" },
      { label: "#FDFF8A", style: "yellowHighlight" },
      { label: "#BFFFB8", style: "greenHighlight" },
      { label: "#B8F9FF", style: "blueHighlight" },
      { label: "#D5B8FF", style: "purpleHighlight" },
    ];

    const TEXT_COLORS = [
      { label: "#6e6e6e", style: "default" },
      { label: "#A80000", style: "redText" },
      { label: "#22854C", style: "greenText" },
      { label: "#174B8A", style: "blueText" },
      { label: "#4D1586", style: "purpleText" },
      { label: "#A6178E", style: "pinkText" },
    ];

    return (
      <div className="editor-toolbar-container">
        <Dropdown
          STYLE_LIST={FONT_FAMILIES}
          defaultOption="Poppins"
          wideMenu={true}
          editorState={this.props.editorState}
          customStyleMap={this.props.fontFamilyStyleMap}
          onToggle={this.props.setInlineStyle}
        />
        <Dropdown
          STYLE_LIST={FONT_SIZES}
          defaultOption="16"
          editorState={this.props.editorState}
          customStyleMap={this.props.fontSizeStyleMap}
          onToggle={this.props.setInlineStyle}
        />
        <Dropdown
          STYLE_LIST={TEXT_COLORS}
          defaultOption="#6e6e6e"
          colorMenu={true}
          editorState={this.props.editorState}
          customStyleMap={this.props.textColorStyleMap}
          onToggle={this.props.setInlineStyle}
        />
        <Dropdown
          STYLE_LIST={HIGHLIGHT_COLORS}
          defaultOption="rgba(0, 0, 0, 0)"
          colorMenu={true}
          editorState={this.props.editorState}
          customStyleMap={this.props.highlightStyleMap}
          onToggle={this.props.setInlineStyle}
        />
        <InlineStyleControls
          INLINE_STYLES={INLINE_STYLES}
          editorState={this.props.editorState}
          onToggle={this.props.toggleInlineStyle}
        />
        <BlockStyleControls
          BLOCK_TYPES={BLOCK_TYPES}
          editorState={this.props.editorState}
          onToggle={this.props.toggleBlockType}
        />
      </div>
    );
  }
}

export default Toolbar;
