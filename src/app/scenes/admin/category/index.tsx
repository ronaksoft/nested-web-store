import * as React from 'react';
import {Translate, IcoN} from 'components';
import {Modal} from 'antd';
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
  untouched: boolean;
  addCategoryModal: boolean;
}

class AdminApp extends React.Component<IProps, IState> {
  private translator: Translate;

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
      addCategoryModal: false,
      untouched: true,
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
  }

  private onSave() {
    console.log('aaa');
  }

  private onSortEnd = ({oldIndex, newIndex}) => {
    this.setState({
      categories: arrayMove(this.state.categories, oldIndex, newIndex),
      untouched: false,
    });
  }

  private toggleAddCategoryModal = () => {
    if (!this.state.addCategoryModal) {
      this.setState({
        addCategoryModal: true,
      });
    } else {
      this.setState({
        addCategoryModal: false,
      });
    }
  }

  private createCategory = () => {
    // ssss
  }

  private submitCreateCategoryForm = (e) => {
    console.log(e);
    e.preventDefault();
    e.stopPropagation();
    this.toggleAddCategoryModal();
    // ssss
  }
  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof AdminApp
   * @override
   * @generator
   */
  public render() {
    const validateForm = false;
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
                <button className="butn butn-primary" onClick={this.onSave} disabled={this.state.untouched}>
                  <Translate>Save</Translate>
                </button>
            </div>
          </div>
          <div className="add-category">
            <a className="add" onClick={this.toggleAddCategoryModal}>
              <IcoN name="cross24" size={24}/>
              <span>Add a category</span>
            </a>
            <SortableList items={this.state.categories} onSortEnd={this.onSortEnd} lockAxis="Y"/>
          </div>
        </div>
        <Modal
            title="Add or edit a category"
            wrapClassName="vertical-center-modal"
            width="466px"
            visible={this.state.addCategoryModal}
            onOk={this.createCategory}
            onCancel={this.toggleAddCategoryModal}
            footer={[
              <button key="back" className="butn secondary" onClick={this.toggleAddCategoryModal}>
                <Translate>Cancel</Translate>
              </button>,
              <button key="submit" className="butn butn-primary" onClick={this.createCategory}
                disabled={!validateForm}>
                <Translate>Add</Translate>
              </button>,
            ]}
          >
          <form className="add-category-modal" onSubmit={this.submitCreateCategoryForm}>
            <input type="text" placeholder={this.translator._getText('Category name (eng)...')}/>
            <input type="text" placeholder={this.translator._getText('Category name (per)...')}/>
            <input type="text" placeholder={this.translator._getText('Category slug...')}/>
            <button type="submit" disabled={!validateForm}/>
          </form>
        </Modal>
      </div>
    );
  }
}

export default AdminApp;
