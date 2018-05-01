import * as React from 'react';
import AppSearch from 'components/app-search';
// import {Link} from 'react-router';

// import {sortBy} from 'lodash';
// import {IcoN, Loading, InfiniteScroll} from 'components';

import {Translate} from 'components';
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
      <div>
        <div className="jumbotron">
          <div className="bg-left">
            <img src={require('../../assets/icons/jumbo-bg-left.svg')} alt="Nested" className="logo"/>
            <img src={require('../../assets/icons/jumbo-bg-top.svg')} alt="Nested" className="logo"/>
          </div>
          <div className="bg-right">
            <img src={require('../../assets/icons/jumbo-bg-right.svg')} alt="Nested" className="logo"/>
            <img src={require('../../assets/icons/jumbo-bg-bottom.svg')} alt="Nested" className="logo"/>
          </div>
          <div className="content">
            <h2><Translate>Make it easier!</Translate></h2>
            <p><Translate>Add useful apps to you workspace.</Translate></p>
            <div className="featureds">
              <a href="">
                <img src={require('../../assets/icons/absents_place.svg')} alt="Nested" className="logo"/>
              </a>
              <a href="">
                <img src={require('../../assets/icons/absents_place.svg')} alt="Nested" className="logo"/>
              </a>
              <a href="">
                <img src={require('../../assets/icons/absents_place.svg')} alt="Nested" className="logo"/>
              </a>
              <a href="">
                <img src={require('../../assets/icons/absents_place.svg')} alt="Nested" className="logo"/>
              </a>
              <a href="">
                <img src={require('../../assets/icons/absents_place.svg')} alt="Nested" className="logo"/>
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
                <div className="app-list">
                  <div className="list-head">
                    <h3><Translate>Featured Apps</Translate></h3>
                    <div className="filler"/>
                    <a href=""><Translate>See more</Translate></a>
                  </div>
                  <div className="list-body">
                    <a className="app-card">
                      <div className="app-image">
                        <div className="app-image-bg">
                          <img src={require('../../assets/icons/absents_place.svg')} alt=""/>
                        </div>
                        <img src={require('../../assets/icons/absents_place.svg')} alt=""/>
                      </div>
                      <div className="app-data">
                        <h4>Google Assisstant</h4>
                        <aside>Customer Support</aside>
                      </div>
                    </a>
                    <a className="app-card">
                      <div className="app-image">
                        <div className="app-image-bg">
                          <img src={require('../../assets/icons/absents_place.svg')} alt=""/>
                        </div>
                        <img src={require('../../assets/icons/absents_place.svg')} alt=""/>
                      </div>
                      <div className="app-data">
                        <h4>Google Assisstant</h4>
                        <aside>Customer Support</aside>
                      </div>
                    </a>
                    <a className="app-card">
                      <div className="app-image">
                        <div className="app-image-bg">
                          <img src={require('../../assets/icons/absents_place.svg')} alt=""/>
                        </div>
                        <img src={require('../../assets/icons/absents_place.svg')} alt=""/>
                      </div>
                      <div className="app-data">
                        <h4>Google Assisstant</h4>
                        <aside>Customer Support</aside>
                      </div>
                    </a>
                  </div>
                </div>
                <div className="app-list">
                  <div className="list-head">
                    <h3><Translate>Most Recents</Translate></h3>
                    <div className="filler"/>
                    <a href=""><Translate>See more</Translate></a>
                  </div>
                  <div className="list-body">
                    <a className="app-card">
                      <div className="app-image">
                        <div className="app-image-bg">
                          <img src={require('../../assets/icons/absents_place.svg')} alt=""/>
                        </div>
                        <img src={require('../../assets/icons/absents_place.svg')} alt=""/>
                      </div>
                      <div className="app-data">
                        <h4>Google Assisstant</h4>
                        <aside>Customer Support</aside>
                      </div>
                    </a>
                    <a className="app-card">
                      <div className="app-image">
                        <div className="app-image-bg">
                          <img src={require('../../assets/icons/absents_place.svg')} alt=""/>
                        </div>
                        <img src={require('../../assets/icons/absents_place.svg')} alt=""/>
                      </div>
                      <div className="app-data">
                        <h4>Google Assisstant</h4>
                        <aside>Customer Support</aside>
                      </div>
                    </a>
                    <a className="app-card">
                      <div className="app-image">
                        <div className="app-image-bg">
                          <img src={require('../../assets/icons/absents_place.svg')} alt=""/>
                        </div>
                        <img src={require('../../assets/icons/absents_place.svg')} alt=""/>
                      </div>
                      <div className="app-data">
                        <h4>Google Assisstant</h4>
                        <aside>Customer Support</aside>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    );
  }
}

export default Main;
