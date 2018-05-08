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
import {IUser} from 'api/interfaces';
import * as Cookies from 'cookies-js';

import {Translate} from 'components';
import {reactTranslateChangeLanguage} from 'components/';
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
            <div className="navbar admin">
              <Link to="/">
                <img src="/public/assets/icons/Nested_Logo.svg" height={32} alt="Nested" className="logo"/>
                <img src="/public/assets/icons/Nested_EnglishType.svg" height={32} alt="Nested"
                  className="logo-type"/>
                <img src="/public/assets/icons/Nested_PersianType.svg" height={32} alt="Nested"
                  className="logo-type fa"/>
              </Link>
              <div className="devider"/>
              <Link to="/">
                <Translate>Add an App</Translate>
              </Link>
              <div className="filler"/>
              <div className="user-wrapper"/>
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

export default connect(mapStateToProps, mapDispatchToProps)(AdminWrapper);
