import * as React from 'react';
import {Link} from 'react-router';
import {Translate, IcoN, Affixer} from 'components';
import {message} from 'antd';
import {IReport} from 'api/interfaces';
import * as _ from 'lodash';
import TimeUntiles from 'services/utils/time';
import {
  report as ReportFactory,
} from 'api';
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
  reports: IReport[];
  untouched: boolean;
  pageCount: number;
  keyword: string;
}

class AdminReport extends React.Component<IProps, IState> {
  private translator: Translate;
  private reportFactory: ReportFactory;
  private pagination: any;

  /**
   * @constructor
   * Creates an instance of AppAdd.
   * @param {IProps} props
   * @memberof AdminPermission
   */
  constructor(props: any) {
    super(props);
    this.translator = new Translate();
    this.state = {
      loading: false,
      untouched: true,
      reports: [],
      keyword: '',
      pageCount: 1,
    };
    this.reportFactory = new ReportFactory();
    this.pagination = {
      skip: 0,
      limit: 10,
    };
  }

  private loadreports = () => {
    this.reportFactory.getAll(this.state.keyword, this.pagination.skip, this.pagination.limit).then((data) => {
      if (data.reports === null) {
        this.setState({
          reports: [],
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
        reports: data.reports,
        pageCount: Math.floor(data.count / this.pagination.limit) + 1,
      });
    }).catch(() => {
      message.error(this.translator._getText('Can\'t fetch reports!'));
    });
  }

  private loadreportsDebounced = _.debounce(this.loadreports, 512);

  public componentDidMount() {
    this.loadreports();
  }

  private changeSearch = (event) => {
    this.setState({keyword: event.target.value});
    this.pagination = {
      skip: 0,
      limit: 10,
    };
    this.loadreportsDebounced();
  }

  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof AdminPermission
   * @override
   * @generator
   */
  public render() {
    return (
      <div className="admin-wrapper">
        <div className="permissions-scene">
          <Affixer offsetTop={72} zIndex={4} height={80}>
            <div className="page-buttons">
              <h2><Translate>reports</Translate></h2>
            </div>
          </Affixer>
          <Affixer offsetTop={136} zIndex={4} height={48}>
            <div className="search-list">
              <IcoN name="search24" size={24}/>
              <input type="text" onChange={this.changeSearch}
                     placeholder={this.translator._getText('Search in reports...')}/>
            </div>
          </Affixer>
          <ul className="reports-list admin-list manage-review-list">
            {this.state.reports.map((report) => (
              <li key={report._id}>
                <div className="rev-logo">
                  {!report.user.picture &&
                  <img src="/public/assets/icons/absents_place.svg" alt=""/>}
                  {report.user.picture &&
                  <img
                    src={report.user.picture.indexOf('http') > -1 ? report.user.picture :
                      Const.SERVER_URL + report.user.picture}
                    alt=""/>}
                </div>
                <div className="rev-info">
                  <div className="_df">
                    <h4>
                      {report.created_by_name}
                      <time className="openSans">{TimeUntiles.dynamic(report.created_at)}</time>
                    </h4>
                    {/* <div className="accept-button" onClick={this.onConfirm.bind(this, report._id)}>
                      <IcoN name="heavyCheck24" size={24}/>
                    </div> */}
                  </div>
                  <Link to={'/admin/app/' + report.app_id}>
                    <strong>{report.app_id}</strong>
                  </Link>
                  <p>{report.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default AdminReport;
