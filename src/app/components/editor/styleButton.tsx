import * as React from 'react';
interface IStyleButtonProps {
    onToggle: (v: any) => {};
    style: any;
    active: boolean;
    label: any;
}

interface IStyleButtonStates {
    editorState: any;
}

export default class StyleButton extends React.Component<IStyleButtonProps, IStyleButtonStates > {
    public onToggle = (e) => {
        e.preventDefault();
        this
            .props
            .onToggle(this.props.style);
    }

    public render() {
        let className = 'RichEditor-styleButton';
        if (this.props.active) {
            className += ' RichEditor-activeButton';
        }

        return (
            <span className={className} onMouseDown={this.onToggle}>
                {this.props.label}
            </span>
        );
    }
}
