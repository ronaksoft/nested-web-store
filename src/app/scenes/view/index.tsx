import * as React from 'react';
import {Translate, Rating, Tab, RateResult, ProperLanguage} from 'components';
import {IApplication, IReview} from 'api/interfaces';
import Const from 'api/consts/CServer';
import {message} from 'antd';
import {app as AppFactory, review as ReviewFactory} from 'api';

interface IProps {
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
  appId: string;
  app: IApplication;
  reviews: IReview[];
}

class AppView extends React.Component<IProps, IState> {
  private translator: Translate;
  private appFactory: AppFactory;
  private reviewFactory: ReviewFactory;

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
      stared: false,
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
      };
      initData.__INITIAL_DATA__ = {};
    } else {
      this.state = {
        app: this.props.model || emptyModel,
        appId: this.props.routeParams ? this.props.routeParams.appid : '',
        reviews: [],
      };
    }
    this.translator = new Translate();
    this.appFactory = new AppFactory();
    this.reviewFactory = new ReviewFactory();
  }

  public componentWillReceiveProps(newProps: IProps) {
    if (this.props.preview) {
      this.setState({
        app: newProps.model,
      });
    }
  }

  public componentDidMount() {
    if (!this.props.preview) {
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
    this.setState({
      reviews: [review, ...this.state.reviews],
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
    const tabs = {};
    tabs[this.translator._getText('App info')] = <ProperLanguage model={this.state.app} property="desc" html={true}/>;
    tabs[this.translator._getText('Pictures')] = (
      <div className="pictures">
        {
          this.state.app.screenshots.map((screenshot, index) => {
            return (
              <img key={index} src={(screenshot.tmp ? '' : Const.SERVER_URL) + screenshot.path} alt={screenshot.name}/>
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
                <img src={Const.SERVER_URL + permission.icon} alt={permission.name}/>
              </div>
              <div className="per-info">
                <h4><ProperLanguage model={permission} property="name"/></h4>
                <p><ProperLanguage model={permission} property="desc"/></p>
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
          <ul className="reviews">
            {this.state.reviews.map((review, index) => {
              return (
                <li key={'review-' + index}>
                  <div className="rev-logo">
                    <img src="" alt=""/>
                  </div>
                  <div className="rev-info">
                    <h4>
                      {review.created_by_name}
                      <RateResult rate={review.rate} silver={true}/>
                    </h4>
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
                <img src={Const.SERVER_URL + this.state.app.logo.path} alt={this.state.app.app_id}/>
              )}
              {!this.state.app.logo && (
                <img src="/public/assets/icons/Nested_Logo.svg" alt={this.state.app.app_id}/>
              )}
              <button className="butn butn-primary full-width"><Translate>Install App</Translate></button>
              <a href="" className="report-butn"><Translate>Report this app</Translate></a>
              <div className="product-her-block categories">
                <h4><Translate>Categories</Translate>:</h4>
                {this.state.app.categories.map((category, index) => {
                  return (
                    <a key={'category-' + index} href={category.slug}>
                      <ProperLanguage model={category} property="name"/>
                    </a>
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
      </div>
    );
  }
}

export default AppView;
