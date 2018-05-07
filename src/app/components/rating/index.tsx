import * as React from 'react';
import {Translate, IcoN} from 'components';
import {Tooltip} from 'antd';
interface IProps {
    appId: string;
}

interface IState {
    rate: number;
    comment: string;
}

export default class Rating extends React.Component<IProps, IState> {
  private translator: Translate;
  constructor(props: any) {
    super(props);
    this.state = {
        rate: 0,
        comment: '',
    };
    this.translator = new Translate();
    // this.translator._getText('Search htmlFor apps...');
  }
  private handleOptionChange = (rate: number) => {
      this.setState({
          rate,
      });
  }
  public handleChange = (event) => {
    this.setState({comment: event.target.value});
  }
  public submit = () => {
    //   submit api
  }
  public render() {
    return (
        <div className="rating-form">
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
            {this.state.rate > 0 && (
                <div className="comment-box">
                    <div className="user-logo">
                        <img src="/public/assets/icons/absents_place.svg" width={32} height={32} alt=""/>
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
        </div>
    );
  }
}