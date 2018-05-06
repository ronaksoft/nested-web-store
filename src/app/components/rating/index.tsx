import * as React from 'react';
import {Translate, IcoN} from 'components';
interface IProps {
    appId: string;
};

interface IState {
    rate: number;
};

export default class Rating extends React.Component<IProps, IState> {
  private translator: Translate;
  constructor(props: any) {
    super(props);
    this.state = {
        rate: 0,
    };
    this.translator = new Translate();
    // this.translator._getText('Search htmlFor apps...')
  }
  public render() {
    // Finally, render it!
    return (
        <div className="rating-form">
            <legend><Translate>Submit your rating</Translate></legend>
            <div className="rate-stars">
                <input id="rating-5" name="rating" type="radio" value="5"/>
                <label htmlFor="rating-5" data-value="5">
                    <span className="rating-star">
                        <IcoN name="starWire32" size={32}/>
                        <IcoN name="star32" size={32}/>
                    </span>
                    <span className="ir">5</span>
                </label>
                <input id="rating-4" name="rating" type="radio" value="4"/>
                <label htmlFor="rating-4" data-value="4">
                    <span className="rating-star">
                        <IcoN name="starWire32" size={32}/>
                        <IcoN name="star32" size={32}/>
                    </span>
                    <span className="ir">4</span>
                </label>
                <input id="rating-3" name="rating" type="radio" value="3"/>
                <label htmlFor="rating-3" data-value="3">
                    <span className="rating-star">
                        <IcoN name="starWire32" size={32}/>
                        <IcoN name="star32" size={32}/>
                    </span>
                    <span className="ir">3</span>
                </label>
                <input id="rating-2" name="rating" type="radio" value="2"/>
                <label htmlFor="rating-2" data-value="2">
                    <span className="rating-star">
                        <IcoN name="starWire32" size={32}/>
                        <IcoN name="star32" size={32}/>
                    </span>
                    <span className="ir">2</span>
                </label>
                <input id="rating-1" name="rating" type="radio" value="1"/>
                <label htmlFor="rating-1" data-value="1">
                    <span className="rating-star">
                        <IcoN name="starWire32" size={32}/>
                        <IcoN name="star32" size={32}/>
                    </span>
                    <span className="ir">1</span>
                </label>
            </div>
        </div>
    );
  }
}
