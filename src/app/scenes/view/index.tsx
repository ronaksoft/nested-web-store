import * as React from 'react';
import {connect} from 'react-redux';
import {Translate, Rating, Tab, RateResult, ProperLanguage} from 'components';
import {IApplication, IReport, IReview, IUser} from 'api/interfaces';
import {Link} from 'react-router';
import {Config, Const} from 'api/consts/CServer';
import {message, Modal} from 'antd';
import TimeUntiles from 'services/utils/time';
import {
  app as AppFactory,
  review as ReviewFactory,
  report as ReportFactory,
} from 'api';
import CPurchaseStatus from 'api/consts/CPurchaseStatus';
import NestedService from 'services/nested';

interface IOwnProps {
  app: string;
  preview?: boolean;
  model?: IApplication;
  routeParams?: any;
  location?: any;
}

interface IProps {
  user?: IUser;
  app: string;
  /**
   * @prop preview
   * @desc preview mode of app
   * @type {*}
   * @memberof IOwnProps
   */
  preview?: boolean;
  /**
   * @prop previewModel
   * @desc preview model of app
   * @type {*}
   * @memberof IOwnProps
   */
  model?: IApplication;
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
  user?: IUser;
  appId: string;
  reportModal: boolean;
  authorizeModal: boolean;
  app: IApplication;
  reviews: IReview[];
  installed: boolean;
  hasAccess: boolean;
  reportSelectedOption: number;
  reportTextareaValue: string;
}

class AppView extends React.Component<IProps, IState> {
  private translator: Translate;
  private appFactory: AppFactory;
  private reviewFactory: ReviewFactory;
  private reportFactory: ReportFactory;
  private nestedService: NestedService;
  private reportReasons: any[];
  private requireAdditionalComment: boolean = false;

  /**
   * @constructor
   * Creates an instance of Sidebar.
   * @param {any} props
   * @memberof AppView
   */
  constructor(props: any) {
    super(props);
    const emptyModel: IApplication = {
      _id: '',
      app_id: '',
      logo: null,
      name: '',
      desc: '',
      summary: '',
      screenshots: [],
      website: '',
      categories: [],
      translations: [/*{
        locale: 'fa',
        name: '',
        desc: '',
      }*/],
      permissions: [],
      official: false,
      starred: false,
      status: 0,
      lang: [],
    };
    let initData: any;
    if (typeof window !== 'undefined') {
      initData = window;
    }
    if (initData) {
      this.state = {
        app: initData.__INITIAL_DATA__.app || this.props.model || emptyModel,
        appId: this.props.routeParams ? this.props.routeParams.appid : '',
        reviews: [],
        reportModal: false,
        authorizeModal: false,
        installed: false,
        user: props.user,
        hasAccess: false,
        reportTextareaValue: '',
        reportSelectedOption: -1,
      };
      initData.__INITIAL_DATA__ = {};
    } else {
      this.state = {
        app: this.props.model || emptyModel,
        appId: this.props.routeParams ? this.props.routeParams.appid : '',
        reviews: [],
        reportModal: false,
        authorizeModal: false,
        installed: false,
        user: props.user,
        hasAccess: false,
        reportTextareaValue: '',
        reportSelectedOption: -1,
      };
    }
    this.translator = new Translate();
    this.appFactory = new AppFactory();
    this.reviewFactory = new ReviewFactory();
    this.reportFactory = new ReportFactory();
    this.nestedService = new NestedService(this.state.user);
  }

  public componentWillReceiveProps(newProps: IProps) {
    if (this.props.preview) {
      this.setState({
        app: newProps.model,
      });
    } else {
      this.setState({
        user: newProps.user,
        hasAccess: (newProps.user ? newProps.user.nested_admin : false),
      }, () => {
        if (this.state.user && this.state.user._id.length === 24) {
          this.nestedService.setUser(this.state.user);
        }
      });
    }
  }

  public componentDidMount() {
    if (!this.props.preview) {
      if (this.state.app._id.length !== 24) {
        this.appFactory.get(this.state.appId).then((data) => {
          if (data === null) {
            return;
          }
          this.setState({
            app: data,
          });
        }).catch(() => {
          message.error(this.translator._getText('Can\'t fetch app!'));
        });
      }
      this.appFactory.getAppPurchaseStatus(this.state.appId).then((data) => {
        if (data === CPurchaseStatus.INSTALL) {
          this.setState({
            installed: true,
          });
        } else {
          this.setState({
            installed: false,
          });
        }
      }).catch((err) => {
        console.log(err);
      });
      this.reviewFactory.getAll(this.state.appId).then((data) => {
        if (data.reviews === null) {
          return;
        }
        this.setState({
          reviews: data.reviews,
        });
      }).catch(() => {
        message.error(this.translator._getText('Can\'t fetch app\'s reviews!'));
      });
      this.setState({
        hasAccess: (this.state.user ? this.state.user.nested_admin : false),
      }, () => {
        if (this.state.user && this.state.user._id.length === 24) {
          this.nestedService.setUser(this.state.user);
        }
      });
    }
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

  private reviewHandler = (review: IReview) => {
    review.user = this.state.user;
    this.setState({
      reviews: [review, ...this.state.reviews],
    });
  }

  private toggleAuthorizeModal = () => {
    this.setState({
      authorizeModal: !this.state.authorizeModal,
    });
  }

  private toggleReportApp = () => {
    this.setState({
      reportModal: !this.state.reportModal,
    });
  }

  private onAppInstall = () => {
    const appMessageLoading = message.loading(
      this.translator
        ._getText('Installing "{0}", be patient')
        .replace('{0}', this.state.app.name), 10000);
    this.nestedService.http('app/register', {
      app_id: this.state.app.app_id,
      app_name: this.state.app.name,
      homepage: this.state.app.website,
      developer: this.state.app.created_by_name,
      icon_large_url: Config().SERVER_URL + this.state.app.logo.path,
      icon_small_url: Config().SERVER_URL + this.state.app.logo.path,
    }).then(() => {
      this.installApp();
      appMessageLoading();
    }).catch((err) => {
      if (err.err_code === 5) {
        this.installApp();
      }
      appMessageLoading();
    });
  }

  private onAppUninstall = () => {
    const appMessageLoading = message.loading(
      this.translator
        ._getText('Uninstalling "{0}", be patient')
        .replace('{0}', this.state.app.name), 10000);
    this.nestedService.http('app/remove', {
      app_id: this.state.app.app_id,
    }).then(() => {
      this.uninstallApp();
      appMessageLoading();
    }).catch((err) => {
      if (err.err_code === 3) {
        this.uninstallApp();
      }
      appMessageLoading();
    });
  }

  private installApp() {
    this.appFactory.installApp(this.state.appId).then((data) => {
      this.setState({
        installed: (data.status === CPurchaseStatus.INSTALL),
        authorizeModal: false,
      });
      message.success(
        this.translator
          ._getText('"{0}" successfully installed')
          .replace('{0}', this.state.app.name));
    }).catch((err) => {
      if (err.code === Const.PERMISSION_DENIED) {
        message.error(this.translator._getText('You don\'t have permission to install the app'));
      } else {
        message.error(this.translator._getText('Can\'t install the app!'));
      }
    });
  }

  private uninstallApp() {
    this.appFactory.uninstallApp(this.state.appId).then((data) => {
      this.setState({
        installed: !(data.status === CPurchaseStatus.UNINSTALL),
        authorizeModal: false,
      });
      message.success(
        this.translator
          ._getText('"{0}" successfully uninstalled')
          .replace('{0}', this.state.app.name));
    }).catch((err) => {
      if (err.code === Const.PERMISSION_DENIED) {
        message.error(this.translator._getText('You don\'t have permission to uninstall the app'));
      } else {
        message.error(this.translator._getText('Can\'t uninstall the app!'));
      }
    });
  }

  private handleReasonOptionChange = (reportSelectedOption) => {
    this.setState({
      reportSelectedOption,
    });
    this.requireAdditionalComment = reportSelectedOption === this.reportReasons.length - 1;
  }

  private changeAppReportTextarea = (event) => {
    this.setState({
      reportTextareaValue: event.target.value,
    });
  }

  private onSendReport = () => {
    const model: IReport = {
      app_id: this.state.appId,
      comment: this.state.reportTextareaValue,
      reason: this.state.reportSelectedOption,
    };
    this.reportFactory.create(model).then(() => {
      this.setState({
        reportModal: false,
        reportSelectedOption: -1,
        reportTextareaValue: '',
      });
      message.success(this.translator._getText('Report successfully sent'));
    }).catch(() => {
      message.error(this.translator._getText('Can\'t send report!'));
    });
  }

  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof AppView
   * @override
   * @generator
   */
  public render() {
    this.reportReasons = [
      {id: 1, text: this.translator._getText('Has inappropriate content')},
      {id: 2, text: this.translator._getText('Is against Nested Community Laws')},
      {id: 3, text: this.translator._getText('Has so many bugs in it')},
      {id: 4, text: this.translator._getText('Violated the copyright')},
      {id: 5, text: this.translator._getText('Other')},
    ];
    const tabs = {};
    tabs[this.translator._getText('App info')] = (
      <div className="openSans"><ProperLanguage model={this.state.app} property="desc" html={true}/></div>
    );
    tabs[this.translator._getText('Pictures')] = (
      <div className="pictures">
        {
          this.state.app.screenshots.map((screenshot, index) => {
            return (
              <img key={index} src={(screenshot.tmp ? '' : Config().SERVER_URL) + screenshot.path}
                   alt={screenshot.name}/>
            );
          })
        }
      </div>
    );
    tabs[this.translator._getText('Permissions')] = (
      <div>
        <ul className="permissions-list">
          {this.state.app.permissions.map((permission, index) => (
            <li key={'permission-' + index}>
              <div className="per-icon">
                <img src={Config().SERVER_URL + permission.icon} alt={permission.name} width="24" height="24"/>
              </div>
              <div className="per-info">
                <h4><ProperLanguage model={permission} property="name"/></h4>
                <p className="openSans"><ProperLanguage model={permission} property="desc"/></p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
    if (!this.props.preview) {
      tabs[this.translator._getText('Reviews')] = (
        <div>
          <Rating appId={this.state.appId} submitted={this.reviewHandler}/>
          <ul className="reviews-list">
            {this.state.reviews.map((review, index) => {
              return (
                <li key={'review-' + index}>
                  <div className="rev-logo">
                    {!review.user.picture &&
                    <img src={'/public/assets/icons/absents_place.svg'} alt=""/>}
                    {review.user.picture &&
                    <img
                      src={review.user.picture.indexOf('http') > -1 ? review.user.picture :
                        Config().SERVER_URL + review.user.picture}
                      alt=""/>}
                  </div>
                  <div className="rev-info">
                    <div className="_df">
                      <h4>
                        {review.created_by_name}
                        <RateResult rate={review.rate} silver={true}/>
                      </h4>
                      <time className="openSans">{TimeUntiles.dynamic(review.created_at)}</time>
                    </div>
                    <p>{review.body}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      );
    }
    return (
      <div className="main-container">
        <div className="main-container-inner vertical">
          <div className="app-content">
            <div className="product-hero">
              {this.state.app.logo && (
                <img src={Config().SERVER_URL + this.state.app.logo.path} alt={this.state.app.app_id}/>
              )}
              {!this.state.app.logo && (
                <img src="/public/assets/icons/Nested_Logo.svg" alt={this.state.app.app_id}/>
              )}
              <button className="butn butn-primary full-width" onClick={this.toggleAuthorizeModal}
                      disabled={(this.state.hasAccess !== true)}>
                {!this.state.installed &&
                <Translate>Install App</Translate>}
                {this.state.installed &&
                <Translate>Uninstall App</Translate>}
              </button>
              <a onClick={this.toggleReportApp} className="report-butn"><Translate>Report this app</Translate></a>
              <div className="product-her-block categories">
                <h4><Translate>Categories</Translate>:</h4>
                {this.state.app.categories.map((category, index) => {
                  return (
                    <Link key={'category-' + index} to={'/apps/' + category.slug}>
                      <ProperLanguage model={category} property="name"/>
                    </Link>
                  );
                })}
              </div>
              <div className="product-her-block languages">
                <h4><Translate>Languages Support</Translate>:</h4>
                {this.state.app.lang.indexOf('en') > -1 &&
                <a className="en"><Translate>English</Translate></a>}
                {this.state.app.lang.indexOf('en') > -1 &&
                <a className="fa"><Translate>Persian</Translate></a>}
              </div>
            </div>
            <div className="product-info">
              <h1><ProperLanguage model={this.state.app} property="name"/></h1>
              <RateResult rate={4.2}/>
              <Tab items={tabs}/>
            </div>
          </div>
          {/*{!this.props.preview && (
            <AppList title={<Translate>Similar apps</Translate>} haveMore={false} items={[{
              name: 'Google Assisstant',
              category: 'Social & Fun',
            }]} mode="mini"/>
          )}*/}
        </div>
        <Modal
          wrapClassName="vertical-center-modal"
          className="authorize-modal"
          width="360px"
          visible={this.state.authorizeModal}
          onCancel={this.toggleAuthorizeModal}
          maskClosable={true}
        >
          {this.state.app.logo && (
            <div className="app-snippet">
              <img src={Config().SERVER_URL + this.state.app.logo.path} alt={this.state.app.app_id}/>
              <div className="_df _fw">
                <b><ProperLanguage model={this.state.app} property="name"/></b>
                <span>{this.state.app.app_id}</span>
              </div>
            </div>
          )}
          <h3><Translate>Wants to access:</Translate></h3>
          <ul className="permissions-list">
            {this.state.app.permissions.map((permission) => (
              <li key={permission._id}>
                <div className="per-info">
                  <div className="_df">
                    <img src={Config().SERVER_URL + permission.icon} alt={permission.name} width="24" height="24"/>
                    <h4><ProperLanguage model={permission} property="name"/></h4>
                  </div>
                  <p><ProperLanguage model={permission} property="desc"/></p>
                </div>
              </li>
            ))}
          </ul>
          <div className="modal-buttons">
            {!this.state.installed &&
            <button className="butn butn-primary full-width" onClick={this.onAppInstall}>
              <Translate>Authorize</Translate>
            </button>}
            {this.state.installed &&
            <button className="butn butn-primary full-width" onClick={this.onAppUninstall}>
              <Translate>Uninstall</Translate>
            </button>}
            <button className="butn full-width" onClick={this.toggleAuthorizeModal}>
              <Translate>Cancel</Translate>
            </button>
          </div>
        </Modal>
        <Modal
          wrapClassName="vertical-center-modal"
          className="report-modal"
          width="360px"
          visible={this.state.reportModal}
          onCancel={this.toggleReportApp}
          maskClosable={true}
        >
          <h3><Translate>Report this application</Translate></h3>
          <p>
            <Translate>
              If you think this application is against our violence policy and should be reported,
              please let us know why simply by explaining the cause.
            </Translate>
          </p>
          <ul className="reasons-for-report">
            {this.reportReasons.map((reason, index) => (
              <li key={index}>
                <input type="radio" name="report-option" value={reason.id} id={'report-' + index}
                       onChange={this.handleReasonOptionChange.bind(this, reason.id)}/>
                <label htmlFor={'report-' + index}>{reason.text}</label>
              </li>
            ))}
          </ul>
          <p>
            <Translate>
              If you have any additional comment that will help us improve our community and apps,
              please write down below
            </Translate>
          </p>
          <textarea placeholder={this.translator._getText('Additional comment (optional)...')}
                    onChange={this.changeAppReportTextarea} value={this.state.reportTextareaValue}/>
          <div className="modal-buttons">
            <button className="butn butn-red full-width" onClick={this.onSendReport}
                    disabled={
                      (this.requireAdditionalComment && this.state.reportTextareaValue.length === 0) ||
                      this.state.reportSelectedOption < 0
                    }>
              <Translate>Send Report</Translate>
            </button>
            <button className="butn full-width" onClick={this.toggleReportApp}>
              <Translate>Cancel</Translate>
            </button>
          </div>
        </Modal>
      </div>
    );
  }
}

/**
 * redux store mapper
 * @param {any} store store
 * @param {IOwnProps} props
 * @returns store item object
 */
const mapStateToProps = (store, props: IOwnProps): IProps => ({
  user: store.app.user,
  app: props.app,
  preview: props.preview,
  model: props.model,
  routeParams: props.routeParams,
  location: props.location,
});

export default connect(mapStateToProps, {})(AppView);
