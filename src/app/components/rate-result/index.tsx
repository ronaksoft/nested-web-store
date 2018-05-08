import * as React from 'react';
import {IcoN} from 'components';
interface IProps {
    rate: number;
    withSpan?: boolean;
    silver?: boolean;
}

export default class RateResult extends React.Component<IProps, any> {
  public render() {
      const rate = Math.floor(this.props.rate);
      const Max = 5;
      const rateArray = [];
      const unrateArray = [];
      // while (rateArray.length !== rate) {
      //   rateArray.push(rateArray.length + 1);
      // }
      for (let i = 0; i < rate; i++) {
        rateArray.push(i + 1);
      }
      for (let i = 0; i < (Max - rate); i++) {
        unrateArray.push(i + 1);
      }
    return (
        <div className={['rate-result', this.props.silver ? 'silver' : ''].join(' ')}>
            {rateArray.map((item) => <IcoN key={'f' + item} name="star16" size={16}/>)}
            {unrateArray.map((item) => <IcoN key={'o' + item} name="starWire16" size={16}/>)}
            {this.props.withSpan && <span>{rate}/{Max}</span>}
        </div>
    );
  }
}
