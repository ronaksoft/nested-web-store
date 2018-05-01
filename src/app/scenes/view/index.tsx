import * as React from 'react';
import {Translate, AppList} from 'components';
class AppView extends React.Component<any, any> {

  /**
   * @constructor
   * Creates an instance of Sidebar.
   * @param {ISidebarProps} props
   * @memberof Sidebar
   */
  constructor(props: any) {
    super(props);
  }

  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof Sidebar
   * @override
   * @generator
   */
  public render() {
    return (
      <div className="main-container-inner">
        <div className="app-content">
          s
        </div>
        <AppList title={<Translate>Similar apps</Translate>} haveMore={false} items={[{
          name: 'Google Assisstant',
          category: 'Social & Fun',
        }]} mode="mini"/>
      </div>
    );
  }
}

export default AppView;
