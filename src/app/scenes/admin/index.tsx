/**
 * @file component/sidebar/index.tsx
 * @author robzizo < me@robzizo.ir >
 * @description manage the private routes and sidebar open or close actions
 *              Documented by:          robzizo
 *              Date of documentation:  2017-07-24
 *              Reviewed by:            -
 *              Date of review:         -
 */
import * as React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {IUser} from 'api/interfaces';
import * as Cookies from 'cookies-js';

import {Translate, Affixer} from 'components';
import {reactTranslateChangeLanguage} from 'components/';
interface IState {
  isLogin: boolean;
  user: IUser;
  lang: string;
}

interface IProps {
  isLogin: boolean;
  user: IUser;
}

class AdminWrapper extends React.Component<IProps, IState> {

  public constructor(props: IProps) {
    super(props);
    let initData: any;
    if (typeof window !== 'undefined') {
      initData = window;
    }
    // const win = window || {initailData: null};
    /**
     * @default this.state
     * @type {IState}
     */
    if (initData) {
      this.state = {
        isLogin: false,
        user: initData.__INITIAL_DATA__.user || props.user || null,
        lang: initData.__INITIAL_DATA__.locale || Cookies.get('locale') || 'en', // from browser
      };
    } else {
      this.state = {
        isLogin: false,
        user: this.props.user || null,
        lang: 'en',
      };
    }
  }

  public componentWillReceiveProps(newProps: IProps) {
    this.setState({
      user: newProps.user,
    });
  }

  public componentDidMount() {
    reactTranslateChangeLanguage(this.state.lang);
  }

  /**
   * renders the component if the credentials are valid
   * @returns {ReactElement} markup
   * @memberof Private
   * @override
   * @generator
   */
  public render() {
    if (!this.state.user) {
      // browserHistory.push('/');
      return (
        <div className="main-container">
          <div className="main-container-inner">
            <div><Translate>Please Login to continue</Translate></div>
          </div>
        </div>
      );
    }
    return (
      <div className="main-container">
        <div className="main-container-inner">
          <Affixer offsetTop={72} zIndex={4} height={80}>
            <div className="sidebar">
              <h3><Translate>Dashboard</Translate></h3>
              <ul>
                <li><Link to="/admin/app" activeClassName="active">
                  <Translate>Applications</Translate>
                </Link></li>
                <li><Link to="/admin/category" activeClassName="active">
                  <Translate>Categories</Translate>
                </Link></li>
                <li><Link to="/admin/permission" activeClassName="active">
                  <Translate>Permissions</Translate></Link>
                </li>
                <li><Link to="/admin/review" activeClassName="active">
                  <Translate>Reviews</Translate></Link>
                </li>
                {/* <li><Link to="/admin/reports" activeClassName="active">
                <Translate>Reports</Translate></Link></li> */}
                <li>
                  <Link to="/admin/user" activeClassName="active">
                    <Translate>Users List</Translate>
                  </Link>
                </li>
              </ul>
            </div>
          </Affixer>
          <div className="content-wrapper">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

/**
 * redux store mapper
 * @param {any} redux store
 * @returns store item object
 */
const mapStateToProps = (store) => ({
  isLogin: store.app.isLogin,
  user: store.app.user,
});

export default connect(mapStateToProps, {})(AdminWrapper);
