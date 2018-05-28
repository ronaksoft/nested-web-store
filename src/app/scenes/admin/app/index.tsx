import * as React from 'react';
import {Translate, IcoN, Affixer, ProperLanguage} from 'components';
import {Link} from 'react-router';
import {message, Popconfirm, Popover, Tooltip} from 'antd';
import {IApplication} from 'api/interfaces';
import * as _ from 'lodash';
import {app as AppFactory} from '../../../api';
import {Config} from 'api/consts/CServer';
import Status, {default as CAppStatus} from 'api/consts/CAppStatus';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

const ReactPaginate = require('react-paginate');

// import {Row, Col, Input, Upload} from 'antd';
interface ITopApp {
  id: string;
  logoPath: string;
}

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
  sliderApps: ITopApp[];
  pageCount: number;
  keyword: string;
  selectedStatuses: number[];
  sort: string;
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
      sliderApps: [],
      keyword: '',
      pageCount: 1,
      selectedStatuses:
        [CAppStatus.PUBLISHED, CAppStatus.UNPUBLISHED, CAppStatus.SUSPENDED, CAppStatus.PENDING, CAppStatus.DECLINED],
      sort: '',
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
    this.appFactory.getAll('slider').then((data) => {
      if (data === null) {
        return;
      }
      this.setState({
        sliderApps: data.map((app) => {
          return {
            id: app._id,
            logoPath: app.logo.path,
          };
        }),
      });
    });
  }

  private loadApps() {
    this.appFactory
      .adminSearch(
        this.state.keyword, this.state.selectedStatuses, this.state.sort,
        this.pagination.skip, this.pagination.limit)
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
        apps[index].starred = !apps[index].starred;
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
      message.error(this.translator._getText('Can\'t remove the application!'));
    });
  }

  private setStatus = (id, status) => {
    this.appFactory.setStatus(id, status).then(() => {
      message.success(this.translator._getText('Application status successfully changed'));
      const apps = this.state.apps;
      const index = _.findIndex(apps, {_id: id});
      if (index > -1) {
        apps[index].status = status;
        this.setState({
          apps,
        });
      }
    }).catch(() => {
      message.error(this.translator._getText('Can\'t change status of the application!'));
    });
  }

  private removeSliderApp = (app) => {
    const appItemIndex = this.state.sliderApps.findIndex((a) => a.id === app.id);
    const sliderApps = this.state.sliderApps;
    sliderApps.splice(appItemIndex, 1);
    this.setState({sliderApps});
    this.appFactory.setSliderApps(sliderApps.map((a) => a.id)).then(() => {
      message.success(this.translator._getText('Slider app successfully deleted'));
    }).catch(() => {
      sliderApps.splice(appItemIndex, 0, app);
      this.setState({sliderApps});
      message.warning(this.translator._getText('Can\'t set slider apps'));
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

  private onSortEnd = ({oldIndex, newIndex}) => {
    const newApps = arrayMove(this.state.sliderApps, oldIndex, newIndex);
    this.appFactory.setSliderApps(newApps.map((app) => {
      return app.id;
    })).then(() => {
      this.setState({
        sliderApps: newApps,
      });
      message.success(this.translator._getText('Slider apps successfully updated'));
    }).catch(() => {
      message.warning(this.translator._getText('Can\'t set slider apps'));
    });
  }

  private onDrop = (event) => {
    event.preventDefault();
    const id = event.dataTransfer.getData('appId');
    if (!this.state.sliderApps.find((app) => app.id === id)) {
      const newApp = this.state.apps.find((app) => app._id === id);
      if (newApp.status !== CAppStatus.PUBLISHED) {
        message.warning(this.translator._getText('You can\'t set an unpublished app in slider'));
        return;
      }
      const newApps = [...this.state.sliderApps, {id: newApp._id, logoPath: newApp.logo.path}];
      this.appFactory.setSliderApps(newApps.map((app) => {
        return app.id;
      })).then(() => {
        this.setState({
          sliderApps: newApps,
        });
        message.success(this.translator._getText('Slider apps successfully updated'));
      }).catch(() => {
        message.warning(this.translator._getText('Can\'t set slider apps'));
      });
    } else {
      message.warning(this.translator._getText('App already is in top apps'));
    }
  }

  private drag = (event) => {
    event.dataTransfer.setData('appId', event.target.id);
  }

  private allowDrop = (event) => {
    event.preventDefault();
  }

  private setStatusFilter = (status, event) => {
    const statuses = this.state.selectedStatuses;
    if (event.target.checked) {
      statuses.push(status);
    } else {
      const index = statuses.indexOf(status);
      if (index > -1) {
        statuses.splice(index, 1);
      }
    }
    this.setState({
      selectedStatuses: statuses,
    }, () => {
      this.loadApps();
    });
  }

  private setSort = (sort) => {
    this.setState({
      sort,
    }, () => {
      this.loadApps();
    });
  }

  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof AdminCategory
   * @override
   * @generator
   */
  public render() {
    const isAdmin = true;
    const unfilledSliderApps = [{}, {}, {}, {}, {}].splice(0, 5 - this.state.sliderApps.length);

    const sortMenu = (
      <ul className="sort-menu">
        <li className="container-icon">
          <Translate>Sort</Translate>
        </li>
        <li className={this.state.sort !== 'starred' ? 'active' : ''}
            onClick={this.setSort.bind(this, '')}>
          <Translate>Date added</Translate></li>
        <li className={this.state.sort === 'starred' ? 'active' : ''}
            onClick={this.setSort.bind(this, 'starred')}>
          <Translate>Starred</Translate></li>
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
          <input id="checkbox-published" type="checkbox" defaultChecked={true}
                 onChange={this.setStatusFilter.bind(this, CAppStatus.PUBLISHED)}/>
        </li>
        <li>
          <label htmlFor="checkbox-pending" className="app-badge pending">
            <Translate>PENDING</Translate>
          </label>
          <div className="filler"/>
          <input id="checkbox-pending" type="checkbox" defaultChecked={true}
                 onChange={this.setStatusFilter.bind(this, CAppStatus.PENDING)}/>
        </li>
        <li>
          <label htmlFor="checkbox-suspended" className="app-badge suspended">
            <Translate>SUSPENDED</Translate>
          </label>
          <div className="filler"/>
          <input id="checkbox-suspended" type="checkbox" defaultChecked={true}
                 onChange={this.setStatusFilter.bind(this, CAppStatus.SUSPENDED)}/>
        </li>
        <li>
          <label htmlFor="checkbox-declined" className="app-badge declined">
            <Translate>DECLINED</Translate>
          </label>
          <div className="filler"/>
          <input id="checkbox-declined" type="checkbox" defaultChecked={true}
                 onChange={this.setStatusFilter.bind(this, CAppStatus.DECLINED)}/>
        </li>
        <li>
          <label htmlFor="checkbox-badge" className="app-badge unpublished">
            <Translate>UNPUBLISHED</Translate>
          </label>
          <div className="filler"/>
          <input id="checkbox-badge" type="checkbox" defaultChecked={true}
                 onChange={this.setStatusFilter.bind(this, CAppStatus.UNPUBLISHED)}/>
        </li>
      </ul>
    );
    const SortableItem = SortableElement(({app, index}) => (
      <li className="top-app-item" key={'a' + index}>
        <img src={Config().SERVER_URL + app.logoPath} alt=""/>
        <div className="slider-item-handler" onClick={this.removeSliderApp.bind(this, app)}>
          <IcoN name="negativeXCross16" size={16}/>
        </div>
      </li>
    ));
    const SortableList = SortableContainer(() => {
      return (
        <ul className="top-apps">
          {this.state.sliderApps.map((app, index) => (
            <SortableItem key={`item-${index}`} index={index}
                          onSortEnd={this.onSortEnd} app={app}/>
          ))}
          {unfilledSliderApps.map((_, index) => (
            <li className="top-app-item" onDrop={this.onDrop} key={index}
                onDragOver={this.allowDrop}>
              <IcoN name="cross24" size={24}/>
            </li>
          ))}
        </ul>
      );
    });
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
                       overlayClassName="popover-no-padding popover-filter-bar"
                       getPopupContainer={this.getPopupContainer}>
                <div className="filter">
                  <IcoN name="filter24" size={24}/>
                </div>
              </Popover>
              <Popover placement="bottomRight" trigger="click" content={sortMenu}
                       overlayClassName="popover-no-padding popover-filter-bar"
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
        {isAdmin && (
          <h4 className="list-head"><Translate>Top apps</Translate></h4>
        )}
        {isAdmin && (
          <SortableList onSortEnd={this.onSortEnd} distance={2} lockAxis="Y" axis="x"/>
        )}
        <h4 className="list-head"><Translate>All apps</Translate></h4>
        <ul className="app-vertical-list admin-list">
          {this.state.apps.map((app) => (
            <li key={app._id}>
              <div className="app-icon">
                <img src={Config().SERVER_URL + app.logo.path} draggable={true} onDragStart={this.drag} id={app._id}/>
              </div>
              <div className="app-info">
                <Link to={'/admin/app/edit/' + app._id}>
                  <h4>
                    <ProperLanguage model={app} property="name"/>
                    {app.status === Status.PUBLISHED &&
                    <span className="app-badge published"><Translate>PUBLISHED</Translate></span>}
                    {app.status === Status.DECLINED &&
                    <span className="app-badge declined"><Translate>DECLINED</Translate></span>}
                    {app.status === Status.PENDING &&
                    <span className="app-badge pending"><Translate>PENDING</Translate></span>}
                    {app.status === Status.SUSPENDED &&
                    <span className="app-badge suspended"><Translate>SUSPENDED</Translate></span>}
                    {app.status === Status.UNPUBLISHED &&
                    <span className="app-badge unpublished"><Translate>UNPUBLISHED</Translate></span>}
                    {app.status > 1 && (
                      <Tooltip placement="top" title="reason"
                            overlayClassName="popover-no-padding">
                        <div style={{display: 'inline-flex'}}>
                          <IcoN name="ask16" size={16}/>
                        </div>
                      </Tooltip>
                    )}
                  </h4>
                  <p>{app.app_id}</p>
                </Link>
              </div>
              <Popover placement="topRight" trigger="click"
                       overlayClassName="popover-no-padding" content={(
                <ul className="app-more-menu">
                  <li>
                    <Link to={'/admin/app/edit/' + app._id}>
                      <IcoN name="pencil16" size={16}/>
                      <Translate>Edit app</Translate>
                    </Link>
                  </li>
                  <li className={app.starred ? 'feature-button active' : 'feature-button'}
                      onClick={this.makeFeature.bind(this, app._id)}>
                    <IcoN name="star16" size={16}/>
                    <Translate>Feature app</Translate>
                  </li>
                  <li className="hr"/>
                  <li>
                    <Popconfirm title="Are you sure about removing this Application?"
                                onConfirm={this.onRemove.bind(this, app._id)}
                                okText="Yes" cancelText="No">
                      <IcoN name="binRed16" size={16}/>
                      <Translate>Remove app</Translate>
                    </Popconfirm>
                  </li>
                  <li className="suspend-item"
                      onClick={this.setStatus.bind(this, app._id, CAppStatus.SUSPENDED)}>
                    <IcoN name="unavailable16" size={16}/>
                    <Translate>Suspend app</Translate>
                  </li>
                  <li className="publish-item"
                      onClick={this.setStatus.bind(this, app._id, CAppStatus.PUBLISHED)}>
                    <IcoN name="unavailable16" size={16}/>
                    <Translate>Publish</Translate>
                  </li>
                  <li className="decline-item"
                      onClick={this.setStatus.bind(this, app._id, CAppStatus.DECLINED)}>
                    <IcoN name="unavailable16" size={16}/>
                    <Translate>Decline</Translate>
                  </li>
                </ul>
              )}>
                <div className="remove-button">
                  <IcoN name="more24" size={24}/>
                </div>
              </Popover>
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
