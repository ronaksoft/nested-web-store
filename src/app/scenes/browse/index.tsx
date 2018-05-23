import * as React from 'react';
import {message} from 'antd';
import {category as CategoryFactory, app as AppFactory} from '../../api';
import {Link, browserHistory} from 'react-router';
import {Translate, ProperLanguage, IcoN, Loading, Affixer} from 'components';
import {IApplication, ICategory} from '../../api/interfaces';
import {debounce} from 'lodash';

import Const from 'api/consts/CServer';
const ReactPaginate = require('react-paginate');

interface IState {
  apps: IApplication[];
  categories: ICategory[];
  category: ICategory;
  pageCount: number;
  loading: boolean;
  keyword: string;
}
interface IProps {
  location: any;
}

class Browse extends React.Component<IProps, IState> {
  private translator: Translate;
  private categoryFactory: CategoryFactory;
  private appFactory: AppFactory;
  private pagination: any;
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
        apps: initData.__INITIAL_DATA__.recent_apps || [],
        categories: initData.__INITIAL_DATA__.categories || [],
        category: null,
        pageCount: 1,
        loading: true,
        keyword: '',
      };
      initData.__INITIAL_DATA__ = {};
    } else {
      this.state = {
        apps: [],
        categories: [],
        category: null,
        pageCount: 1,
        loading: true,
        keyword: '',
      };
    }
    this.translator = new Translate();
    this.categoryFactory = new CategoryFactory();
    this.appFactory = new AppFactory();
    this.pagination = {
      skip: 0,
      limit: 10,
    };
  }

  public componentDidMount() {
    if (this.state.categories.length === 0) {
      this.categoryFactory.getAll().then((data) => {
        if (data === null) {
          return;
        }
        const initCat = this.getCatFromPath(this.props.location.pathname);
        if (initCat) {
          this.getApps(initCat);
        } else if (data[0]) {
          browserHistory.push('/apps/' + data[0].slug);
        }
        const category = data.find((cat) => cat.slug === initCat);
        this.setState({
          categories: data,
          category,
        });
      }).catch(() => {
        message.error(this.translator._getText('Can\'t fetch categories!'));
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
          loading: true,
        }, () => { this.getApps(); }); // to avoid bad paramater
      }
    }
  }

  private getApps = (categorySlug?: string) => {
    const category = categorySlug || (this.state.category && this.state.category.slug);
    if (category) {
      this.appFactory.getByCategory(category, this.pagination.skip, this.pagination.limit).then(
        (data) => {
        if (data === null) {
          this.setState({
            apps: [],
            loading: false,
          });
          return;
        }
        this.setState({
          apps: data,
          loading: false,
        });
      }).catch(() => {
        this.setState({
          apps: [],
          loading: false,
        });
        message.error(this.translator._getText('Can\'t fetch this category apps!'));
      });
    }
  }

  private loadAppsDebounced = debounce(this.getApps, 512);

  private handlePageClick = (data: any) => {
    this.pagination.skip = this.pagination.limit * data.selected;
    this.getApps();
  }

  private changeSearch = (event) => {
    this.setState({keyword: event.target.value});
    this.pagination = {
      skip: 0,
      limit: 10,
    };
    this.loadAppsDebounced();
  }

  private goToApp(id) {
    browserHistory.push('/app/' + id);
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
                      <Link to={'/apps/' + category.slug} activeClassName="active">
                        <ProperLanguage model={category} property="name"/>
                      </Link>
                    </li>
                  );
                })
              }
            </ul>
          </div>
          <div className="admin-wrapper">
            <Affixer offsetTop={72} zIndex={4} height={80}>
              <div className="page-buttons">
                <h2>
                  {this.state.category && <ProperLanguage model={this.state.category} property="name" />}
                </h2>
              </div>
            </Affixer>
            <Affixer offsetTop={136} zIndex={4} height={48}>
              <div className="search-list">
                <IcoN name="search24" size={24}/>
                <input type="text" onChange={this.changeSearch}
                  placeholder={this.translator._getText('Search in this category...')}/>
              </div>
            </Affixer>
            <ul className="app-list-browse">
              {this.state.apps.map((app) => (
                <li key={app._id} onClick={this.goToApp.bind(this, app.app_id)}>
                  <div className="app-image">
                    <img src={Const.SERVER_URL + app.logo.path} alt=""/>
                  </div>
                  <div className="app-data">
                    <h4><ProperLanguage model={app} property="name"/></h4>
                    <aside>{app.summary}</aside>
                  </div>
                  <IcoN name="arrow24" size={24}/>
                </li>
              ))}
            </ul>
            {this.state.pageCount > 1 &&
                  <ReactPaginate
                    nextLabel={<IcoN name="arrow24" size={24}/>}
                    previousLabel={<IcoN name="arrow24" size={24}/>}
                    breakLabel={<a href="">...</a>}
                    breakClassName="reak-me"
                    pageCount={this.state.pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={this.handlePageClick}
                    containerClassName="pagination"
                    subContainerClassName="pages pagination"
                    activeClassName="active"/>}
            {this.state.apps.length === 0 && (
              <h4>
                {!this.state.loading && <Translate>No Apps found</Translate>}
                {this.state.loading && <Loading position="absolute" active={true}/>}
              </h4>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Browse;
