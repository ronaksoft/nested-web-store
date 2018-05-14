import * as React from 'react';

interface IProps {
    offsetTop: number;
    zIndex?: number;
    width?: number;
    height?: number;
    className?: string;
    contentClassName?: string;
    stickyClassName?: string;
    style?: React.CSSProperties;
    contentStyle?: React.CSSProperties;
    onScroll?: () => void;
}

interface IState {
    affixed: boolean;
    width: number;
    height: number;
    top: number;
    style: any;
}

export default class Affixer extends React.Component<IProps, IState> {
  private container: HTMLDivElement;
  private fixedElement: HTMLDivElement;
  private win: any;

  constructor(props: any) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      top: 0,
      style: {
        fixedElement: {
          position: 'relative',
          width: 'unset',
          zIndexL: this.props.zIndex || 2,
        },
        mirrorElement: {
          position: 'relative',
          width: 'unset',
          height: 'unset',
        },
      },
      affixed: false,
    };
    if (typeof window !== 'undefined') {
      this.win = window;
    }
  }

  public getCordinates = () => {
    this.setState({
      top: this.container.offsetTop,
      width: this.container.offsetWidth,
      height: this.props.height,
    }, () => {
      this.onScrollEventHandler();
    });
  }

  public componentDidMount() {
    if (this.win) {
      this.win.addEventListener('scroll', this.onScrollEventHandler);
    }
    this.getCordinates();
  }

  public componentWillUnmount() {
    if (typeof window !== 'undefined') {
      this.win = window;
    }
    if (this.win) {
      this.win.removeEventListener('scroll', this.onScrollEventHandler);
    }
  }

  private onScrollEventHandler = () => {
    // console.log(evt, this.win.scrollY, this.win.document);
    this.win.requestAnimationFrame(() => {
      this.handelStickyElement(this.win.scrollY);
    });
  }

  public handelStickyElement = (scrollTop: number) => {
    if (!this.state.affixed && scrollTop > this.state.top - this.props.offsetTop) {
      this.setState({
        style: {
          fixedElement: {
            position: 'fixed',
            width: this.state.width,
            top: this.props.offsetTop,
            zIndex: this.props.zIndex || 2,
          },
          mirrorElement: {
            position: 'relative',
            width: this.state.width,
            height: this.state.height || 'unset',
          },
        },
        affixed: true,
      });
    } else if (this.state.affixed && scrollTop <= this.state.top - this.props.offsetTop) {
      this.setState({
        style: {
          fixedElement: {},
          mirrorElement: {},
        },
        affixed: false,
      });
    }
  }

  private containerRefHandler = (element: HTMLDivElement) => {
    this.container = element;
  }

  private fixedElementRefHandler = (element: HTMLDivElement) => {
    this.fixedElement = element;
  }

  public render() {
    const mirrorStyle = this.state.style.mirrorElement;
    const fixedElement = this.state.style.fixedElement;
    return (
        <div ref={this.containerRefHandler} style={mirrorStyle}>
          <div className={this.state.affixed ? 'isFixed' : ''} ref={this.fixedElementRefHandler}
            style={fixedElement}>
              {this.props.children}
          </div>
        </div>
    );
  }
}
