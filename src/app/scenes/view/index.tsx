import * as React from 'react';
import {Translate, AppList, IcoN} from 'components';
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
};
interface IState {
  activeTab: number;
};
class AppView extends React.Component<IProps, IState> {
  public hashLinks: string[] = ['info', 'pictures', 'permissions', 'reviews'];
  /**
   * @constructor
   * Creates an instance of Sidebar.
   * @param {ISidebarProps} props
   * @memberof Sidebar
   */
  constructor(props: any) {
    super(props);
    this.state = {
      activeTab: this.getTabIndexFromHash(this.props.location.hash),
    };
  }

  private getTabIndexFromHash(hash) {
    return hash ? this.hashLinks.indexOf(hash.replace('#', '')) : 0 ;
  }

  public componentWillUpdate(nextProps) {
    if (nextProps.location.hash !== '#' + this.hashLinks[this.state.activeTab]) {
      this.setState({
        activeTab: this.getTabIndexFromHash(nextProps.location.hash),
      });
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
                <a href={'#' + this.hashLinks[0]}
                  className={activeTab === 0 ? 'active' : ''}>
                  <Translate>App info</Translate>
                </a>
                <a href={'#' + this.hashLinks[1]}
                  className={activeTab === 1 ? 'active' : ''}>
                  <Translate>Pictures</Translate>
                </a>
                <a href={'#' + this.hashLinks[2]}
                  className={activeTab === 2 ? 'active' : ''}>
                  <Translate>Permissions</Translate>
                </a>
                <a href={'#' + this.hashLinks[3]}
                  className={activeTab === 3 ? 'active' : ''}>
                  <Translate>Reviews</Translate>
                </a>
              </div>
              <div className="tabs-content">
                {activeTab === 0 && (
                  <div>a</div>
                )}
                {activeTab === 1 && (
                  <div>b</div>
                )}
                {activeTab === 2 && (
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
                )}
                {activeTab === 3 && (
                  <div>d</div>
                )}
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
