import * as React from 'react';
import {connect} from 'react-redux';
import {Translate, IcoN} from 'components';
import {message, Tooltip} from 'antd';
import {review as ReviewFactory} from '../../api';
import {IReview, IUser} from '../../api/interfaces';
import Const from 'api/consts/CServer';

interface IOwnProps {
  appId: string;
  submitted: (IReview) => void;
}
interface IProps {
  appId: string;
  submitted: (IReview) => void;
  user: IUser;
}

interface IState {
  rate: number;
  user: IUser;
  comment: string;
}

class Rating extends React.Component<IProps, IState> {
  private translator: Translate;
  private reviewFactory: ReviewFactory;

  constructor(props: any) {
    super(props);
    this.state = {
      rate: 0,
      user: this.props.user,
      comment: '',
    };
    this.translator = new Translate();
    // this.translator._getText('Search htmlFor apps...');
    this.reviewFactory = new ReviewFactory();
  }

  private handleOptionChange = (rate: number) => {
    this.setState({
      rate,
    });
  }

  public componentWillReceiveProps(props) {
    this.setState({
      user: props.user,
    });
  }

  public handleChange = (event) => {
    this.setState({comment: event.target.value});
  }

  public submit = () => {
    const model: IReview = {
      body: this.state.comment,
      rate: this.state.rate,
    };
    this.reviewFactory.create(this.props.appId, model).then((data) => {
      message.success(this.translator._getText('Your comment successfully added'));
      this.setState({
        rate: 0,
        comment: '',
      });
      this.props.submitted(data);
    }).catch(() => {
      message.error(this.translator._getText('Can\'t comment!'));
    });
  }

  public render() {
    return (
      <div className={'rating-form' + (this.state.rate === 0 ? ' empty' : '')}>
        {this.state.rate === 0 && <legend><Translate>Submit your rating</Translate></legend>}
        <div className="rate-stars">
          <input id="rating-5" name="rating" type="radio" value="5"
                 onChange={this.handleOptionChange.bind(this, 5)}/>
          <label htmlFor="rating-5" data-value="5">
            <Tooltip title={this.translator._getText('Loved it')} placement="bottom">
              <span className="rating-star">
                <IcoN name="starWire32" size={32}/>
                <IcoN name="star32" size={32}/>
              </span>
            </Tooltip>
          </label>
          <input id="rating-4" name="rating" type="radio" value="4"
                 onChange={this.handleOptionChange.bind(this, 4)}/>
          <label htmlFor="rating-4" data-value="4">
            <Tooltip title={this.translator._getText('Awesome')} placement="bottom">
              <span className="rating-star">
                  <IcoN name="starWire32" size={32}/>
                  <IcoN name="star32" size={32}/>
              </span>
            </Tooltip>
          </label>
          <input id="rating-3" name="rating" type="radio" value="3"
                 onChange={this.handleOptionChange.bind(this, 3)}/>
          <label htmlFor="rating-3" data-value="3">
            <Tooltip title={this.translator._getText('Liked it')} placement="bottom">
                        <span className="rating-star">
                            <IcoN name="starWire32" size={32}/>
                            <IcoN name="star32" size={32}/>
                        </span>
            </Tooltip>
          </label>
          <input id="rating-2" name="rating" type="radio" value="2"
                 onChange={this.handleOptionChange.bind(this, 2)}/>
          <label htmlFor="rating-2" data-value="2">
            <Tooltip title={this.translator._getText('Disliked it')} placement="bottom">
              <span className="rating-star">
                  <IcoN name="starWire32" size={32}/>
                  <IcoN name="star32" size={32}/>
              </span>
            </Tooltip>
          </label>
          <input id="rating-1" name="rating" type="radio" value="1"
                 onChange={this.handleOptionChange.bind(this, 1)}/>
          <label htmlFor="rating-1" data-value="1">
            <Tooltip title={this.translator._getText('Hated it')} placement="bottom">
              <span className="rating-star">
                  <IcoN name="starWire32" size={32}/>
                  <IcoN name="star32" size={32}/>
              </span>
            </Tooltip>
          </label>
        </div>
        {this.state.rate > 0 && this.state.user && (
          <div className="comment-box">
            <div className="user-logo">
              {!this.state.user.picture &&
                <img src="/public/assets/icons/absents_place.svg" width={32} height={32} alt=""/>
              }
              {this.state.user && <img src={this.state.user.picture}
                alt={this.state.user._id}/>}
            </div>
            <div className="text-box">
                        <textarea placeholder={this.translator._getText('Write as') + ' ' + 'Ali M' + '...'}
                                  value={this.state.comment} onChange={this.handleChange}/>
              <button className="butn butn-primary" onClick={this.submit}
                      disabled={this.state.comment.length === 0}>
                <Translate>Submit</Translate>
              </button>
            </div>
          </div>
        )}
        {this.state.rate > 0 && !this.state.user && (
          <div className="comment-box">
            <h4 className="login-error">
              <Translate>Please login to continue submitting your comment</Translate>
            </h4>
          </div>
        )}
      </div>
    );
  }
}

/**
 * redux store mapper
 * @param {any} redux store
 * @returns store item object
 */
const mapStateToProps = (store, IOwnProps: IOwnProps) => ({
  user: store.app.user,
  appId: IOwnProps.appId,
  submitted: IOwnProps.submitted,
});

export default connect(mapStateToProps, {})(Rating);
