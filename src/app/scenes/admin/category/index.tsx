import * as React from 'react';
import {Translate, IcoN} from 'components';
// import {Upload, message, Modal} from 'antd';
import {file as FileFactory, app as AppFactory} from 'api';
import {SortableContainer, SortableElement, arrayMove, SortableHandle} from 'react-sortable-hoc';
import {ICategory} from 'api/interfaces';

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
  categories: ICategory[];
}

class AdminApp extends React.Component<IProps, IState> {
  private translator: Translate;
  private customRequest: any;
  private appFactory: AppFactory;
  private fileFactory: FileFactory;

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
    this.translator = new Translate();
    const state: IState = {
      loading: false,
      categories: [
        {
          _id: 'a',
          name: 'a',
          name_fa: 'a',
          stared: false,
          order: 0,
        },
        {
          _id: 'b',
          name: 'b',
          name_fa: 'b',
          stared: true,
          order: 1,
        },
      ],
    };
    this.state = state;
    this.appFactory = new AppFactory();
    this.fileFactory = new FileFactory();
    this.customRequest = this.fileFactory.customRequest.bind(this);
  }

  private onSave() {
    console.log('aaa');
  }

  private onSortEnd = ({oldIndex, newIndex}) => {
    this.setState({
      categories: arrayMove(this.state.categories, oldIndex, newIndex),
    });
  }

  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof AdminApp
   * @override
   * @generator
   */
  public render() {
    const DragHandle = SortableHandle(() => <IcoN name="move24" size={24}/>);
    const SortableItem = SortableElement(({value}) => (
      <li className="add-category-sort-item">
        <div className="dragger">
          <DragHandle/>
        </div>
        <span>{value.name}</span>
        <div className="edit-button">
          <IcoN name="pencil24" size={24}/>
        </div>
        <div className="remove-button">
          <IcoN name="negativeXCross24" size={24}/>
        </div>
      </li>
    ));
    const SortableList = SortableContainer(({items}) => {
      return (
        <ul className="categories-list">
            {items.map((cat, index) => (
              <SortableItem key={`item-${index}`} index={index} value={cat} onSortEnd={this.onSortEnd}/>
            ))}
        </ul>
      );
    });
    return (
      <div className="main-container">
        <div className="main-container-inner vertical admin">
          <div className="page-buttons">
            <div className="page-buttons-inner">
              <h2><Translate>Category Management</Translate></h2>
                <button className="butn butn-primary" onClick={this.onSave}>
                  <Translate>Save</Translate>
                </button>
            </div>
          </div>
          <div className="add-category">
            <a className="add-cat">
              <IcoN name="cross16" size={16}/>
              <span>Add a category</span>
            </a>
            <SortableList items={this.state.categories} onSortEnd={this.onSortEnd} lockAxis="Y"/>
          </div>
        </div>
        {/* <Modal
            title="test"
            wrapClassName="vertical-center-modal"
            width="90%"
            visible={this.state.preview}
            onOk={this.preview}
            onCancel={this.preview}
          >
          <AppView app="test" preview={true}/>
        </Modal> */}
      </div>
    );
  }
}

export default AdminApp;
