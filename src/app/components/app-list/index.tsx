import * as React from 'react';
import {Translate} from 'components';

interface IProps {
    items: any[];
    mode?: string;
    title: any;
    haveMore: boolean;
};

interface IState {
    items: any[];
};

export default class AppList extends React.Component<IProps, IState> {
  private translator: Translate;
  constructor(props: any) {
    super(props);
    this.state = {
        items: props.items,
    };
    this.translator = new Translate();
    // this.translator._getText('Search for apps...')
  }
  public render() {
    const isMini = this.props.mode === 'mini';
    // Finally, render it!
    return (
        <div className="apps-wrapper">
          <div className="app-list">
            <div className="list-head">
              <h3>{this.props.title}</h3>
              <div className="filler"/>
              {this.props.haveMore && <a href=""><Translate>See more</Translate></a>}
            </div>
            <div className="list-body">
                {this.state.items.map((item, index) => (
                    <a key={index} className={isMini ? 'app-card-mini' : 'app-card'}>
                        <div className="app-image">
                            <img src={require('../../assets/icons/absents_place.svg')} alt=""/>
                            {!isMini && (
                                <div className="app-image-bg">
                                    <img src={require('../../assets/icons/absents_place.svg')} alt=""/>
                                </div>
                            )}
                        </div>
                        <div className="app-data">
                            <h4>{item.name}</h4>
                            <aside><Translate>{item.category}</Translate></aside>
                        </div>
                    </a>
                ))}
            </div>
          </div>
        </div>
    );
  }
}
