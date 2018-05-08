import * as React from 'react';
import {Translate, AppList, IcoN, Rating, Tab, RateResult} from 'components';

interface IProps {
  app: string;
  /**
   * @prop routeParams
   * @desc The parameters are given by React Router
   * @type {*}
   * @memberof IOwnProps
   */
  routeParams?: any;
  location?: any;
}

interface IState {
  app: any;
}

class AppView extends React.Component<IProps, IState> {
  private translator: Translate;
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
        app: initData.__INITIAL_DATA__.app || {},
      };
      initData.__INITIAL_DATA__ = {};
    } else {
      this.state = {
        app: {},
      };
    }
    this.translator = new Translate();
  }

  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof Sidebar
   * @override
   * @generator
   */
  public render() {
    const tabs = {};
    tabs[this.translator._getText('App info')] = <div>a</div>;
    tabs[this.translator._getText('Pictures')] = (
      <div className="pictures">
        <img src="" alt=""/>
      </div>
    );
    tabs[this.translator._getText('Permissions')] = (
      <div>
        <ul className="permissions">
          <li>
            <div className="per-icon">
              <IcoN name="filter16" size={16}/>
            </div>
            <div className="per-info">
              <h4>Personal Info</h4>
              <p>Reads your personal info such as birthday, email, first name, last name, and so on.</p>
            </div>
          </li>
        </ul>
      </div>
    );
    tabs[this.translator._getText('Reviews')] = (
      <div>
        <Rating appId="aaa"/>
        <ul className="reviews">
          <li>
            <div className="rev-logo">
              <img src="" alt=""/>
            </div>
            <div className="rev-info">
              <h4>
                Personal Info
                <div className="rating">
                  <IcoN name="star16" size={16}/>
                  <IcoN name="star16" size={16}/>
                  <IcoN name="star16" size={16}/>
                  <IcoN name="starWire16" size={16}/>
                  <IcoN name="starWire16" size={16}/>
                </div>
              </h4>
              <p>Reads your personal info such as birthday, email, first name, last name, and so on.</p>
            </div>
          </li>
        </ul>
      </div>
    );
    return (
      <div className="main-container">
        <div className="main-container-inner vertical">
          <div className="app-content">
            <div className="product-hero">
              <img src="/public/assets/icons/Nested_Logo.svg" alt=""/>
              <button className="butn butn-primary full-width"><Translate>Install App</Translate></button>
              <a href="" className="report-butn"><Translate>Report this app</Translate></a>
              <div className="product-her-block categories">
                <h4><Translate>Categories</Translate>:</h4>
                <a href="">Music &amp; Fun</a>
                <a href="">Social Networks</a>
                <a href="">Music &amp; Fun</a>
                <a href="">Social Networks</a>
              </div>
              <div className="product-her-block languages">
                <h4><Translate>Languages Support</Translate>:</h4>
                <a className="en"><Translate>English</Translate></a>
                <a className="fa"><Translate>Persian</Translate></a>
              </div>
            </div>
            <div className="product-info">
              <h1>Google Play Music</h1>
              <RateResult rate={4.2}/>
              <Tab items={tabs}/>
            </div>
          </div>
          <AppList title={<Translate>Similar apps</Translate>} haveMore={false} items={[{
            name: 'Google Assisstant',
            category: 'Social & Fun',
          }]} mode="mini"/>
        </div>
      </div>
    );
  }
}

export default AppView;
