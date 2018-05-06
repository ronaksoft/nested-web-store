import * as React from 'react';
// import {Translate, AppList, IcoN} from 'components';
import {Row, Col, Input, Upload} from 'antd';

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
  activeTab: number;
  app: any;
}

class AdminApp extends React.Component<IProps, IState> {
  public hashLinks: string[] = ['info', 'pictures', 'permissions', 'reviews'];

  /**
   * @constructor
   * Creates an instance of AppAdd.
   * @param {IAdminAppProps} props
   * @memberof Add
   */
  constructor(props: any) {
    super(props);
    let initData: any;
    if (typeof window !== 'undefined') {
      initData = window;
    }
    // if (initData) {
    //   this.state = {
    //     activeTab: this.getTabIndexFromHash(this.props.location.hash),
    //     app: initData.__INITIAL_DATA__.app || {},
    //   };
    //   initData.__INITIAL_DATA__ = {};
    // } else {
    //   this.state = {
    //     activeTab: this.getTabIndexFromHash(this.props.location.hash),
    //     app: {},
    //   };
    // }
  }
  // public componentWillUpdate(nextProps) {
  //
  // }

  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof AdminApp
   * @override
   * @generator
   */
  public render() {
    return (
      <div className="main-container">
        <div className="main-container-inner vertical">
          <Row>
            <Col md={12}>
              <Input/>
            </Col>
            <Col md={12}>
              <Upload/>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default AdminApp;
