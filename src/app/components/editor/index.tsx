import * as React from 'react';
import {Editor, RichUtils, DraftHandleValue, EditorState} from 'draft-js';
import StyleButton from './styleButton';
interface IProps {
  initialState: any;
  placeholder: string;
  textAlignment: any;
  onStateChange: (s: EditorState) => void;
}

interface IState {
  editorState: EditorState;
  textAlignment: any;
}

export default class RichEditor extends React.Component<IProps, IState> {
  public editor: any;
  constructor(props: IProps) {
    super(props);
    this.state = {
      editorState: props.initialState,
      textAlignment: props,
    };
  }

  public componentWillReceiveProps(props: IProps) {
    this.setState({
      editorState: props.initialState,
      textAlignment: props.textAlignment,
    });
  }

  private focus = () => this.editor.focus();

  private onChange = (editorState) => {
    this.setState({editorState});
    this.props.onStateChange(editorState);
  }

  private handleKeyCommand = (command: string): DraftHandleValue => {
    const {editorState} = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  private onTab = (e: any) => {
    const maxDepth = 4;
    this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
  }

  private toggleBlockType = (blockType: any) => {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType,
      ),
    );
  }

  private toggleInlineStyle = (inlineStyle: any) => {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle,
      ),
    );
  }

  private editorRefHandler = (element) => {
    this.editor = element;
  }

  public render() {
    const {editorState, textAlignment} = this.state;
    const rtlClass = (textAlignment === 'right' ? ' rtl' : '');

    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = 'RichEditor-editor';
    const contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }
    return (
      <div className={'RichEditor-root' + rtlClass}>
        <BlockStyleControls
          editorState={editorState}
          onToggle={this.toggleBlockType}
        />
        <InlineStyleControls
          editorState={editorState}
          onToggle={this.toggleInlineStyle}
        />
        <div className={className} onClick={this.focus}>
          <Editor
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            editorState={editorState}
            textAlignment={textAlignment}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            onTab={this.onTab}
            placeholder={this.props.placeholder}
            ref={this.editorRefHandler}
            spellCheck={true}
          />
        </div>
      </div>
    );
  }
}

// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

function getBlockStyle(block: any) {
  switch (block.getType()) {
    case 'blockquote': return 'RichEditor-blockquote';
    default: return null;
  }
}
const BLOCK_TYPES = [
  {label: 'H1', style: 'header-one'},
  {label: 'H2', style: 'header-two'},
  {label: 'H3', style: 'header-three'},
  {label: 'H4', style: 'header-four'},
  {label: 'H5', style: 'header-five'},
  {label: 'H6', style: 'header-six'},
  {label: 'Blockquote', style: 'blockquote'},
  {label: 'UL', style: 'unordered-list-item'},
  {label: 'OL', style: 'ordered-list-item'},
  {label: 'Code Block', style: 'code-block'},
];

const BlockStyleControls = (props) => {
  const {editorState} = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />,
      )}
    </div>
  );
};

const INLINE_STYLES = [
  {label: 'Bold', style: 'BOLD'},
  {label: 'Italic', style: 'ITALIC'},
  {label: 'Underline', style: 'UNDERLINE'},
  {label: 'Monospace', style: 'CODE'},
];

const InlineStyleControls = (props) => {
  const currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map((type) =>
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />,
      )}
    </div>
  );
};
