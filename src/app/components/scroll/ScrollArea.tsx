import * as React from 'react';

const lineHeight = require('line-height');
import {Motion, spring} from 'react-motion';

import {
  findDOMNode, warnAboutFunctionChild, warnAboutElementChild, positiveOrZero, modifyObjValues,
} from './utils';
import ScrollBar from './Scrollbar';

const eventTypes = {
  wheel: 'wheel',
  api: 'api',
  touch: 'touch',
  touchEnd: 'touchEnd',
  mousemove: 'mousemove',
  keyPress: 'keypress',
};

interface IProps {
  className?: string;
  style?: any;
  speed: number;
  contentClassName?: string;
  contentStyle?: any;
  vertical?: boolean;
  verticalContainerStyle?: any;
  verticalScrollbarStyle?: any;
  horizontal?: boolean;
  horizontalContainerStyle?: any;
  horizontalScrollbarStyle?: any;
  onScroll?: (val: any) => void;
  contentWindow?: any;
  ownerDocument?: any;
  smoothScrolling?: boolean;
  minScrollSize?: number;
  swapWheelAxes?: boolean;
  stopScrollPropagation?: boolean;
  focusableTabIndex?: number;
}

interface IState {
  topPosition: number;
  leftPosition: number;
  realHeight: number;
  containerHeight: number;
  realWidth: number;
  containerWidth: number;
  eventType: any;
}

export default class ScrollArea extends React.Component<IProps, IState> {
  public static defaultProps: Partial<IProps> = {
    speed: 1,
    vertical: true,
    horizontal: true,
    smoothScrolling: false,
    swapWheelAxes: false,
    contentWindow: (typeof window === 'object') ? window : undefined,
    ownerDocument: (typeof document === 'object') ? document : undefined,
    focusableTabIndex: 1,
  };

  private eventPreviousValues: any;
  private lineHeightPx: any;
  private content: any;
  private wrapper: any;

  constructor(props) {
    super(props);
    this.state = {
      topPosition: 0,
      leftPosition: 0,
      realHeight: 0,
      containerHeight: 0,
      realWidth: 0,
      containerWidth: 0,
      eventType: '',
    };
    this.eventPreviousValues = {
      clientX: 0,
      clientY: 0,
      deltaX: 0,
      deltaY: 0,
    };
  }

  public refresh = () => {
    this.setSizesToState();
  }

  public componentDidMount() {
    if (this.props.contentWindow) {
      this.props.contentWindow.addEventListener('resize', this.handleWindowResize);
    }
    this.lineHeightPx = lineHeight(this.content);
    this.setSizesToState();
  }

  public componentWillUnmount() {
    if (this.props.contentWindow) {
      this.props.contentWindow.removeEventListener('resize', this.handleWindowResize);
    }
  }

  public componentDidUpdate() {
    this.setSizesToState();
  }

  public render() {
    const {className, contentClassName, ownerDocument} = this.props;
    let {children} = this.props;
    const withMotion = this.props.smoothScrolling &&
      (
        this.state.eventType === eventTypes.wheel ||
        this.state.eventType === eventTypes.api ||
        this.state.eventType === eventTypes.touchEnd ||
        this.state.eventType === eventTypes.keyPress
      );

    const scrollbarY = this.canScrollY() ? (
      <ScrollBar
        ownerDocument={ownerDocument}
        realSize={this.state.realHeight}
        containerSize={this.state.containerHeight}
        position={this.state.topPosition}
        onMove={this.handleScrollbarMove}
        onPositionChange={this.handleScrollbarYPositionChange}
        containerStyle={this.props.verticalContainerStyle}
        scrollbarStyle={this.props.verticalScrollbarStyle}
        smoothScrolling={withMotion}
        minScrollSize={this.props.minScrollSize}
        onFocus={this.focusContent}
        type="vertical"/>
    ) : null;

    const scrollbarX = this.canScrollX() ? (
      <ScrollBar
        ownerDocument={ownerDocument}
        realSize={this.state.realWidth}
        containerSize={this.state.containerWidth}
        position={this.state.leftPosition}
        onMove={this.handleScrollbarMove}
        onPositionChange={this.handleScrollbarXPositionChange}
        containerStyle={this.props.horizontalContainerStyle}
        scrollbarStyle={this.props.horizontalScrollbarStyle}
        smoothScrolling={withMotion}
        minScrollSize={this.props.minScrollSize}
        onFocus={this.focusContent}
        type="horizontal"/>
    ) : null;

    if (typeof children === 'function') {
      warnAboutFunctionChild();
      children = children();
    } else {
      warnAboutElementChild();
    }

    const classes = 'scrollarea ' + (className || '');
    const contentClasses = 'scrollarea-content ' + (contentClassName || '');

    const contentStyle = {
      marginTop: -this.state.topPosition,
      marginLeft: -this.state.leftPosition,
    };
    const springifiedContentStyle = withMotion ? modifyObjValues(contentStyle, (x) => spring(x)) : contentStyle;

    return (
      <Motion style={springifiedContentStyle}>
        {(style) =>
          <div
            ref={(x) => this.wrapper = x}
            className={classes}
            style={this.props.style}
            onWheel={this.handleWheel}
          >
            <div
              ref={(x) => this.content = x}
              style={{...this.props.contentStyle, ...style}}
              className={contentClasses}
              onTouchStart={this.handleTouchStart}
              onTouchMove={this.handleTouchMove}
              onTouchEnd={this.handleTouchEnd}
              onKeyDown={this.handleKeyDown}
              tabIndex={this.props.focusableTabIndex}
            >
              {children}
            </div>
            {scrollbarY}
            {scrollbarX}
          </div>
        }
      </Motion>
    );
  }

  public setStateFromEvent = (newState, eventType?) => {
    if (this.props.onScroll) {
      this.props.onScroll(newState);
    }
    this.setState({...newState, eventType});
  }

  public handleTouchStart = (e) => {
    const {touches} = e;
    if (touches.length === 1) {
      const {clientX, clientY} = touches[0];
      this.eventPreviousValues = {
        ...this.eventPreviousValues,
        clientY,
        clientX,
        timestamp: Date.now(),
      };
    }
  }

  public handleTouchMove(e) {
    if (this.canScroll()) {
      e.preventDefault();
      e.stopPropagation();
    }

    const {touches} = e;
    if (touches.length === 1) {
      const {clientX, clientY} = touches[0];

      const deltaY = this.eventPreviousValues.clientY - clientY;
      const deltaX = this.eventPreviousValues.clientX - clientX;

      this.eventPreviousValues = {
        ...this.eventPreviousValues,
        deltaY,
        deltaX,
        clientY,
        clientX,
        timestamp: Date.now(),
      };

      this.setStateFromEvent(this.composeNewState(-deltaX, -deltaY));
    }
  }

  public handleTouchEnd = () => {
    const {timestamp} = this.eventPreviousValues;
    let {deltaX, deltaY} = this.eventPreviousValues;
    if (typeof deltaX === 'undefined') {
      deltaX = 0;
    }
    if (typeof deltaY === 'undefined') {
      deltaY = 0;
    }
    if (Date.now() - timestamp < 200) {
      this.setStateFromEvent(this.composeNewState(-deltaX * 10, -deltaY * 10), eventTypes.touchEnd);
    }

    this.eventPreviousValues = {
      ...this.eventPreviousValues,
      deltaY: 0,
      deltaX: 0,
    };
  }

  public handleScrollbarMove = (deltaY, deltaX) => {
    this.setStateFromEvent(this.composeNewState(deltaX, deltaY));
  }

  public handleScrollbarXPositionChange = (position) => {
    this.scrollXTo(position);
  }

  public handleScrollbarYPositionChange = (position) => {
    this.scrollYTo(position);
  }

  public handleWheel = (e) => {
    let deltaY = e.deltaY;
    let deltaX = e.deltaX;

    if (this.props.swapWheelAxes) {
      [deltaY, deltaX] = [deltaX, deltaY];
    }

    /*
      * WheelEvent.deltaMode can differ between browsers and must be normalized
      * e.deltaMode === 0: The delta values are specified in pixels
      * e.deltaMode === 1: The delta values are specified in lines
      * https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaMode
      */
    if (e.deltaMode === 1) {
      deltaY = deltaY * this.lineHeightPx;
      deltaX = deltaX * this.lineHeightPx;
    }

    deltaY = deltaY * this.props.speed;
    deltaX = deltaX * this.props.speed;

    const newState = this.composeNewState(-deltaX, -deltaY);

    if ((newState.topPosition && this.state.topPosition !== newState.topPosition) ||
      (newState.leftPosition && this.state.leftPosition !== newState.leftPosition) ||
      this.props.stopScrollPropagation) {
      e.preventDefault();
      e.stopPropagation();
    }

    this.setStateFromEvent(newState, eventTypes.wheel);
    this.focusContent();
  }

  public handleKeyDown = (e) => {
    // only handle if scroll area is in focus
    if (
      e.target.tagName.toLowerCase() !== 'input' &&
      e.target.tagName.toLowerCase() !== 'textarea' &&
      !e.target.isContentEditable
    ) {
      let deltaY = 0;
      let deltaX = 0;
      const lineHeight = this.lineHeightPx ? this.lineHeightPx : 10;

      switch (e.keyCode) {
        case 33: // page up
          deltaY = this.state.containerHeight - lineHeight;
          break;
        case 34: // page down
          deltaY = -this.state.containerHeight + lineHeight;
          break;
        case 37: // left
          deltaX = lineHeight;
          break;
        case 38: // up
          deltaY = lineHeight;
          break;
        case 39: // right
          deltaX = -lineHeight;
          break;
        case 40: // down
          deltaY = -lineHeight;
          break;
      }

      // only compose new state if key code matches those above
      if (deltaY !== 0 || deltaX !== 0) {
        const newState = this.composeNewState(deltaX, deltaY);

        e.preventDefault();
        e.stopPropagation();

        this.setStateFromEvent(newState, eventTypes.keyPress);
      }
    }
  }

  public handleWindowResize = () => {
    let newState = this.computeSizes();
    newState = this.getModifiedPositionsIfNeeded(newState);
    this.setStateFromEvent(newState);
  }

  public composeNewState = (deltaX, deltaY) => {
    const newState = this.computeSizes();
    newState.topPosition = this.canScrollY(newState) ? this.computeTopPosition(deltaY, newState) : 0;
    if (this.canScrollX(newState)) {
      newState.leftPosition = this.computeLeftPosition(deltaX, newState);
    }

    return newState;
  }

  public computeTopPosition = (deltaY, sizes) => {
    const newTopPosition = this.state.topPosition - deltaY;
    return this.normalizeTopPosition(newTopPosition, sizes);
  }

  public computeLeftPosition = (deltaX, sizes) => {
    const newLeftPosition = this.state.leftPosition - deltaX;
    return this.normalizeLeftPosition(newLeftPosition, sizes);
  }

  public normalizeTopPosition = (newTopPosition, sizes) => {
    if (newTopPosition > sizes.realHeight - sizes.containerHeight) {
      newTopPosition = sizes.realHeight - sizes.containerHeight;
    }
    if (newTopPosition < 0) {
      newTopPosition = 0;
    }
    return newTopPosition;
  }

  public normalizeLeftPosition = (newLeftPosition, sizes) => {
    if (newLeftPosition > sizes.realWidth - sizes.containerWidth) {
      newLeftPosition = sizes.realWidth - sizes.containerWidth;
    } else if (newLeftPosition < 0) {
      newLeftPosition = 0;
    }

    return newLeftPosition;
  }

  public computeSizes = () => {
    const realHeight = this.content.offsetHeight;
    const containerHeight = this.wrapper.offsetHeight;
    const realWidth = this.content.offsetWidth;
    const containerWidth = this.wrapper.offsetWidth;

    return {
      realHeight,
      containerHeight,
      realWidth,
      containerWidth,
      topPosition: 0,
      leftPosition: 0,
    };
  }

  public setSizesToState = () => {
    const sizes = this.computeSizes();
    if (sizes.realHeight !== this.state.realHeight || sizes.realWidth !== this.state.realWidth) {
      this.setStateFromEvent(this.getModifiedPositionsIfNeeded(sizes));
    }
  }

  public scrollTop = () => {
    this.scrollYTo(0);
  }

  public scrollBottom = () => {
    this.scrollYTo((this.state.realHeight - this.state.containerHeight));
  }

  public scrollLeft = () => {
    this.scrollXTo(0);
  }

  public scrollRight = () => {
    this.scrollXTo((this.state.realWidth - this.state.containerWidth));
  }

  public scrollYTo = (topPosition) => {
    if (this.canScrollY()) {
      const position = this.normalizeTopPosition(topPosition, this.computeSizes());
      this.setStateFromEvent({topPosition: position}, eventTypes.api);
    }
  }

  public scrollXTo = (leftPosition) => {
    if (this.canScrollX()) {
      const position = this.normalizeLeftPosition(leftPosition, this.computeSizes());
      this.setStateFromEvent({leftPosition: position}, eventTypes.api);
    }
  }

  public canScrollY = (state?) => {
    if (!state) {
      state = this.state;
    }
    const scrollableY = state.realHeight > state.containerHeight;
    return scrollableY && this.props.vertical;
  }

  public canScrollX = (state?) => {
    if (!state) {
      state = this.state;
    }
    const scrollableX = state.realWidth > state.containerWidth;
    return scrollableX && this.props.horizontal;
  }

  public canScroll = (state = this.state) => {
    return this.canScrollY(state) || this.canScrollX(state);
  }

  public getModifiedPositionsIfNeeded = (newState) => {
    const bottomPosition = newState.realHeight - newState.containerHeight;
    if (this.state.topPosition >= bottomPosition) {
      newState.topPosition = this.canScrollY(newState) ? positiveOrZero(bottomPosition) : 0;
    }

    const rightPosition = newState.realWidth - newState.containerWidth;
    if (this.state.leftPosition >= rightPosition) {
      newState.leftPosition = this.canScrollX(newState) ? positiveOrZero(rightPosition) : 0;
    }

    return newState;
  }

  public focusContent = () => {
    if (this.content) {
      findDOMNode(this.content).focus();
    }
  }

}
