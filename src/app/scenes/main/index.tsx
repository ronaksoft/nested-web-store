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
class Main extends React.Component<any, IState> {

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
    console.log(this.state);
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
      <div>
        <div className="jumbotron">
          <div className="bg-left">
            <img src={'/public/assets/icons/jumbo-bg-left.svg'} alt="Nested" className="logo"/>
            <img src={'/public/assets/icons/jumbo-bg-top.svg'} alt="Nested" className="logo"/>
          </div>
          <div className="bg-right">
            <img src={'/public/assets/icons/jumbo-bg-right.svg'} alt="Nested" className="logo"/>
            <img src={'/public/assets/icons/jumbo-bg-bottom.svg'} alt="Nested" className="logo"/>
          </div>
          <div className="content">
            <h2><Translate>Make it easier!</Translate></h2>
            <p><Translate>Add useful apps to you workspace.</Translate></p>
            <div className="featureds">
              <a href="">
                <img src={'/public/assets/icons/absents_place.svg'} alt="Nested" className="logo"/>
              </a>
              <a href="">
                <img src={'/public/assets/icons/absents_place.svg'} alt="Nested" className="logo"/>
              </a>
              <a href="">
                <img src={'/public/assets/icons/absents_place.svg'} alt="Nested" className="logo"/>
              </a>
              <a href="">
                <img src={'/public/assets/icons/absents_place.svg'} alt="Nested" className="logo"/>
              </a>
              <a href="">
                <img src={'/public/assets/icons/absents_place.svg'} alt="Nested" className="logo"/>
              </a>
            </div>
          </div>
        </div>

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
      </div>
    );
  }
}

export default Main;
