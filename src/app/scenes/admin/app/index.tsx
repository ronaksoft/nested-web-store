import * as React from 'react';
import {Translate, IcoN, Affixer, ProperLanguage} from 'components';
import {Link} from 'react-router';
import {message, Popconfirm, Popover} from 'antd';
import {IApplication} from 'api/interfaces';
import * as _ from 'lodash';
import {app as AppFactory} from '../../../api';
import Const from 'api/consts/CServer';
import Status from 'api/consts/CAppStatus';

const ReactPaginate = require('react-paginate');

// import {Row, Col, Input, Upload} from 'antd';

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
  loading: boolean;
  apps: IApplication[];
  pageCount: number;
  keyword: string;
}

class AdminApp extends React.Component<IProps, IState> {
  private translator: Translate;
  private appFactory: AppFactory;
  private pagination: any;
  private filterbar: any;

  /**
   * @constructor
   * Creates an instance of AppAdd.
   * @param {IProps} props
   * @memberof Add
   */
  constructor(props: any) {
    super(props);
    this.translator = new Translate();
    const state: IState = {
      loading: false,
      apps: [],
      keyword: '',
      pageCount: 1,
    };
    this.state = state;
    this.appFactory = new AppFactory();
    this.pagination = {
      skip: 0,
      limit: 10,
    };
  }

  public componentDidMount() {
    this.loadApps();
  }

  private loadApps() {
    this.appFactory
      .searchAll(this.state.keyword, 0, this.pagination.skip, this.pagination.limit)
      .then((data) => {
        if (data.apps === null) {
          this.setState({
            apps: [],
            pageCount: 1,
          });
          if (this.pagination.skip > 0) {
            message.warning(this.translator._getText('Reached the end!'));
          } else {
            message.warning(this.translator._getText('No results'));
          }
          return;
        }
        this.setState({
          apps: data.apps,
          pageCount: Math.floor(data.count / this.pagination.limit) + 1,
        });
      }).catch(() => {
      message.error(this.translator._getText('Can\'t fetch apps!'));
    });
  }

  private loadAppsDebounced = _.debounce(this.loadApps, 512);

  private makeFeature = (id) => {
    this.appFactory.star(id).then((data) => {
      const apps = this.state.apps;
      const index = _.findIndex(this.state.apps, {_id: data._id});
      if (index > -1) {
        apps[index].stared = !apps[index].stared;
      }
      this.setState({
        apps,
      });
    });
  }

  private onRemove = (id) => {
    const apps: IApplication[] = this.state.apps;
    this.appFactory.remove(id).then(() => {
      const index = _.findIndex(apps, {
        _id: id,
      });
      if (index > -1) {
        apps.splice(index, 1);
      }
      this.setState({
        apps,
      });
      message.success(this.translator._getText('Application successfully removed'));
    }).catch(() => {
      message.error(this.translator._getText('Can\'t remove application!'));
    });
  }

  private handlePageClick = (data: any) => {
    this.pagination.skip = this.pagination.limit * data.selected;
    this.loadApps();
  }

  private refHandler = (element) => {
    this.filterbar = element;
  }

  private getPopupContainer = () => this.filterbar;

  private changeSearch = (event) => {
    this.setState({keyword: event.target.value});
    this.pagination = {
      skip: 0,
      limit: 10,
    };
    this.loadAppsDebounced();
  }

  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof AdminCategory
   * @override
   * @generator
   */
  public render() {
    const sortMenu = (
      <ul className="sort-menu">
        <li className="container-icon">
          <Translate>Sort</Translate>
        </li>
        <li className="active"><Translate>Date added</Translate></li>
        <li><Translate>Starred</Translate></li>
      </ul>
    );
    const filterMenu = (
      <ul className="filter-menu">
      <li className="container-icon">
        <Translate>Filter</Translate>
      </li>
        <li>
          <label htmlFor="checkbox-published" className="app-badge published">
            <Translate>PUBLISHED</Translate>
          </label>
          <div className="filler"/>
          <input id="checkbox-published" type="checkbox" defaultChecked={true}/>
        </li>
        <li>
          <label htmlFor="checkbox-pending" className="app-badge pending">
            <Translate>PENDING</Translate>
          </label>
          <div className="filler"/>
          <input id="checkbox-pending" type="checkbox" defaultChecked={true}/>
        </li>
        <li>
          <label htmlFor="checkbox-suspended" className="app-badge suspended">
            <Translate>SUSPENDED</Translate>
          </label>
          <div className="filler"/>
          <input id="checkbox-suspended" type="checkbox" defaultChecked={true}/>
        </li>
        <li>
          <label htmlFor="checkbox-declined" className="app-badge declined">
            <Translate>DECLINED</Translate>
          </label>
          <div className="filler"/>
          <input id="checkbox-declined" type="checkbox" defaultChecked={true}/>
        </li>
        <li>
          <label htmlFor="checkbox-badge" className="app-badge unpublished">
            <Translate>DECLINED</Translate>
          </label>
          <div className="filler"/>
          <input id="checkbox-badge" type="checkbox" defaultChecked={true}/>
        </li>
      </ul>
    );
    return (
      <div className="admin-wrapper admin-app-list-scene">
        <Affixer offsetTop={72} zIndex={4} height={80}>
          <div className="page-buttons">
            <h2><Translate>Applications</Translate></h2>
            <Link className="butn butn-blue" to="/admin/app/create">
              <Translate>Start Building</Translate>
            </Link>
            <div className="_df" ref={this.refHandler}>
              <Popover placement="bottomRight" trigger="click" content={filterMenu}
                overlayClassName="popover-no-padding" getPopupContainer={this.getPopupContainer}>
                <div className="filter">
                  <IcoN name="filter24" size={24}/>
                </div>
              </Popover>
              <Popover placement="bottomRight" trigger="click" content={sortMenu} overlayClassName="popover-no-padding"
                getPopupContainer={this.getPopupContainer}>
                <div className="sort">
                  <IcoN name="sort24" size={24}/>
                </div>
              </Popover>
            </div>
          </div>
        </Affixer>
        <Affixer offsetTop={136} zIndex={4} height={48}>
          <div className="search-list">
            <IcoN name="search24" size={24}/>
            <input type="text" onChange={this.changeSearch}
              placeholder={this.translator._getText('Search in apps...')}/>
          </div>
        </Affixer>

        <ul className="app-vertical-list admin-list">
          {this.state.apps.map((app) => (
            <li key={app._id}>
              <div className="app-icon">
                <img src={Const.SERVER_URL + app.logo.path} alt=""/>
              </div>
              <div className="app-info">
                <h4>
                  <ProperLanguage model={app} property="name" />
                  {app.status === Status.PUBLISHED &&
                  <span className="app-badge published"><Translate>PUBLISHED</Translate></span>}
                  {app.status === Status.DECLINED &&
                  <span className="app-badge declined"><Translate>DECLINED</Translate></span>}
                  {app.status === Status.PENDING &&
                  <span className="app-badge pending"><Translate>PENDING</Translate></span>}
                  {app.status === Status.SUSPENDED &&
                  <span className="app-badge susoended"><Translate>SUSPENDED</Translate></span>}
                  {app.status === Status.UNPUBLISHED &&
                  <span className="app-badge unpublished"><Translate>UNPUBLISHED</Translate></span>}
                </h4>
                <p>{app.app_id}</p>
              </div>
              <div className={app.stared ? 'feature-button active' : 'feature-button'}
                   onClick={this.makeFeature.bind(this, app._id)}>
                <IcoN name="star24" size={24}/>
              </div>
              <Link className="edit-button" to={'/admin/app/edit/' + app._id}>
                <IcoN name="pencil24" size={24}/>
              </Link>
              <Popconfirm title="Are you sure about removing this Application?"
                          onConfirm={this.onRemove.bind(this, app._id)}
                          okText="Yes" cancelText="No">
                <div className="remove-button">
                  <IcoN name="binRed24" size={24}/>
                </div>
              </Popconfirm>
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
      </div>
    );
  }
}

export default AdminApp;
