import React, { Component } from "react";
import Toolbar from "./Toolbar.js";
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
  DefaultDraftBlockRenderMap,
} from "draft-js";
import "draft-js/dist/Draft.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import debounce from "lodash/debounce";
import Immutable from "immutable";

class CustomBullet1 extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="custom-bullet-container">
        {this.props.children.map((child, k) => {
          return (
            <div className="custom-bullet">
              <FontAwesomeIcon icon={["fas", "circle"]} className="bullet-circle bullet-1" />
              <div contentEditable={false} readOnly key={k} className="bullet-label label-1">
                TASK
              </div>
              <div className="bullet-content">{child}</div>
            </div>
          );
        })}
      </div>
    );
  }
}

class CustomBullet2 extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="custom-bullet-container">
        {this.props.children.map((child, k) => {
          return (
            <div className="custom-bullet">
              <FontAwesomeIcon icon="minus" className="bullet-dash bullet-2" />
              <div contentEditable={false} readOnly key={k} className="bullet-label label-2">
                NOTE
              </div>
              <div className="bullet-content">{child}</div>
            </div>
          );
        })}
      </div>
    );
  }
}

class CustomBullet3 extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="custom-bullet-container">
        {this.props.children.map((child, k) => {
          return (
            <div className="custom-bullet">
              <FontAwesomeIcon icon={["far", "circle"]} className="bullet-circle bullet-3" />
              <div contentEditable={false} readOnly key={k} className="bullet-label label-3">
                EVENT
              </div>
              <div className="bullet-content">{child}</div>
            </div>
          );
        })}
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
      this.handleSave(editorState);
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
    const newEditorState = RichUtils.handleKeyCommand(editorState, command);
    if (newEditorState) {
      this.onChange(newEditorState);
      return true;
    }
    return false;
  };

  mapKeyBindings = (e) => {
    if (e.keyCode === 9) {
      // on tab, indent the list to a maximum of 3 layers
      const newEditorState = RichUtils.onTab(e, this.state.editorState, 2);
      if (newEditorState !== this.state.editorState) {
        this.onChange(newEditorState);
      }
      return;
    }
    return getDefaultKeyBinding(e);
  };

  // getBlockStyle = (block, customStyleMap) => {
  //   const blockStyles = [];
  //   const styleMap = Object.keys(customStyleMap);

  //   switch (block.getType()) {
  //     case "ordered-list-item":
  //     case "unordered-list-item":
  //       // With draft JS we cannot output different styles for the same block type.
  //       // We can however customise the css classes:
  //       block.findStyleRanges(
  //         (item) => {
  //           const itemStyles = item.getStyle();
  //           return _.some(styleMap, (styleKey) => itemStyles.includes(styleKey));
  //         },
  //         (startCharacter) => {
  //           if (startCharacter === 0) {
  //             // Apply the same styling to the block as the first character
  //             _.each(block.getInlineStyleAt(startCharacter).toArray(), (styleKey) => {
  //               blockStyles.push(`block-style-${styleKey}`);
  //             });
  //           }
  //         }
  //       );

  //       return blockStyles.join(" ");
  //     default:
  //       return null;
  //   }
  // };

  setInlineStyle = (inlineStyle, customStyleMap) => {
    const editorState = this.state.editorState;
    const selection = editorState.getSelection();
    const currentStyle = editorState.getCurrentInlineStyle();

    // removing other inline styles of the same category already applied
    const reducer = (contentState, style) => {
      return Modifier.removeInlineStyle(contentState, selection, style);
    };

    const nextContentState = Object.keys(customStyleMap).reduce(
      reducer,
      editorState.getCurrentContent()
    );

    let nextEditorState = EditorState.push(editorState, nextContentState, "change-inline-style");

    // if nothing is selected, prevents inline styles from stacking on top of each other
    // if a style is in the category, it is toggled to be turned off; other styles are untouched
    if (selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce((state, style) => {
        if (Object.keys(customStyleMap).includes(style)) {
          return RichUtils.toggleInlineStyle(state, style);
        } else {
          return state;
        }
      }, nextEditorState);
    }

    this.onChange(RichUtils.toggleInlineStyle(nextEditorState, inlineStyle));
  };

  // commented code is probably unnecessary, but leaving it there just in case there's a bug
  handleSave = debounce((editorState) => {
    // const currentSelection = this.state.editorState.getSelection();
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    let contentStateString = JSON.stringify(rawContentState);
    if (!editorState.getCurrentContent().hasText()) {
      const rawEmptyContentState = convertToRaw(EditorState.createEmpty().getCurrentContent());
      contentStateString = JSON.stringify(rawEmptyContentState);
    }
    const params = {
      day: this.props.dateObject.format(),
      value: contentStateString,
    };
    post("/api/notes", params).then((notes) => {
      // const convertedContentState = convertFromRaw(notes);
      // const editorStateWithContent = EditorState.createWithContent(convertedContentState);
      this.setState({
        // editorState: EditorState.forceSelection(editorStateWithContent, currentSelection),
        isSaved: true,
      });
    });
  }, 1000);

  render() {
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

    const highlightStyleMap = {
      none: {
        backgroundColor: "rgba(0, 0, 0, 0)",
      },
      pinkHighlight: {
        backgroundColor: "#FFCFE2",
      },
      yellowHighlight: {
        backgroundColor: "#FDFF8A",
      },
      greenHighlight: {
        backgroundColor: "#BFFFB8",
      },
      blueHighlight: {
        backgroundColor: "#B8F9FF",
      },
      purpleHighlight: {
        backgroundColor: "#D5B8FF",
      },
    };

    const textColorStyleMap = {
      default: {
        color: "#6e6e6e",
      },
      redText: {
        color: "#A80000",
      },
      greenText: {
        color: "#22854C",
      },
      blueText: {
        color: "#174B8A",
      },
      purpleText: {
        color: "#4D1586",
      },
      pinkText: {
        color: "#A6178E",
      },
      whiteText: {
        color: "#F5F2F4",
      },
    };

    const customStyleMap = {
      ...fontFamilyStyleMap,
      ...fontSizeStyleMap,
      ...highlightStyleMap,
      ...textColorStyleMap,
    };

    const blockRenderMap = Immutable.Map({
      CustomBullet1: {
        element: "div",
        wrapper: <CustomBullet1 />,
      },
      CustomBullet2: {
        element: "div",
        wrapper: <CustomBullet2 />,
      },
      CustomBullet3: {
        element: "div",
        wrapper: <CustomBullet3 />,
      },
    });

    const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);

    let editorClassName = "editor-body";
    let contentState = this.state.editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (
        contentState
          .getBlockMap()
          .first()
          .getType() !== "unstyled"
      ) {
        editorClassName += " editor-hidePlaceholder";
      }
    }

    return (
      <div className="notes-section">
        <div className="editor-container">
          <Toolbar
            editorState={this.state.editorState}
            setInlineStyle={this.setInlineStyle}
            fontFamilyStyleMap={fontFamilyStyleMap}
            fontSizeStyleMap={fontSizeStyleMap}
            textColorStyleMap={textColorStyleMap}
            highlightStyleMap={highlightStyleMap}
            toggleInlineStyle={this.toggleInlineStyle}
            toggleBlockType={this.toggleBlockType}
          />
          <div className={editorClassName}>
            <Editor
              editorState={this.state.editorState}
              onChange={this.onChange}
              customStyleMap={customStyleMap}
              handleKeyCommand={this.handleKeyCommand}
              keyBindingFn={this.mapKeyBindings}
              blockRenderMap={extendedBlockRenderMap}
              // blockStyleFn={(block) => this.getBlockStyle(block, customStyleMap)}
              placeholder="How was your day?"
            />
          </div>
          <div className="editor-footer">
            <span className="editor-saveStatus">
              {this.state.isSaved ? "All changes saved" : "Unsaved"}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default Notebook;
