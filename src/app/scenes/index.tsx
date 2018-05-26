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
import {user as UserFactory} from 'api';
import * as Cookies from 'cookies-js';
import {Translate, IcoN, reactTranslateChangeLanguage} from 'components';
import Const from './../api/consts/CServer';
import axios from 'axios';
import {message, Modal, Popover} from 'antd';
import browserHistory from 'react-router/lib/browserHistory';

interface IState {
  isLogin: boolean;
  isAdminPage: boolean;
  openSignInModal: boolean;
  user: any;
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
  private userFactory: UserFactory;
  private filterbar: any;

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
      let user = initData.__INITIAL_DATA__.user;
      if (user && user._id.length !== 24) {
        user = null;
      }
      this.state = {
        isLogin: false,
        isAdminPage: false,
        signin: {
          username: '',
          password: '',
        },
        openSignInModal: false,
        user: user || null,
        lang: initData.__INITIAL_DATA__.locale || Cookies.get('locale') || 'en', // from browser
      };
      this.props.setLogin(this.state.user);
    } else {
      this.state = {
        isLogin: false,
        isAdminPage: false,
        signin: {
          username: '',
          password: '',
        },
        openSignInModal: false,
        user: {},
        lang: 'en',
      };
    }
    this.userFactory = new UserFactory();
  }

  public componentDidMount() {
    reactTranslateChangeLanguage(this.state.lang);
    this.checkIsAdmin(this.props.location.pathname);
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

  public checkIsAdmin = (path: string) => {
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
    this.checkIsAdmin(props.location.pathname);
  }

  private refHandler = (element) => {
    this.filterbar = element;
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
            }).then((userResponse) => {
              if (userResponse.data.status !== 'nok') {
                this.props.setLogin(userResponse.data.data);
                this.setState({
                  user: userResponse.data.data,
                  openSignInModal: false,
                });
              }
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

  private signOut = () => {
    this.userFactory.logout().then(() => {
      this.setState({
        user: null,
      });
      this.props.setLogout();
      browserHistory.push('/');
    });
  }

  private getPopupContainer = () => this.filterbar;

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
        <div className="navbar-wrapper">
          <div className={isAdminPage ? 'navbar-container admin' : 'navbar-container'}>
            {!isAdminPage && (
                <div className="navbar">
                  <Link to="/">
                    <img src="/public/assets/icons/App_StoreNegative_32.svg" height="32" alt="Nested" className="logo"/>
                    <img src="/public/assets/icons/Nested_EnglishTypeNegative.svg" height="32" alt="Nested"
                        className="logo-type"/>
                    <img src="/public/assets/icons/Nested_PersianTypeNegative.svg" height="32" alt="Nested"
                        className="logo-type fa"/>
                  </Link>
                  <div className="devider"/>
                  <Link to="/">
                    <Translate>App Store</Translate>
                  </Link>
                  <div className="filler"/>
                  <Link to="/apps"><Translate>Browse</Translate></Link>
                  {this.state.user === null &&
                  <button className="butn" onClick={this.toggleSignInModal}><Translate>Sign in</Translate></button>}
                  {this.state.user !== null &&
                  <div className="user-avatar">
                    <Popover placement="bottomRight" trigger="click" content={(
                      <div className="profile-popover">
                        <div className="_df">
                          <div className="user-avatar">
                            <img src={this.state.user.picture} title={this.state.user.name}/>
                          </div>
                          <div>
                            <b>{this.state.user.name}</b>
                            <span>{this.state.user.username}</span>
                          </div>
                        </div>
                        <Link to="/admin/app"><Translate>Dashboard Panel</Translate></Link>
                        <a className="signout" onClick={this.signOut}>
                          <IcoN name="exit16" size={16}/>
                          <Translate>Sign out</Translate>
                        </a>
                      </div>
                    )} overlayClassName="popover-no-padding">
                      <img src={this.state.user.picture} title={this.state.user.name}/>
                    </Popover>
                  </div>}
                </div>
            )}
            {isAdminPage && (
              <div className="navbar">
                <Link to="/">
                  <img src="/public/assets/icons/App_Store_32.svg" height={32} alt="Nested" className="logo"/>
                  <img src="/public/assets/icons/Nested_EnglishTypeSolidAppStore.svg" height={32} alt="Nested"
                    className="logo-type"/>
                  <img src="/public/assets/icons/Nested_PersianTypeSolidAppStore.svg" height={32} alt="Nested"
                    className="logo-type fa"/>
                </Link>
                <div className="devider"/>
                <Link to="/admin/app/create">
                  <Translate>Add an App</Translate>
                </Link>
                <div className="filler"/>
                {this.state.user === null &&
                  <button className="butn" onClick={this.toggleSignInModal}><Translate>Sign in</Translate></button>}
                {this.state.user !== null &&
                <div className="user-avatar" ref={this.refHandler}>
                  <Popover placement="bottomRight" trigger="click" content={(
                    <div className="profile-popover">
                      <div className="_df">
                        <div className="user-avatar">
                          <img src={this.state.user.picture} title={this.state.user.name}/>
                        </div>
                        <div>
                          <b>{this.state.user.name}</b>
                          <span>{this.state.user.username}</span>
                        </div>
                      </div>
                      <Link to="/admin/app"><Translate>Dashboard Panel</Translate></Link>
                      <a className="signout" onClick={this.signOut}>
                        <IcoN name="exit16" size={16}/>
                        <Translate>Sign out</Translate>
                      </a>
                    </div>
                  )} overlayClassName="popover-no-padding" getPopupContainer={this.getPopupContainer}>
                    <img src={this.state.user.picture} title={this.state.user.name}/>
                  </Popover>
                </div>}
              </div>
            )}
          </div>
        </div>
        {this.props.children}
        <footer>
          <div className="footer-inner">
            <div className="_aic">
              <div className="nested">
                <img src="/public/assets/icons/App_StoreNegative.svg" alt="Nested" className="logo"/>
                <div className="app-info-logo">
                  <img src="/public/assets/icons/Nested_EnglishTypeNegative.svg" alt="Nested"
                      className="logo-type"/>
                  <img src="/public/assets/icons/Nested_PersianTypeNegative.svg" alt="Nested"
                      className="logo-type fa"/>
                  <Translate>App Store</Translate>
                </div>
              </div>
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
              <a target="_blank" href="https://nested.me/features/"><Translate>Features</Translate></a>
              <a target="_blank" href="https://play.google.com/store/apps/details?id=me.nested.android.mail">
                <Translate>Get Nested app</Translate>
              </a>
            </div>
            <div>
              <h6><Translate>COMPANY</Translate></h6>
              <a target="_blank" href="https://nested.me/about-us/"><Translate>About us</Translate></a>
              <a target="_blank" href="https://nested.me/press/"><Translate>Press</Translate></a>
              <a target="_blank" href="https://nested.me/jobs/"><Translate>Work with us</Translate></a>
            </div>
            <div>
              <h6><Translate>SUPPORT</Translate></h6>
              <a target="_blank" href="http://help.nested.me/"><Translate>Help center</Translate></a>
              <a target="_blank" href="https://nested.me/feedback/"><Translate>Contact us</Translate></a>
              <a target="_blank" href="https://help.nested.me/terms/index.html">
                <Translate>Terms &amp; Conditions</Translate>
              </a>
              {/* <Link to={'/admin/app/create'}>admin</Link> */}
            </div>
            <div>
              {/* <h6><Translate>SOCIAL NETWORKS</Translate></h6> */}
              <a target="_blank" href="https://nested.me/blog/"><Translate>Blog</Translate></a>
              <a target="_blank" href="http://twitter.com/nestedme"><Translate>Twitter</Translate></a>
              <a target="_blank" href="http://facebook.com/nestedme"><Translate>Facebook</Translate></a>
              <a target="_blank" href="https://www.instagram.com/nestedmail/"><Translate>Instagram</Translate></a>
              <a target="_blank" href="https://www.linkedin.com/company/nested.me"><Translate>LinkedIn</Translate></a>
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
            <IcoN name="appStoreLogo7792" size={7792}/>
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
              <img src="/public/assets/icons/Nested_Logo.svg" height="24" alt="Nested"/>
              <Translate>Sign in with Nested</Translate>
            </button>
            <div className="seperator"><a><Translate>or</Translate></a></div>
            <form onSubmit={this.submitLoginForm}>
              <input type="text" placeholder={this.translator._getText('Username')}
                     onChange={this.bindInputToModel.bind(this, 'username')} value={this.state.signin.username}/>
              <input type="text" placeholder={this.translator._getText('Password')}
                     onChange={this.bindInputToModel.bind(this, 'password')} value={this.state.signin.password}/>
              <button className="butn butn-store-login full-width" type="submit" disabled={validateForm}>
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
