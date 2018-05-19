import * as React from 'react';
import AppSearch from 'components/app-search';
import {message} from 'antd';
import {category as CategoryFactory, app as AppFactory} from '../../api';
import {Link} from 'react-router';
import {Translate, AppList, ProperLanguage} from 'components';
import {IApplication, ICategory} from '../../api/interfaces';

interface IState {
  slides: IApplication[];
  apps: IApplication[];
  recentApps: IApplication[];
  featuredApps: IApplication[];
  categories: ICategory[];
  category: ICategory;
}
interface IProps {
  location: any;
}

class Browse extends React.Component<IProps, IState> {
  private translator: Translate;
  private categoryFactory: CategoryFactory;
  private appFactory: AppFactory;
  /**
   * @constructor
   * Creates an instance of Sidebar.
   * @param {ISidebarProps} props
   * @memberof Browse
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
        apps: initData.__INITIAL_DATA__.recent_apps || [],
        recentApps: initData.__INITIAL_DATA__.recent_apps || [],
        featuredApps: initData.__INITIAL_DATA__.featured_apps || [],
        categories: initData.__INITIAL_DATA__.categories || [],
        category: null,
      };
      initData.__INITIAL_DATA__ = {};
    } else {
      this.state = {
        slides: [],
        apps: [],
        recentApps: [],
        featuredApps: [],
        categories: [],
        category: null,
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
      const initCat = this.getCatFromPath(this.props.location.pathname);
      if (initCat) {
        this.getApps(initCat);
      }
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

  private getCatFromPath(path): string {
    const pathArr = path.split('/');
    return pathArr[2];
  }

  public componentWillReceiveProps(newProps) {
  const catSlug = this.getCatFromPath(newProps.location.pathname);
    if (
      (!this.state.category && catSlug) ||
      (catSlug && catSlug !== this.state.category.slug)
    ) {
      const category = this.state.categories.find((cat) => cat.slug === catSlug);
      if (category) {
        this.setState({
          category,
        }, () => { this.getApps(); }); // to avoid bad paramater
      }
    }
  }

  private getApps = (categorySlug?: string) => {
    const category = categorySlug || (this.state.category && this.state.category.slug);
    if (category) {
      this.appFactory.getByCategory(category).then((data) => {
        if (data === null) {
          return;
        }
        this.setState({
          apps: data,
        });
      }).catch(() => {
        message.error(this.translator._getText('Can\'t fetch this category apps!'));
      });
    }
  }

  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof Browse
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
            {
              this.state.categories.map((category, index) => {
                return (
                  <li key={'category-' + index}>
                    <Link to={'/apps/' + category.slug}><ProperLanguage model={category} property="name"/></Link>
                  </li>
                );
              })
            }
          </ul>
          </div>
          <div className="content-wrapper">
            <AppSearch/>
            {this.state.category && (
              <AppList title={<ProperLanguage model={this.state.category} property="name"/>}
                haveMore={false} items={this.state.apps}/>
            )}
            <AppList title={<Translate>Featured Apps</Translate>} haveMore={true} items={this.state.featuredApps}/>
            <AppList title={<Translate>Most Recent Apps</Translate>} haveMore={true} items={this.state.recentApps}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Browse;
