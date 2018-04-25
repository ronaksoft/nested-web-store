import * as React from 'react';
// import {Link} from 'react-router';

// import {sortBy} from 'lodash';
// import {IcoN, Loading, InfiniteScroll} from 'components';

const style = require('./sidebar.css');

class Main extends React.Component<any, any> {

  /**
   * @constructor
   * Creates an instance of Sidebar.
   * @param {ISidebarProps} props
   * @memberof Sidebar
   */
  constructor(props: any) {
    super(props);
  }

  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof Sidebar
   * @override
   * @generator
   */
  public render() {
    return (
      <div className={style.sidebar}>
        a
      </div>
    );
  }
}

export default Main;
