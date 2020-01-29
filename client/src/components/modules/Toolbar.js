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
    // add special customization if the button has a font awesome icon
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

/**
 * Dropdown is a component for displaying dropdown menus in the toolbar
 *
 * Proptypes
 * @param {array} STYLE_LIST mapping styles to their labels
 * @param {string} defaultOption default for unstyled text, also identifies each dropdown
 * @param {string} showDropdown identifies which dropdown, if any, is shown
 * @param {Object} editorState
 * @param {Object} customStyleMap mapping styles to their properties
 * @param {func} setInlineStyle to set the selected style
 * @param {func} toggleDropdown sets which dropdown, if any, is shown
 * @param {bool} wideMenu for the font-family menu, which needs to be wider
 * @param {bool} colorMenu for the font color and highlight menus, which have special icons and widths
 **/
class Dropdown extends Component {
  constructor(props) {
    super(props);

    this.onToggle = (e, style) => {
      e.preventDefault();
      this.props.setInlineStyle(style, this.props.customStyleMap);
      // close the dropdown menu once you've chosen something
      this.props.toggleDropdown(null);
    };

    this.toggleMenu = (e) => {
      e.preventDefault();
      // if the menu is already shown, close the menu
      if (this.props.showDropdown === this.props.defaultOption) {
        this.props.toggleDropdown(null);
      } else {
        // otherwise, open the menu
        this.props.toggleDropdown(this.props.defaultOption);
      }
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
          // three different fixed widths needed: one for font, another for font size, another for color
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
        {/* again, the different dropdowns are identified by their unique default options */}
        {this.props.showDropdown === this.props.defaultOption && (
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
    this.state = {
      showDropdown: null,
    };

    this.container = React.createRef();
  }

  toggleDropdown = (name) => {
    this.setState({ showDropdown: name });
  };

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (this.container.current && !this.container.current.contains(event.target)) {
      this.toggleDropdown(null);
    }
  };

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
      { label: "Task", style: "CustomBullet1" },
      { label: "Note", style: "CustomBullet2" },
      { label: "Event", style: "CustomBullet3" },
    ];

    const FONT_FAMILIES = [
      { label: "Inconsolata", style: "INCONSOLATA" },
      { label: "Lora", style: "LORA" },
      { label: "Montserrat", style: "MONTSERRAT" },
      { label: "Neucha", style: "NEUCHA" },
      { label: "Poppins", style: "POPPINS" },
    ];

    // const FONT_SIZES = [
    //   { label: "12", style: "12" },
    //   { label: "14", style: "14" },
    //   { label: "16", style: "16" },
    //   { label: "18", style: "18" },
    //   { label: "20", style: "20" },
    //   { label: "24", style: "24" },
    //   { label: "32", style: "32" },
    // ];

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
      { label: "#F5F2F4", style: "whiteText" },
    ];

    return (
      <div className="editor-toolbar-container">
        <div className="dropdown-group" ref={this.container}>
          <Dropdown
            STYLE_LIST={FONT_FAMILIES}
            defaultOption="Poppins"
            wideMenu={true}
            colorMenu={false}
            editorState={this.props.editorState}
            customStyleMap={this.props.fontFamilyStyleMap}
            setInlineStyle={this.props.setInlineStyle}
            showDropdown={this.state.showDropdown}
            toggleDropdown={this.toggleDropdown}
          />
          {/* <Dropdown
          STYLE_LIST={FONT_SIZES}
          defaultOption="16"
          editorState={this.props.editorState}
          customStyleMap={this.props.fontSizeStyleMap}
          setInlineStyle={this.props.setInlineStyle}
          showDropdown={this.state.showDropdown}
          toggleDropdown={this.toggleDropdown}
        /> */}
          <Dropdown
            STYLE_LIST={TEXT_COLORS}
            defaultOption="#6e6e6e"
            wideMenu={false}
            colorMenu={true}
            editorState={this.props.editorState}
            customStyleMap={this.props.textColorStyleMap}
            setInlineStyle={this.props.setInlineStyle}
            showDropdown={this.state.showDropdown}
            toggleDropdown={this.toggleDropdown}
          />
          <Dropdown
            STYLE_LIST={HIGHLIGHT_COLORS}
            defaultOption="rgba(0, 0, 0, 0)"
            wideMenu={false}
            colorMenu={true}
            editorState={this.props.editorState}
            customStyleMap={this.props.highlightStyleMap}
            setInlineStyle={this.props.setInlineStyle}
            showDropdown={this.state.showDropdown}
            toggleDropdown={this.toggleDropdown}
          />
        </div>
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
