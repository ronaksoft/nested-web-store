import * as React from 'react';
import AppSearch from 'components/app-search';
interface IState {
  slides: any[];
  recentApps: any[];
  featuredApps: any[];
  categories: any[];
}

// import {sortBy} from 'lodash';
// import {IcoN, Loading, InfiniteScroll} from 'components';

import {Translate, AppList} from 'components';
class Browse extends React.Component<any, IState> {

  /**
   * @constructor
   * Creates an instance of Sidebar.
   * @param {ISidebarProps} props
   * @memberof Sidebar
   */
  constructor(props: any) {
    super(props);
    let initData: any;
    if (typeof window !== 'undefined') {
      initData = window;
    }
    if (initData) {
      this.state = {
        slides: initData.__INITIAL_DATA__.slides || [],
        recentApps: initData.__INITIAL_DATA__.recent_apps || [],
        featuredApps: initData.__INITIAL_DATA__.featured_apps || [],
        categories: initData.__INITIAL_DATA__.categories || [],
      };
      initData.__INITIAL_DATA__ = {};
    } else {
      this.state = {
        slides: [],
        recentApps: [],
        featuredApps: [],
        categories: [],
      };
    }
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
      <div className="main-container">
        <div className="main-container-inner">
          <div className="sidebar">
            <h3><Translate>Categories</Translate></h3>
            <ul>
              <li>Bots</li>
              <li>Communication</li>
            </ul>
          </div>
          <div className="apps-wrapper">
            <AppSearch/>
            <AppList title={<Translate>Featured Apps</Translate>} haveMore={true} items={[
              {
                id: 'a',
                name: 'Google Assisstant',
                category: 'Customer Support',
              },
              {
                id: 'b',
                name: 'Google Assisstant',
                category: 'Customer Support',
              },
              {
                id: 'v',
                name: 'Google Assisstant',
                category: 'Customer Support',
              },
            ]}/>
            <AppList title={<Translate>Most Recents</Translate>} haveMore={true} items={[
              {
                id: 'a',
                name: 'Google Assisstant',
                category: 'Customer Support',
              },
              {
                id: 'b',
                name: 'Google Assisstant',
                category: 'Customer Support',
              },
              {
                id: 'v',
                name: 'Google Assisstant',
                category: 'Customer Support',
              },
            ]}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Browse;