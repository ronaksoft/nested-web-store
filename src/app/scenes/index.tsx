/**
 * @file component/sidebar/index.tsx
 * @author robzizo < me@robzizo.ir >
 * @description manage the private routes and sidebar open or close actions
 *              Documented by:          robzizo
 *              Date of documentation:  2017-07-24
 *              Reviewed by:            -
 *              Date of review:         -
 */
import * as React from 'react';
import {connect} from 'react-redux';
// import {hashHistory} from 'react-router';
import {login, logout} from 'redux/app/actions';

import Main from './main/';

import {IUser} from 'api/interfaces';
import { FormattedMessage, formatMessage } from 'react-intl';
// const style = require('./private.css');

interface IState {
  isLogin: boolean;
};

interface IProps {
  isLogin: boolean;
  user: IUser;
  params: string;
  setLogin: (user: IUser) => {};
  setLogout: () => {};
}

class Container extends React.Component<IProps, IState> {

  public constructor(props: IProps) {
    super(props);

    /**
     * @default this.state
     * @type {IState}
     */
    this.state = {
      isLogin: false,
    };
  }

  /**
   * renders the component if the credentials are valid
   * @returns {ReactElement} markup
   * @memberof Private
   * @override
   * @generator
   */
  public render() {
    console.log(formatMessage('hello'));
    return (
      <div>
        a
        <FormattedMessage
          id={'Header.greeting'}
          defaultMessage={'Hello'}
        />
      </div>
    );
  }
}

/**
 * redux store mapper
 * @param {any} redux store
 * @returns store item object
 */
const mapStateToProps = (store) => ({
  isLogin: store.app.isLogin,
  user: store.app.user,
});

/**
 * reducer actions functions mapper
 * @param {any} dispatch reducer dispacther
 * @returns reducer actions object
 */
const mapDispatchToProps = (dispatch) => {
  return {
    setLogin: (user: IUser) => {
      dispatch(login(user));
    },
    setLogout: () => {
      dispatch(logout());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Container);

export {
  Main
};
