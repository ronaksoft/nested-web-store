import * as React from 'react';
import {Translate, IcoN, Affixer} from 'components';
import {Link} from 'react-router';
import {message, Popconfirm} from 'antd';
import {IApplication} from 'api/interfaces';
import * as _ from 'lodash';
import {app as AppFactory} from '../../../api';
import Const from 'api/consts/CServer';

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
}

class AdminApp extends React.Component<IProps, IState> {
  private translator: Translate;
  private appFactory: AppFactory;
  private pagination: any;

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
      .searchAll('', 0, this.pagination.skip, this.pagination.limit)
      .then((data) => {
        if (data.apps === null) {
          message.warning(this.translator._getText('Reached the end!'));
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

  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof AdminCategory
   * @override
   * @generator
   */
  public render() {
    return (
      <div className="admin-wrapper admin-app-list-scene">
        <Affixer offsetTop={72} zIndex={4} height={80}>
          <div className="page-buttons">
            <h2><Translate>Applications</Translate></h2>
          </div>
        </Affixer>
        <Link className="add" to="/admin/app/create">
          <IcoN name="cross24" size={24}/>
          <span>Build an application</span>
        </Link>

        <ul className="app-vertical-list admin-list">
          {this.state.apps.map((app) => (
            <li key={app._id}>
              <div className="app-icon">
                <img src={Const.SERVER_URL + app.logo.path} alt=""/>
              </div>
              <div className="app-info">
                <h4>
                  {app.name}
                  <span className="app-badge published"><Translate>PUBLISHED</Translate></span>
                </h4>
                <p>{app.categories && app.categories.length > 0 ? app.categories[0].name : ''}</p>
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
