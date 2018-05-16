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
// import {browserHistory} from 'react-router';
import {Link} from 'react-router';
import {login, logout} from 'redux/app/actions';
import './main.less';
import AppView from './view/';
import Main from './main/';
import Browse from './browse/';
import AdminApp from './admin/app';
import AdminAddApp from './admin/app/add';
import AdminAddCategory from './admin/category';
import AdminUsers from './admin/users';
import AdminPermission from './admin/permission';
import AdminWrapper from './admin/';
import {IUser} from 'api/interfaces';
import * as Cookies from 'cookies-js';
import {Translate} from 'components';
import {reactTranslateChangeLanguage} from 'components/';
import Const from './../api/consts/CServer';
import axios from 'axios';
import {message, Modal} from 'antd';

interface IState {
  isLogin: boolean;
  isAdminPage: boolean;
  openSignInModal: boolean;
  user: any[];
  lang: string;
  signin: any;
}

interface IProps {
  isLogin: boolean;
  user: IUser;
  params: string;
  setLogin: (user: IUser) => {};
  setLogout: () => {};
  location: any;
}

class Container extends React.Component<IProps, IState> {
  private translator: Translate;

  public constructor(props: IProps) {
    super(props);
    this.translator = new Translate();
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
        isAdminPage: false,
        signin: {
          username: '',
          password: '',
        },
        openSignInModal: false,
        user: initData.__INITIAL_DATA__.user || [],
        lang: initData.__INITIAL_DATA__.locale || Cookies.get('locale') || 'en', // from browser
      };
    } else {
      this.state = {
        isLogin: false,
        isAdminPage: false,
        signin: {
          username: '',
          password: '',
        },
        openSignInModal: false,
        user: [],
        lang: 'en',
      };
    }
  }

  public componentDidMount() {
    reactTranslateChangeLanguage(this.state.lang);
    this.checkIsAdmin(this.props.location.pathname);
  }

  public checkIsAdmin = (path: string) => {
    console.log(path);
    if (path.indexOf('/admin/') > -1 && !this.state.isAdminPage) {
      this.setState({
        isAdminPage: true,
      });
    } else if (path.indexOf('/admin/') === -1 && this.state.isAdminPage) {
      this.setState({
        isAdminPage: false,
      });
    }
  }

  public componentWillReceiveProps(props) {
    console.log(props.location.pathname);
    this.checkIsAdmin(props.location.pathname);
  }

  public toggleSignInModal = () => {
    this.setState({
      openSignInModal: !this.state.openSignInModal,
    });
  }

  public signInWithNested = () => {
    const websiteUrl = Const.SERVER_URL;
    const strWindowFeatures = 'location=yes,height=570,width=520,scrollbars=yes,status=yes';
    const oauthWindow: any = window.open('', '_blank', strWindowFeatures);
    axios.post(websiteUrl + '/user/oauth/token/create').then((response) => {
      if (response.data.status === 'ok') {
        oauthWindow.location = 'https://webapp.ronaksoftware.com/oauth/?client_id=' + Const.CLIENT_ID +
          '&redirect_uri=' + websiteUrl + '/user/oauth&scope=read%20profile%20data,create%20app,get%20token&token=' +
          response.data.data;
        if (oauthWindow === undefined) {
          message.error('Please disable your popup blocker');
          return;
        }
        const interval = setInterval(() => {
          if (oauthWindow.closed) {
            clearInterval(interval);
            axios.post(websiteUrl + '/user/oauth/token/login', {
              code: response.data.data,
            }).then(() => {
              window.location.reload();
            }).catch((err) => {
              message.error(err);
            });
          }
        }, 1000);
      } else {
        oauthWindow.close();
      }
    }).catch((err) => {
      message.error(err);
    });
  }

  private submitLoginForm = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // tODO
  }

  private bindInputToModel(selector: any, e: any) {
    const signin = this.state.signin;
    if (typeof selector === 'object') {
      const elem = selector.name.split('[]');
      signin[elem[0]][selector.index][elem[1]] = e.target.value;
    } else {
      signin[selector] = e.target.value;
      if (selector === 'username') {
        signin[selector] = signin[selector].toLowerCase();
      }
    }
    this.setState({
      signin,
    });
  }

  /**
   * renders the component if the credentials are valid
   * @returns {ReactElement} markup
   * @memberof Private
   * @override
   * @generator
   */
  public render() {
    const validateForm = false;
    const {isAdminPage} = this.state;
    return (
      <div>
        {!isAdminPage && (
          <nav className="navbar-wrapper">
            <div className="navbar">
              <img src="/public/assets/icons/Nested_LogoNegative.svg" height="32" alt="Nested" className="logo"/>
              <img src="/public/assets/icons/Nested_EnglishTypeNegative.svg" height="32" alt="Nested"
                  className="logo-type"/>
              <img src="/public/assets/icons/Nested_PersianTypeNegative.svg" height="32" alt="Nested"
                  className="logo-type fa"/>
              <div className="devider"/>
              <Link to="/admin/app">
                <Translate>App Store</Translate>
              </Link>
              <div className="filler"/>
              <Link to="/apps"><Translate>Browse</Translate></Link>
              <button className="butn" onClick={this.toggleSignInModal}><Translate>Sign in</Translate></button>
            </div>
          </nav>
        )}
        {isAdminPage && (
          <nav className="navbar-wrapper">
            <div className="navbar admin">
              <Link to="/">
                <img src="/public/assets/icons/Nested_Logo.svg" height={32} alt="Nested" className="logo"/>
                <img src="/public/assets/icons/Nested_EnglishType.svg" height={32} alt="Nested"
                  className="logo-type"/>
                <img src="/public/assets/icons/Nested_PersianType.svg" height={32} alt="Nested"
                  className="logo-type fa"/>
              </Link>
              <div className="devider"/>
              <Link to="/admin/app/create">
                <Translate>Add an App</Translate>
              </Link>
              <div className="filler"/>
              <div className="user-wrapper"/>
            </div>
          </nav>
        )}
        {this.props.children}
        <footer>
          <div className="footer-inner">
            <div className="_aic">
              <div className="nested">
                <img src="/public/assets/icons/Nested_LogoNegative.svg" alt="Nested" className="logo"/>
                <img src="/public/assets/icons/Nested_EnglishTypeNegative.svg" alt="Nested"
                     className="logo-type"/>
                <img src="/public/assets/icons/Nested_PersianTypeNegative.svg" alt="Nested"
                     className="logo-type fa"/>
              </div>
              <Translate>App Store</Translate>
              <div className="languages">
                <img onClick={reactTranslateChangeLanguage.bind(this, 'en')} alt="EN" className="lng-en"
                     src="/public/assets/images/en-logo.png" srcSet="/public/assets/images/en-logo@2x.png"/>
                <div className="devider"/>
                <img src="/public/assets/images/fa-logo.png" srcSet="/public/assets/images/fa-logo@2x.png"
                     onClick={reactTranslateChangeLanguage.bind(this, 'fa')} alt="FA" className="lng-fa"/>
              </div>
            </div>
            <div>
              <h6><Translate>NESTED</Translate></h6>
              <a href=""><Translate>Features</Translate></a>
              <a href=""><Translate>Get Nested app</Translate></a>
            </div>
            <div>
              <h6><Translate>COMPANY</Translate></h6>
              <a href=""><Translate>About us</Translate></a>
              <a href=""><Translate>Press</Translate></a>
              <a href=""><Translate>Work with us</Translate></a>
            </div>
            <div>
              <h6><Translate>SUPPORT</Translate></h6>
              <a href=""><Translate>Help center</Translate></a>
              <a href=""><Translate>Contact us</Translate></a>
              <a href=""><Translate>Terms &amp; Conditions</Translate></a>
              <Link to={'/admin/app/create'}>admin</Link>
            </div>
            <div>
              {/* <h6><Translate>SOCIAL NETWORKS</Translate></h6> */}
              <a href=""><Translate>Blog</Translate></a>
              <a href=""><Translate>Twitter</Translate></a>
              <a href=""><Translate>Facebook</Translate></a>
              <a href=""><Translate>Instagram</Translate></a>
              <a href=""><Translate>LinkedIn</Translate> </a>
            </div>
          </div>
        </footer>
        <Modal
          wrapClassName="vertical-center-modal"
          className="signin-modal"
          width="360px"
          visible={this.state.openSignInModal}
          onCancel={this.toggleSignInModal}
          maskClosable={true}
        >
          <div className="app-store-logo">
            <img src="/public/assets/icons/App_StoreNegative.svg" height="92" alt="Nested" className="store-logo"/>
            <div className="nested-logo-name">
              <img src="/public/assets/icons/Nested_EnglishTypeNegative.svg" width="136" alt="Nested"
                  className="logo-type"/>
              <img src="/public/assets/icons/Nested_PersianTypeNegative.svg" width="136" alt="Nested"
                  className="logo-type fa"/>
              <Translate>App Store</Translate>
            </div>
          </div>
          <div className="login-des">
            <h2><Translate>Sign in to Nested App Store</Translate></h2>
            <p><Translate>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit,
              sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
              Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip
              ex ea commodo consequat. suscipit lobortis nisl ut aliquip ex ea commodo consequat.
            </Translate></p>
            <button className="butn butn-primary secondary full-width" type="submit" onClick={this.signInWithNested}>
            <img src="/public/assets/icons/Nested_Logo.svg" height="24" alt="Nested"/> Sign in with Nested
            </button>
            <div className="seperator"><Translate>Or</Translate></div>
            <form onSubmit={this.submitLoginForm}>
              <input type="text" placeholder={this.translator._getText('Username')}
                    onChange={this.bindInputToModel.bind(this, 'username')} value={this.state.signin.username}/>
              <input type="text" placeholder={this.translator._getText('Password')}
                    onChange={this.bindInputToModel.bind(this, 'password')} value={this.state.signin.password}/>
              <button className="butn butn-store-login full-width" type="submit" disabled={!validateForm}>
                <Translate>Sign in</Translate>
              </button>
            </form>
          </div>
        </Modal>
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

/**
 * reducer actions functions mapper
 * @param {any} dispatch reducer dispacther
 * @returns reducer actions object
 */
const mapDispatchToProps = (dispatch) => {
  return {
    setLogin: (user: IUser) => {
      dispatch(login(user));
    },
    setLogout: () => {
      dispatch(logout());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Container);

export {
  Main, AppView, AdminAddApp, Browse, AdminWrapper, AdminAddCategory,
  AdminPermission, AdminApp, AdminUsers,
};
