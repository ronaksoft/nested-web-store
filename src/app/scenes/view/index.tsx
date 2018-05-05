import * as React from 'react';
import {Translate, AppList, IcoN} from 'components';
class AppView extends React.Component<any, any> {

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
                <a href="" className="active"><Translate>App info</Translate></a>
                <a href=""><Translate>Pictures</Translate></a>
                <a href=""><Translate>Permissions</Translate></a>
                <a href=""><Translate>Reviews</Translate></a>
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
