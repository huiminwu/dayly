import React, { Component } from "react";
import "./Notebook.css";

import { post } from "../../utilities.js";

import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  convertToRaw,
  convertFromRaw,
  getDefaultKeyBinding,
} from "draft-js";
import "draft-js/dist/Draft.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import debounce from "lodash/debounce";

import Immutable from "immutable";

export class StyleButton extends React.Component {
  constructor() {
    super();

    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    let className = "RichEditor-styleButton";
    if (this.props.active) {
      className += " RichEditor-activeButton";
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
    // assuming unstyled text has font "Poppins"
    let optionDisplayed = this.props.defaultOption;
    if (currentOption.length === 1) {
      optionDisplayed = currentOption[0].label;
    }

    const optionButtons = this.props.STYLE_LIST.map((option, k) => {
      return (
        <div
          key={k}
          className={`${this.props.wideMenu && "dropdown-btn-wide"} ${option.label ===
            this.props.defaultOption && "dropdown-btn-active"} dropdown-btn`}
          onMouseDown={(e) => this.onToggle(e, option.style)}
        >
          {option.label}
        </div>
      );
    });

    return (
      <div className="dropdown-container">
        <div
          onMouseDown={(e) => this.toggleMenu(e)}
          className={`${this.props.wideMenu && "dropdown-btn-wide"} dropdown-first-btn`}
        >
          {optionDisplayed} <FontAwesomeIcon icon="caret-down" />
        </div>
        {this.state.showDropdown && (
          <div className={`${this.props.wideMenu && "dropdown-menu-wide"} dropdown-menu`}>
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
      <div className="RichEditor-controls">
        {this.props.INLINE_STYLES.map((type) => (
          <StyleButton
            key={type.label}
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
      <div className="RichEditor-controls">
        {this.props.BLOCK_TYPES.map((type) => (
          <StyleButton
            key={type.label}
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
 * Notebook is a component for displaying the notebook section
 *
 * Proptypes
 * @param {moment} dateObject
 * @param {string} notes that were already saved
 **/

class Notebook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      isSaved: true,
    };

    this.onChange = (editorState) => {
      this.setState({
        editorState: editorState,
        isSaved: false,
      });
    };
  }

  componentDidMount() {
    if (this.props.data.notes.value) {
      const contentStateParsed = JSON.parse(this.props.data.notes.value);
      const convertedContentState = convertFromRaw(contentStateParsed);
      this.setState({
        editorState: EditorState.createWithContent(convertedContentState),
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      if (this.props.data.notes.value) {
        const contentStateParsed = JSON.parse(this.props.data.notes.value);
        const convertedContentState = convertFromRaw(contentStateParsed);
        this.setState({
          editorState: EditorState.createWithContent(convertedContentState),
        });
      } else {
        this.setState({
          editorState: EditorState.createEmpty(),
        });
      }
    }
  }

  toggleBlockType = (blockType) => {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
  };

  toggleInlineStyle = (inlineStyle) => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle));
  };

  handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  };

  mapKeyToEditorCommand = (e) => {
    if (e.keyCode === 9 /* TAB */) {
      const newEditorState = RichUtils.onTab(e, this.state.editorState, 4 /* maxDepth */);
      if (newEditorState !== this.state.editorState) {
        this.onChange(newEditorState);
      }
      return;
    }
    return getDefaultKeyBinding(e);
  };

  setInlineStyle = (inlineStyle, customStyleMap) => {
    const editorState = this.state.editorState;
    const selection = editorState.getSelection();
    const currentStyle = editorState.getCurrentInlineStyle();

    // removing other inline styles of the same category already applied
    const reducer = (contentState, style) =>
      Modifier.removeInlineStyle(contentState, selection, style);

    const nextContentState = Object.keys(customStyleMap).reduce(
      reducer,
      editorState.getCurrentContent()
    );

    let nextEditorState = EditorState.push(editorState, nextContentState, "change-inline-style");

    // if nothing is selected, prevents inline styles from stacking on top of each other
    if (selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce((state, style) => {
        return RichUtils.toggleInlineStyle(state, style);
      }, nextEditorState);
    }

    this.onChange(RichUtils.toggleInlineStyle(nextEditorState, inlineStyle));
  };

  handleSave(editorState) {
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const contentStateString = JSON.stringify(rawContentState);
    const params = {
      day: this.props.dateObject.format(),
      value: contentStateString,
    };
    post("/api/notes", params).then((notes) => {
      const convertedContentState = convertFromRaw(notes);
      this.setState({
        editorState: EditorState.createWithContent(convertedContentState),
        isSaved: true,
      });
    });
  }

  // autosave code (doesn't work)
  // handleSave = debounce((editorState) => {
  //   const rawContentState = convertToRaw(editorState.getCurrentContent());
  //   const contentStateString = JSON.stringify(rawContentState);
  //   const params = {
  //     creator: this.props.creator,
  //     day: this.props.day,
  //     month: this.props.month,
  //     year: this.props.year,
  //     notes: contentStateString,
  //   };
  //   post("/api/day/notes", params).then((notes) => {
  //     const convertedContentState = convertFromRaw(notes);
  //     this.setState({
  //       editorState: EditorState.createWithContent(convertedContentState),
  //       isSaved: true,
  //     });
  //   });
  // }, 3000);

  render() {
    const INLINE_STYLES = [
      { label: "Bold", style: "BOLD" },
      { label: "Italic", style: "ITALIC" },
      { label: "Underline", style: "UNDERLINE" },
    ];

    const BLOCK_TYPES = [
      { label: "H1", style: "header-one" },
      { label: "UL", style: "unordered-list-item" },
      { label: "OL", style: "ordered-list-item" },
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

    const fontFamilyStyleMap = {
      POPPINS: {
        fontFamily: "'Poppins', sans-serif",
      },
      LORA: {
        fontFamily: "'Lora', serif",
      },
      MONTSERRAT: {
        fontFamily: "'Montserrat', sans-serif",
      },
      INCONSOLATA: {
        fontFamily: "'Inconsolata', monospace",
      },
      NEUCHA: {
        fontFamily: "'Neucha', sans-serif",
      },
    };

    const fontSizeStyleMap = {
      "12": {
        fontSize: "12px",
      },
      "14": {
        fontSize: "14px",
      },
      "16": {
        fontSize: "16px",
      },
      "18": {
        fontSize: "18px",
      },
      "20": {
        fontSize: "20px",
      },
      "24": {
        fontSize: "24px",
      },
      "32": {
        fontSize: "32px",
      },
    };

    const customStyleMap = { ...fontFamilyStyleMap, ...fontSizeStyleMap };

    // const blockRenderMap = Immutable.Map({
    //   unstyled: {
    //     fontFamily: "'Pippins', sans-serif",
    //   },
    // });

    let editorClassName = "RichEditor-editor";
    var contentState = this.state.editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (
        contentState
          .getBlockMap()
          .first()
          .getType() !== "unstyled"
      ) {
        editorClassName += " RichEditor-hidePlaceholder";
      }
    }

    let saveClassName = "editor-saveButton";
    if (this.state.isSaved) {
      saveClassName = "editor-saveButton-saved";
    }

    return (
      <div className="notes-section">
        <div className="RichEditor-root">
          <Dropdown
            STYLE_LIST={FONT_FAMILIES}
            defaultOption="Poppins"
            wideMenu={true}
            editorState={this.state.editorState}
            customStyleMap={fontFamilyStyleMap}
            onToggle={this.setInlineStyle}
          />
          <Dropdown
            STYLE_LIST={FONT_SIZES}
            defaultOption="16"
            wideMenu={false}
            editorState={this.state.editorState}
            customStyleMap={fontSizeStyleMap}
            onToggle={this.setInlineStyle}
          />
          <InlineStyleControls
            INLINE_STYLES={INLINE_STYLES}
            editorState={this.state.editorState}
            onToggle={this.toggleInlineStyle}
          />
          <BlockStyleControls
            BLOCK_TYPES={BLOCK_TYPES}
            editorState={this.state.editorState}
            onToggle={this.toggleBlockType}
          />

          <div className={editorClassName}>
            <Editor
              editorState={this.state.editorState}
              onChange={this.onChange}
              customStyleMap={customStyleMap}
              // blockRenderMap={blockRenderMap}
              handleKeyCommand={this.handleKeyCommand}
              keyBindingFn={this.mapKeyToEditorCommand}
              placeholder="How was your day?"
            />
          </div>
        </div>
        <div className="RichEditor-footer">
          {this.state.isSaved ? <span>All changes saved</span> : <span>Unsaved</span>}
          <button className={saveClassName} onClick={() => this.handleSave(this.state.editorState)}>
            Save
          </button>
        </div>
      </div>
    );
  }
}

export default Notebook;
