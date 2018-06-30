import * as React from 'react';
import AppSearch from 'components/app-search';
import {Link} from 'react-router';
import {Translate, AppList, ProperLanguage} from 'components';
import {category as CategoryFactory, app as AppFactory} from 'api';
import {message} from 'antd';
import {IApplication, ICategory} from 'api/interfaces';
import {Config} from 'api/consts/CServer';

interface IState {
  sliderApps: IApplication[];
  recentApps: IApplication[];
  featuredApps: IApplication[];
  categories: ICategory[];
}

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
        sliderApps: initData.__INITIAL_DATA__.slider_apps || [],
        recentApps: initData.__INITIAL_DATA__.recent_apps || [],
        featuredApps: initData.__INITIAL_DATA__.featured_apps || [],
        categories: initData.__INITIAL_DATA__.categories || [],
      };
      initData.__INITIAL_DATA__ = {};
    } else {
      this.state = {
        sliderApps: [],
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
    if (this.state.sliderApps.length === 0) {
      this.appFactory.getAll('slider').then((data) => {
        if (data === null) {
          return;
        }
        this.setState({
          sliderApps: data,
        });
      }).catch(() => {
        message.error(this.translator._getText('Can\'t fetch recent apps!'));
      });
    }
    if (this.state.recentApps.length === 0) {
      this.appFactory.getAll('recent').then((data) => {
        if (data === null) {
          return;
        }
        this.setState({
          recentApps: data.splice(0, 3),
        });
      }).catch(() => {
        message.error(this.translator._getText('Can\'t fetch recent apps!'));
      });
    }
    if (this.state.featuredApps.length === 0) {
      this.appFactory.getAll('featured').then((data) => {
        if (data === null) {
          return;
        }
        this.setState({
          featuredApps: data,
        });
      }).catch(() => {
        message.error(this.translator._getText('Can\'t fetch recent apps!'));
      });
    }
    window.addEventListener('reactTranslateChangeLanguage', this.updateLang);
  }

  public componentWillUnmount() {
    window.removeEventListener('reactTranslateChangeLanguage', this.updateLang);
  }

  private updateLang = () => {
    setTimeout(() => {
      this.translator = new Translate();
      this.forceUpdate();
    }, 100);
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
              {this.state.sliderApps.map((app, index) => {
                  return (
                    <Link key={'slider-' + index} to={'/app/' + app.app_id}>
                      <img src={Config().SERVER_URL + app.logo.path} alt={app.name} className="logo"/>
                    </Link>
                  );
              })}
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
                      <li key={'category-' + index}>
                        <Link to={'/apps/' + category.slug} activeClassName="active">
                          <ProperLanguage model={category} property="name"/>
                        </Link>
                      </li>
                    );
                  })
                }
              </ul>
            </div>
            <div className="content-wrapper">
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
