import * as React from 'react';
import { Motion, spring } from 'react-motion';
import { modifyObjValues } from './utils';

interface IProps {
  type: string;
  ownerDocument: any;
  onMove: (deltaY: any, deltaX: any) => void;
  onPositionChange: (val: any) => void;
  onFocus: () => void;
  realSize: number;
  containerSize: number;
  position: number;
  containerStyle: any;
  scrollbarStyle: any;
  smoothScrolling?: boolean;
  minScrollSize: number;
}
interface IState {
  position: number;
  scrollSize: number;
  isDragging: boolean;
  lastClientPosition: number;
}

class ScrollBar extends React.Component<IProps, IState> {
  private bindedHandleMouseMove: any;
  private bindedHandleMouseUp: any;
  private scrollbarContainer: any;
  public constructor(props) {
    super(props);
    const newState = this.calculateState(props);
    this.state = {
      position: newState.position,
      scrollSize: newState.scrollSize,
      isDragging: false,
      lastClientPosition: 0,
    };

    this.bindedHandleMouseMove = props.type === 'vertical'
      ? this.handleMouseMoveForVertical.bind(this)
      : this.handleMouseMoveForHorizontal.bind(this);

    this.bindedHandleMouseUp = this.handleMouseUp.bind(this);
  }

  public componentDidMount() {
    if (this.props.ownerDocument) {
      this.props.ownerDocument.addEventListener('mousemove', this.bindedHandleMouseMove);
      this.props.ownerDocument.addEventListener('mouseup', this.bindedHandleMouseUp);
    }
  }

  public componentWillReceiveProps(nextProps) {
    this.setState(this.calculateState(nextProps));
  }

  public componentWillUnmount() {
    if (this.props.ownerDocument) {
      this.props.ownerDocument.removeEventListener('mousemove', this.bindedHandleMouseMove);
      this.props.ownerDocument.removeEventListener('mouseup', this.bindedHandleMouseUp);
    }
  }

  public calculateFractionalPosition(realContentSize, containerSize, contentPosition) {
    const relativeSize = realContentSize - containerSize;

    return 1 - ((relativeSize - contentPosition) / relativeSize);
  }

  public calculateState(props) {
    const fractionalPosition = this.calculateFractionalPosition(props.realSize, props.containerSize, props.position);
    const proportionalToPageScrollSize = props.containerSize * props.containerSize / props.realSize;
    const scrollSize = proportionalToPageScrollSize < props.minScrollSize
      ? props.minScrollSize
      : proportionalToPageScrollSize;

    const scrollPosition = (props.containerSize - scrollSize) * fractionalPosition;
    return {
        scrollSize,
        position: Math.round(scrollPosition),
    };
  }

  public render() {
    const {smoothScrolling, type, scrollbarStyle, containerStyle} = this.props;
    const {isDragging} = this.state;
    const isVoriziontal = type === 'horizontal';
    const isVertical = type === 'vertical';
    const scrollStyles = this.createScrollStyles();
    const springifiedScrollStyles = smoothScrolling ? modifyObjValues(scrollStyles, (x) => spring(x)) : scrollStyles;

    const scrollbarClasses = `scrollbar-container ${isDragging ? 'active' : ''}` + ' '
      + `${isVoriziontal ? 'horizontal' : ''} ${isVertical ? 'vertical' : ''}`;

    return (
      <Motion style={springifiedScrollStyles}>
        {(style) =>
            <div
              className={scrollbarClasses}
              style={containerStyle}
              onMouseDown={this.handleScrollBarContainerClick}
              ref={(x) => this.scrollbarContainer = x}
            >
              <div
                className="scrollbar"
                style={{ ...scrollbarStyle, ...style }}
                onMouseDown={this.handleMouseDown}
              />
            </div>
        }
      </Motion>
    );
  }

  public handleScrollBarContainerClick(e) {
    e.preventDefault();
    const multiplier = this.computeMultiplier();
    const clientPosition = this.isVertical() ? e.clientY : e.clientX;
    const { top, left } = this.scrollbarContainer.getBoundingClientRect();
    const clientScrollPosition = this.isVertical() ? top : left;

    const position = clientPosition - clientScrollPosition;
    const proportionalToPageScrollSize = this.props.containerSize * this.props.containerSize / this.props.realSize;

    this.setState({isDragging: true, lastClientPosition: clientPosition });
    this.props.onPositionChange((position - proportionalToPageScrollSize / 2) / multiplier);
  }

  public handleMouseMoveForHorizontal = (e) => {
    const multiplier = this.computeMultiplier();

    if (this.state.isDragging) {
      e.preventDefault();
      const deltaX = this.state.lastClientPosition - e.clientX;
      this.setState({ lastClientPosition: e.clientX });
      this.props.onMove(0, deltaX / multiplier);
    }
  }

  public handleMouseMoveForVertical = (e) => {
    const multiplier = this.computeMultiplier();

    if (this.state.isDragging) {
      e.preventDefault();
      const deltaY = this.state.lastClientPosition - e.clientY;
      this.setState({ lastClientPosition: e.clientY });
      this.props.onMove(deltaY / multiplier, 0);
    }
  }

  public handleMouseDown(e) {
      e.preventDefault();
      e.stopPropagation();
      const lastClientPosition = this.isVertical() ? e.clientY : e.clientX;
      this.setState({isDragging: true, lastClientPosition});

      this.props.onFocus();
  }

  public handleMouseUp(e) {
    if (this.state.isDragging) {
      e.preventDefault();
      this.setState({isDragging: false });
    }
  }

  public createScrollStyles() {
    if (this.props.type === 'vertical') {
      return {
          height: this.state.scrollSize,
          marginTop: this.state.position,
      };
    } else {
      return {
          width: this.state.scrollSize,
          marginLeft: this.state.position,
      };
    }
  }

  public computeMultiplier() {
      return (this.props.containerSize) / this.props.realSize;
  }

  public isVertical() {
      return this.props.type === 'vertical';
  }
}

export default ScrollBar;
