import * as React from 'react';
import {Translate, IcoN, Affixer, RateResult} from 'components';
import {message, Popconfirm} from 'antd';
import {IReview} from 'api/interfaces';
import {debounce} from 'lodash';
import TimeUntiles from 'services/utils/time';
import {
  review as ReviewFactory,
} from 'api';
import Const from '../../../api/consts/CServer';

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
  reviews: IReview[];
  untouched: boolean;
  pageCount: number;
  keyword: string;
  replyId: string;
}

class AdminReview extends React.Component<IProps, IState> {
  private translator: Translate;
  private reviewFactory: ReviewFactory;
  private pagination: any;
  private textarea: any;
  private selecteds: any[] = [];

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
      reviews: [],
      replyId: '',
      keyword: '',
      pageCount: 1,
    };
    this.reviewFactory = new ReviewFactory();
    this.pagination = {
      skip: 0,
      limit: 10,
    };
  }

  private loadReviews = () => {
    this.reviewFactory.getAll('_formbuilder', this.pagination.skip, this.pagination.limit).then((data) => {
      if (data.reviews === null) {
        this.setState({
          reviews: [],
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
        reviews: data.reviews,
        pageCount: Math.floor(data.count / this.pagination.limit) + 1,
      });
    }).catch(() => {
      message.error(this.translator._getText('Can\'t fetch reviews!'));
    });
  }
  private loadReviewssDebounced = debounce(this.loadReviews, 512);

  public componentDidMount() {
    this.loadReviews();
  }

  private onRemove = (id) => {
    console.log(id);
  }

  private removeAll = () => {
    console.log(this.selecteds);
  }

  private reply = (replyId) => {
    this.setState({replyId});
  }

  private changeSearch = (event) => {
    this.setState({keyword: event.target.value});
    this.pagination = {
      skip: 0,
      limit: 10,
    };
    this.loadReviewssDebounced();
  }

  private submitReply = () => {
    console.log('submit reply', this.textarea.value);
  }

  private replyTextareaRefHandler = (element) => {
    this.textarea = element;
  }

  private checkboxChange = (review, event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    if (value) {
      this.selecteds.push(review._id);
      event.target.parentNode.className = 'selected';
    } else {
      const index = this.selecteds.indexOf(review._id);
      this.selecteds.splice(index, 1);
      event.target.parentNode.className = '';
    }
    if (this.selecteds.length < 2) {
      this.forceUpdate();
    }
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
              <h2><Translate>Reviews</Translate></h2>
              {this.selecteds.length > 0 && (
                <div className="_df">
                  <Popconfirm title={this.translator._getText('Are you sure about removing this Review?')}
                              onConfirm={this.removeAll}
                              okText="Yes" cancelText="No">
                    <div className="remove-button">
                      <IcoN name="xcrossRed24" size={24}/>
                    </div>
                  </Popconfirm>
                  <div className="accept-button">
                    <IcoN name="heavyCheck24" size={24} />
                  </div>
                </div>
              )}
            </div>
          </Affixer>
          <Affixer offsetTop={136} zIndex={4} height={48}>
            <div className="search-list">
              <IcoN name="search24" size={24}/>
              <input type="text" onChange={this.changeSearch}
                    placeholder={this.translator._getText('Search in reviews...')}/>
            </div>
          </Affixer>
          <ul className="reviews-list admin-list manage-review-list">
            {this.state.reviews.map((review) => (
              <li key={review._id}>
                <div className="rev-logo">
                  {!review.user.picture &&
                  <img src="/public/assets/icons/absents_place.svg" alt=""/>}
                  {review.user.picture &&
                  <img
                    src={review.user.picture.indexOf('http') > -1 ? review.user.picture :
                      Const.SERVER_URL + review.user.picture}
                    alt=""/>}
                </div>
                <div className="rev-info">
                  <div className="_df">
                    <h4>
                      {review.created_by_name}
                      <RateResult rate={review.rate} silver={true}/>
                      <time className="openSans">{TimeUntiles.dynamic(review.created_at)}</time>
                    </h4>
                    <div className="reply-button" onClick={this.reply.bind(this, review._id)}>
                      <IcoN name="reply24" size={24}/>
                    </div>
                    <Popconfirm title={this.translator._getText('Are you sure about removing this Review?')}
                                onConfirm={this.onRemove.bind(this, review._id)}
                                okText="Yes" cancelText="No">
                      <div className="remove-button">
                        <IcoN name="xcross24" size={24}/>
                      </div>
                    </Popconfirm>
                    <div className="accept-button">
                      <IcoN name="heavyCheck24" size={24} />
                    </div>
                  </div>
                  <strong>Google Play Music</strong>
                  <p>{review.body}</p>
                  {this.state.replyId === review._id && (
                    <div className="rev-reply">
                      <textarea className="with-border" placeholder={this.translator._getText('Reply to comment...')}
                        ref={this.replyTextareaRefHandler}/>
                      <div className="_df">
                        <button className="butn" onClick={this.reply.bind(this, '')}>
                          <Translate>Cancel</Translate>
                        </button>
                        <button className="butn butn-blue" onClick={this.submitReply}>
                          <Translate>Submit</Translate>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <input type="checkbox" onChange={this.checkboxChange.bind(this, review)}/>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default AdminReview;
