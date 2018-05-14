import * as React from 'react';
import {Translate, IcoN, Affixer} from 'components';
import {Link} from 'react-router';
import {message, Popconfirm} from 'antd';
import {IApplication} from 'api/interfaces';
import * as _ from 'lodash';
import {app as AppFactory} from '../../../api';
import Const from 'api/consts/CServer';

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
}

class AdminApp extends React.Component<IProps, IState> {
  private translator: Translate;
  private appFactory: AppFactory;

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
    };
    this.state = state;
    this.appFactory = new AppFactory();
  }

  public componentDidMount() {
    this.appFactory.getAll('recent').then((data) => {
      if (data === null) {
        return;
      }
      this.setState({
        apps: data,
      });
    }).catch(() => {
      message.error(this.translator._getText('Can\'t fetch apps!'));
    });
  }

  private makeFeature = (id) => {
    console.log(id);
    // todo
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

  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof AdminCategory
   * @override
   * @generator
   */
  public render() {
    return (
      <div className="admin-wrapper">
        <div className="add-category">
          <Affixer offsetTop={72} zIndex={4} height={80}>
            <div className="page-buttons">
              <h2><Translate>Applications</Translate></h2>
            </div>
          </Affixer>
          <Link className="add" to="/admin/app/create">
            <IcoN name="cross24" size={24}/>
            <span>Build an application</span>
          </Link>

          <ul className="app-vertical-list">
            {this.state.apps.map((app) => (
              <li key={app._id}>
                <div className="app-icon">
                  <img src={Const.SERVER_URL + app.logo.path} alt=""/>
                </div>
                <div className="app-info">
                  <h4>{app.name}</h4>
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
                    <IcoN name="negativeXCross24" size={24}/>
                  </div>
                </Popconfirm>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default AdminApp;
