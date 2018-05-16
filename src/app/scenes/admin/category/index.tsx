import * as React from 'react';
import {Translate, IcoN, Affixer} from 'components';
import {Modal, message, Popconfirm} from 'antd';
import {SortableContainer, SortableElement, arrayMove, SortableHandle} from 'react-sortable-hoc';
import {ICategory} from 'api/interfaces';
import * as _ from 'lodash';
import {category as CategoryFactory} from '../../../api';

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
  model: ICategory;
}

class AdminCategory extends React.Component<IProps, IState> {
  private translator: Translate;
  private categoryFactory: CategoryFactory;
  private emptyModel: ICategory;

  /**
   * @constructor
   * Creates an instance of AppAdd.
   * @param {IProps} props
   * @memberof Add
   */
  constructor(props: any) {
    super(props);
    this.translator = new Translate();
    this.emptyModel = {
      _id: '',
      slug: '',
      name: '',
      order: 0,
      stared: false,
      translations: [{
        locale: 'fa',
        name: '',
      }],
    };
    const state: IState = {
      loading: false,
      addCategoryModal: false,
      untouched: true,
      categories: [],
      model: _.cloneDeep(this.emptyModel),
    };
    this.state = state;
    this.categoryFactory = new CategoryFactory();
  }

  public componentDidMount() {
    this.categoryFactory.getAll().then((data) => {
      if (data === null) {
        return;
      }
      this.setState({
        categories: data,
      });
    }).catch(() => {
      message.error(this.translator._getText('Can\'t fetch categories!'));
    });
  }

  private onSave = () => {
    console.log(this.state.categories);
    const models: ICategory[] = [];
    this.state.categories.forEach((model, index) => {
      models.push({
        _id: model._id,
        order: index,
      });
    });
    this.categoryFactory.setOrder(models).then(() => {
      message.success(this.translator._getText('Categories order successfully updated'));
      this.setState({
        untouched: false,
      });
    }).catch(() => {
      message.error(this.translator._getText('Can\'t fetch categories!'));
    });
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

  private onEdit = (id) => {
    const index = _.findIndex(this.state.categories, {
      _id: id,
    });
    if (index === -1) {
      return;
    }
    const model = this.state.categories[index];
    this.setState({
      model,
      addCategoryModal: true,
    });
  }

  private onRemove = (id) => {
    const categories: ICategory[] = this.state.categories;
    this.categoryFactory.remove(id).then(() => {
      const index = _.findIndex(categories, {
        _id: id,
      });
      if (index > -1) {
        categories.splice(index, 1);
      }
      this.setState({
        categories,
        model: this.emptyModel,
        addCategoryModal: false,
      });
      message.success(this.translator._getText('Category successfully removed'));
    }).catch(() => {
      message.error(this.translator._getText('Can\'t remove category!'));
    });
  }

  private submitCreateCategoryForm = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const categories: ICategory[] = this.state.categories;
    if (this.state.model._id === '') {
      this.categoryFactory.create(this.state.model).then((data) => {
        categories.push(data);
        this.setState({
          categories,
          model: this.emptyModel,
          addCategoryModal: false,
        });
        message.success(this.translator._getText('Category successfully created'));
      }).catch(() => {
        message.error(this.translator._getText('Can\'t create category!'));
      });
    } else {
      this.categoryFactory.edit(this.state.model).then((data) => {
        const index = _.findIndex(categories, {
          _id: data._id,
        });
        if (index > -1) {
          categories[index] = data;
        }
        this.setState({
          categories,
          model: this.emptyModel,
          addCategoryModal: false,
        });
        message.success(this.translator._getText('Category successfully edited'));
      }).catch(() => {
        message.error(this.translator._getText('Can\'t edit category!'));
      });
    }
  }

  private validateForm(model: ICategory) {
    if (model.slug.length > 0 && model.name.length > 0 && model.translations[0].name.length > 0) {
      return true;
    }
    return false;
  }

  private bindInputToModel(selector: any, e: any) {
    const model = this.state.model;
    if (typeof selector === 'object') {
      const elem = selector.name.split('[]');
      model[elem[0]][selector.index][elem[1]] = e.target.value;
    } else {
      model[selector] = e.target.value;
      if (selector === 'slug') {
        model[selector] = model[selector].toLowerCase().split(' ').join('_');
      }
    }
    this.setState({
      model,
    });
  }

  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof AdminCategory
   * @override
   * @generator
   */
  public render() {
    const validateForm = this.validateForm(this.state.model);
    const DragHandle = SortableHandle(() => <IcoN name="move24" size={24}/>);
    const SortableItem = SortableElement(({value, onEdit, onRemove}) => (
      <li className="category-sort-item">
        <div className="dragger">
          <DragHandle/>
        </div>
        <span>{value.name}</span>
        <a className="edit-button" onClick={() => {
          onEdit(value._id);
        }}>
          <IcoN name="pencil24" size={24}/>
        </a>
        <Popconfirm title="Are you sure about removing this Category?" onConfirm={onRemove.bind(this, value._id)}
                    okText="Yes" cancelText="No">
          <div className="remove-button">
            <IcoN name="binRed24" size={24}/>
          </div>
        </Popconfirm>
      </li>
    ));
    const SortableList = SortableContainer(({items}) => {
      return (
        <ul className="categories-list admin-list">
          {items.map((cat, index) => (
            <SortableItem key={`item-${index}`} index={index} value={cat} onEdit={this.onEdit} onRemove={this.onRemove}
                          onSortEnd={this.onSortEnd}/>
          ))}
        </ul>
      );
    });
    return (
      <div className="admin-wrapper category-scene">
        <Affixer offsetTop={72} zIndex={4} height={80}>
          <div className="page-buttons">
            <h2><Translate>Category Management</Translate></h2>
            <button className="butn butn-primary" onClick={this.onSave} disabled={this.state.untouched}>
              <Translate>Save</Translate>
            </button>
          </div>
        </Affixer>
        <a className="add" onClick={this.toggleAddCategoryModal}>
          <IcoN name="cross24" size={24}/>
          <span>Add a category</span>
        </a>
        <SortableList items={this.state.categories} onSortEnd={this.onSortEnd} distance={2} lockAxis="Y"/>
        <Modal
          title="Add or edit a category"
          wrapClassName="vertical-center-modal"
          width="466px"
          visible={this.state.addCategoryModal}
          onCancel={this.toggleAddCategoryModal}
          footer={[
            <button key="back" className="butn secondary" onClick={this.toggleAddCategoryModal}>
              <Translate>Cancel</Translate>
            </button>,
            <button key="submit" className="butn butn-primary" onClick={this.submitCreateCategoryForm}
                    disabled={!validateForm}>
              {this.state.model._id === '' &&
              <Translate>Add</Translate>}
              {this.state.model._id !== '' &&
              <Translate>Apply</Translate>}
            </button>,
          ]}
        >
          <form className="add-category-modal" onSubmit={this.submitCreateCategoryForm}>
            <input type="text" placeholder={this.translator._getText('Category slug...')}
                   onChange={this.bindInputToModel.bind(this, 'slug')} value={this.state.model.slug}/>
            <input type="text" placeholder={this.translator._getText('Category name in English...')}
                   onChange={this.bindInputToModel.bind(this, 'name')} value={this.state.model.name}/>
            <input type="text" dir="rtl" placeholder={this.translator._getText('Category name in Persian...')}
                   onChange={this.bindInputToModel.bind(this, {name: 'translations[]name', index: 0})}
                   value={this.state.model.translations[0].name}/>
            <button className="hidden-submit" type="submit" disabled={!validateForm}/>
          </form>
        </Modal>
      </div>
    );
  }
}

export default AdminCategory;
