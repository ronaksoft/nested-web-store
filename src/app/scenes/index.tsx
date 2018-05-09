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
import AdminAddApp from './admin/app/add';
import AdminAddCategory from './admin/category';
import AdminPermissions from './admin/permissions';
import AdminWrapper from './admin/';
import {IUser} from 'api/interfaces';
import * as Cookies from 'cookies-js';
import {Translate} from 'components';
import {reactTranslateChangeLanguage} from 'components/';
import Const from './../api/consts/CServer';
import axios from 'axios';
import {message} from 'antd';

interface IState {
  isLogin: boolean;
  user: any[];
  lang: string;
}

interface IProps {
  isLogin: boolean;
  user: IUser;
  params: string;
  setLogin: (user: IUser) => {};
  setLogout: () => {};
}

class Container extends React.Component<IProps, IState> {

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
        user: initData.__INITIAL_DATA__.user || [],
        lang: initData.__INITIAL_DATA__.locale || Cookies.get('locale') || 'en', // from browser
      };
    } else {
      this.state = {
        isLogin: false,
        user: [],
        lang: 'en',
      };
    }
  }

  public componentDidMount() {
    reactTranslateChangeLanguage(this.state.lang);
  }

  public signIn = () => {
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

  /**
   * renders the component if the credentials are valid
   * @returns {ReactElement} markup
   * @memberof Private
   * @override
   * @generator
   */
  public render() {
    return (
      <div>
        <nav className="navbar-wrapper">
          <div className="navbar">
            <img src="/public/assets/icons/Nested_LogoNegative.svg" height="32" alt="Nested" className="logo"/>
            <img src="/public/assets/icons/Nested_EnglishTypeNegative.svg" height="32" alt="Nested"
                 className="logo-type"/>
            <img src="/public/assets/icons/Nested_PersianTypeNegative.svg" height="32" alt="Nested"
                 className="logo-type fa"/>
            <div className="devider"/>
            <Link to="/">
              <Translate>App Store</Translate>
            </Link>
            <div className="filler"/>
            <Link to="/apps"><Translate>Browse</Translate></Link>
            <button className="butn" onClick={this.signIn}><Translate>Sign in</Translate></button>
          </div>
        </nav>
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
              <Link to={'/admin/app/add'}>admin</Link>
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
  Main, AppView, AdminAddApp, Browse, AdminWrapper, AdminAddCategory, AdminPermissions,
};
