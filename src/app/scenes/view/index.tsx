import * as React from 'react';
import {Translate, AppList, IcoN} from 'components';
import { Link } from 'react-router';
interface IProps {
  app: string;
  /**
   * @prop routeParams
   * @desc The parameters are given by React Router
   * @type {*}
   * @memberof IOwnProps
   */
  routeParams?: any;
};
interface IState {
  activeTab: number;
};
class AppView extends React.Component<IProps, IState> {

  /**
   * @constructor
   * Creates an instance of Sidebar.
   * @param {ISidebarProps} props
   * @memberof Sidebar
   */
  constructor(props: any) {
    super(props);
    this.state = {
      activeTab: 0,
    };
  }

  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof Sidebar
   * @override
   * @generator
   */
  public render() {
    console.log(this.props);
    const {activeTab} = this.state;
    return (
      <div className="main-container">
        <div className="main-container-inner vertical">
          <div className="app-content">
            <div className="product-hero">
              <img src={require('../../assets/icons/Nested_Logo.svg')} alt="" />
              <button className="butn butn-primary full-width"><Translate>Install App</Translate></button>
              <a href="" className="report-butn"><Translate>Report this app</Translate></a>
              <div className="categories">
                <h4><Translate>Categories</Translate>:</h4>
                <a href="">Music & Fun</a>
                <a href="">Social Networks</a>
                <a href="">Music & Fun</a>
                <a href="">Social Networks</a>
              </div>
            </div>
            <div className="product-info">
              <h1>Google Play Music</h1>
              <div className="rating">
                <IcoN name="star16" size={16}/>
                <IcoN name="star16" size={16}/>
                <IcoN name="star16" size={16}/>
                <IcoN name="star16" size={16}/>
                <IcoN name="starWire16" size={16}/>
                <span>4/5</span>
              </div>
              <div className="tabs">
                <Link to={{pathname: '/app/' + this.props.routeParams.appid + '#info'}}
                  className={activeTab === 0 ? 'active' : ''}>
                  <Translate>App info</Translate>
                </Link>
                <Link to={{pathname: '/app/' + this.props.routeParams.appid + '#pictures'}}
                  className={activeTab === 1 ? 'active' : ''}>
                  <Translate>Pictures</Translate>
                </Link>
                <a href="" className={activeTab === 2 ? 'active' : ''}><Translate>Permissions</Translate></a>
                <a href="" className={activeTab === 3 ? 'active' : ''}><Translate>Reviews</Translate></a>
              </div>
              <div className="tabs-content">
                asdasdasdasd
              </div>
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
