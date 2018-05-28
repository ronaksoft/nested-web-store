import * as React from 'react';
import {Link} from 'react-router';
import {Translate, IcoN, Affixer, RateResult} from 'components';
import {message, Popconfirm} from 'antd';
import {IReview} from 'api/interfaces';
import * as _ from 'lodash';
import TimeUntiles from 'services/utils/time';
import {
  review as ReviewFactory,
} from 'api';
import Const from 'api/consts/CServer';
import CReviewStatus from 'api/consts/CReviewStatus';

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
  private selectedIds: any[] = [];

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
    this.reviewFactory
      .adminSearch(this.state.keyword, this.pagination.skip, this.pagination.limit)
      .then((data) => {
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

  private loadReviewsDebounced = _.debounce(this.loadReviews, 512);

  public componentDidMount() {
    this.loadReviews();
  }

  private onRemove = (id) => {
    const reviews = this.state.reviews;
    const index = _.findIndex(reviews, {_id: id});
    if (index > -1) {
      this.reviewFactory.remove(id).then(() => {
        reviews.splice(index, 1);
        this.setState({
          reviews,
        });
        message.success(this.translator._getText('Review successfully removed'));
      }).catch(() => {
        message.error(this.translator._getText('Can\'t remove the review'));
      });
    }
  }

  private onConfirm = (id) => {
    const reviews = this.state.reviews;
    const index = _.findIndex(reviews, {_id: id});
    if (index > -1) {
      this.reviewFactory.setStatus(id, CReviewStatus.CONFIRMED).then(() => {
        reviews[index].status = CReviewStatus.CONFIRMED;
        this.setState({
          reviews,
        });
        message.success(this.translator._getText('Review successfully confirmed'));
      }).catch(() => {
        message.error(this.translator._getText('Can\'t confirm the review'));
      });
    }
  }

  private removeAll = () => {
    this.reviewFactory.removeAll(this.selectedIds).then(() => {
      const reviews = this.state.reviews;
      this.selectedIds.forEach((id) => {
        const index = _.findIndex(reviews, {_id: id});
        if (index > -1) {
          reviews.splice(index, 1);
        }
      });
      this.setState({
        reviews,
      });
      message.success(this.translator._getText('Reviews successfully removed'));
    }).catch(() => {
      message.error(this.translator._getText('Can\'t remove the reviews'));
    });
  }

  private confirmAll = () => {
    this.reviewFactory.setStatusAll(this.selectedIds, CReviewStatus.CONFIRMED).then(() => {
      const reviews = this.state.reviews;
      this.selectedIds.forEach((id) => {
        const index = _.findIndex(reviews, {_id: id});
        if (index > -1) {
          reviews[index].status = CReviewStatus.CONFIRMED;
        }
      });
      this.setState({
        reviews,
      });
      message.success(this.translator._getText('Reviews successfully confirmed'));
    }).catch(() => {
      message.error(this.translator._getText('Can\'t confirm the reviews'));
    });
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
    this.loadReviewsDebounced();
  }

  private submitReply = () => {
    const id = this.state.replyId;
    const body = this.textarea.value;
    const reviews = this.state.reviews;
    const index = _.findIndex(reviews, {_id: id});
    if (index > -1) {
      this.reviewFactory.reply(id, body).then(() => {
        reviews[index].response = body;
        reviews[index].response_at = new Date().getTime();
        this.setState({
          reviews,
        });
        message.success(this.translator._getText('Reply successfully sent!'));
      }).catch(() => {
        message.error(this.translator._getText('Can\'t reply to the review'));
      });
    }
  }

  private replyTextareaRefHandler = (element) => {
    this.textarea = element;
  }

  private checkboxChange = (review, event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    if (value) {
      this.selectedIds.push(review._id);
      event.target.parentNode.className = 'selected';
    } else {
      const index = this.selectedIds.indexOf(review._id);
      this.selectedIds.splice(index, 1);
      event.target.parentNode.className = '';
    }
    if (this.selectedIds.length < 2) {
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
              {this.selectedIds.length > 0 && (
                <div className="_df">
                  <Popconfirm title={this.translator._getText('Are you sure about removing these Reviews?')}
                              onConfirm={this.removeAll}
                              okText="Yes" cancelText="No">
                    <div className="remove-button">
                      <IcoN name="xcrossRed24" size={24}/>
                    </div>
                  </Popconfirm>
                  <Popconfirm title={this.translator._getText('Are you sure about confirming these Reviews?')}
                              onConfirm={this.confirmAll}
                              okText="Yes" cancelText="No">
                    <div className="accept-button">
                      <IcoN name="heavyCheck24" size={24}/>
                    </div>
                  </Popconfirm>
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
                    {!review.response && (
                      <div className="reply-button" onClick={this.reply.bind(this, review._id)}>
                        <IcoN name="reply24" size={24}/>
                      </div>
                    )}
                    <Popconfirm title={this.translator._getText('Are you sure about removing this Review?')}
                                onConfirm={this.onRemove.bind(this, review._id)}
                                okText="Yes" cancelText="No">
                      <div className="remove-button">
                        <IcoN name="xcross24" size={24}/>
                      </div>
                    </Popconfirm>
                    <div className="accept-button" onClick={this.onConfirm.bind(this, review._id)}>
                      <IcoN name="heavyCheck24" size={24}/>
                    </div>
                  </div>
                  <Link to={'/admin/app/' + review.app_id}>
                    <strong>{review.app_id}</strong>
                  </Link>
                  <p>{review.body}</p>
                  {review.response &&
                    <p className="response"><Translate>Reply by admin:</Translate>: {review.response}</p>
                  }
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
