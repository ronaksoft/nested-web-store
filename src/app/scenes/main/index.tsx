import * as React from 'react';
import AppSearch from 'components/app-search';
interface IState {
  slides: IApplication[];
  recentApps: IApplication[];
  featuredApps: IApplication[];
  categories: ICategory[];
}

import {Translate, AppList} from 'components';
import {category as CategoryFactory, app as AppFactory} from '../../api';
import {message} from 'antd';
import {IApplication, ICategory} from '../../api/interfaces';
class Main extends React.Component<any, IState> {
  private translator: Translate;
  private categoryFactory: CategoryFactory;
  private appFactory: AppFactory;
  /**
   * @constructor
   * Creates an instance of Sidebar.
   * @param {ISidebarProps} props
   * @memberof Main
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
    this.translator = new Translate();
    this.categoryFactory = new CategoryFactory();
    this.appFactory = new AppFactory();
  }

  public componentDidMount() {
    if (this.state.categories.length === 0) {
      this.categoryFactory.getAll().then((data) => {
        if (data === null) {
          return;
        }
        this.setState({
          categories: data,
        });
      }).catch(() => {
        message.error(this.translator._getText('Can\'t fetch categories!'));
      });
    }
    if (this.state.recentApps.length === 0) {
      this.appFactory.getAll('recent').then((data) => {
        if (data === null) {
          return;
        }
        this.setState({
          recentApps: data,
        });
      }).catch(() => {
        message.error(this.translator._getText('Can\'t fetch recent apps!'));
      });
    }
  }

  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof Main
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
                  {
                    this.state.categories.map((category, index) => {
                      return (
                        <li key={'category-' + index}>{category.name}</li>
                      );
                    })
                  }
                </ul>
              </div>
              <div className="apps-wrapper">
                <AppSearch/>
                <AppList title={<Translate>Featured Apps</Translate>} haveMore={true} items={this.state.featuredApps}/>
                <AppList title={<Translate>Most Recent Apps</Translate>} haveMore={true} items={this.state.recentApps}/>
              </div>
            </div>
          </div>
      </div>
    );
  }
}

export default Main;
