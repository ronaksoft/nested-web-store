import * as React from 'react';

class NotFound extends React.Component<any, any> {
  public render() {
    return (
      <div className="not-found">
        <div id="clouds">
          <div className="cloud x1"/>
          <div className="cloud x1_5"/>
          <div className="cloud x2"/>
          <div className="cloud x3"/>
          <div className="cloud x4"/>
          <div className="cloud x5"/>
        </div>
        <div className="vc">
          <div className="c">
            <div className="_404">404</div>
            <hr/>
            <div className="_1">THE PAGE</div>
            <div className="_2">WAS NOT FOUND</div>
            <a className="btn" href="/">BACK TO APP STORE</a>
          </div>
        </div>
      </div>
    );
  }
}

export default NotFound;
