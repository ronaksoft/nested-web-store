import * as React from 'react';
import {Translate, IcoN, Affixer} from 'components';
import {Modal, message, Popconfirm, Popover} from 'antd';
import {IUser} from 'api/interfaces';
import {Link} from 'react-router';
import * as _ from 'lodash';
import {user as UserFactory} from '../../../api';

const ReactPaginate = require('react-paginate');

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
  users: IUser[];
  untouched: boolean;
  addUserModal: boolean;
  model: IUser;
  pageCount: number;
}

class AdminUsers extends React.Component<IProps, IState> {
  private translator: Translate;
  private userFactory: UserFactory;
  private emptyModel: IUser;
  private pagination: any;

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
      username: '',
      name: '',
      email: '',
      nested: '',
      apps: [],
      admin: false,
      developer: true,
      created_at: 0,
    };
    const state: IState = {
      loading: false,
      addUserModal: false,
      untouched: true,
      users: [],
      pageCount: 1,
      model: _.cloneDeep(this.emptyModel),
    };
    this.state = state;
    this.userFactory = new UserFactory();
    this.pagination = {
      skip: 0,
      limit: 10,
    };
  }

  public componentDidMount() {
    this.loadUsers();
  }

  private loadUsers() {
    this.userFactory.getAll('', 0, this.pagination.skip, this.pagination.limit).then((data) => {
      if (data.users === null) {
        message.warning(this.translator._getText('Reached the end!'));
        return;
      }
      this.setState({
        users: data.users,
        pageCount: data.count,
      });
    }).catch(() => {
      message.error(this.translator._getText('Can\'t fetch users!'));
    });
  }

  private toggleAddUserModal = () => {
    if (!this.state.addUserModal) {
      this.setState({
        addUserModal: true,
      });
    } else {
      this.setState({
        addUserModal: false,
      });
    }
  }

  // private onEdit = (id) => {
  //   const index = _.findIndex(this.state.users, {
  //     _id: id,
  //   });
  //   if (index === -1) {
  //     return;
  //   }
  //   const model = this.state.users[index];
  //   this.setState({
  //     model,
  //     addUserModal: true,
  //   });
  // }

  private onRemove = (id) => {
    const users: IUser[] = this.state.users;
    this.userFactory.remove(id).then(() => {
      const index = _.findIndex(users, {
        _id: id,
      });
      if (index > -1) {
        users.splice(index, 1);
      }
      this.setState({
        users,
        model: this.emptyModel,
        addUserModal: false,
      });
      message.success(this.translator._getText('Category successfully removed'));
    }).catch(() => {
      message.error(this.translator._getText('Can\'t remove category!'));
    });
  }

  private submitCreateCategoryForm = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const users: IUser[] = this.state.users;
    if (this.state.model._id === '') {
      this.userFactory.create(this.state.model).then((data) => {
        users.push(data);
        this.setState({
          users,
          model: this.emptyModel,
          addUserModal: false,
        });
        message.success(this.translator._getText('Category successfully created'));
      }).catch(() => {
        message.error(this.translator._getText('Can\'t create category!'));
      });
    } else {
      this.userFactory.edit(this.state.model).then((data) => {
        const index = _.findIndex(users, {
          _id: data._id,
        });
        if (index > -1) {
          users[index] = data;
        }
        this.setState({
          users,
          model: this.emptyModel,
          addUserModal: false,
        });
        message.success(this.translator._getText('Category successfully edited'));
      }).catch(() => {
        message.error(this.translator._getText('Can\'t edit category!'));
      });
    }
  }

  private validateForm(model: IUser) {
    console.log(model);
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

  private handlePageClick = (data: any) => {
    this.pagination.skip = this.pagination.limit * data.selected;
    this.loadUsers();
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
    const sortMenu = (
      <ul className="sort-menu">
        <li>ssss</li>
        <li>44</li>
      </ul>
    );
    const filterMenu = (
      <ul className="filter-menu">
        <li>ssss</li>
        <li>11</li>
      </ul>
    );
    return (
      <div className="admin-wrapper admin-users-list">
        <Affixer offsetTop={72} zIndex={4} height={80}>
          <div className="page-buttons">
            <h2><Translate>Users List</Translate></h2>
            <div className="_df">
              <Popover placement="bottom" trigger="click" content={filterMenu}>
                <div className="filter">
                  <IcoN name="filter24" size={24}/>
                </div>
              </Popover>
              <Popover placement="bottom" trigger="click" content={sortMenu}>
                <div className="sort">
                  <IcoN name="sort24" size={24}/>
                </div>
              </Popover>
            </div>
          </div>
        </Affixer>
        <a className="add" onClick={this.toggleAddUserModal}>
          <IcoN name="cross24" size={24}/>
          <Translate>Add a user manually</Translate>
        </a>
        <ul className="users-list admin-list">
          {this.state.users.map((user, index) => {
            return (
              <li key={'user-' + index}>
                <div className="user-logo">
                  <img src={'/public/assets/icons/absents_place.svg'} alt=""/>
                </div>
                <div className="user-info">
                  <b>{user.name}</b>
                  <span>{user.nested}</span>
                </div>
                <Link className="edit-button" to={'/admin/user/edit/' + 'robzizo'}>
                  <IcoN name="pencil24" size={24}/>
                </Link>
                <Popconfirm title={this.translator._getText('Are you sure about removing this user?')}
                            onConfirm={this.onRemove.bind(this, 'robzizo')}
                            okText={this.translator._getText('Yes')} cancelText={this.translator._getText('No')}>
                  <div className="remove-button">
                    <IcoN name="negativeXCross24" size={24}/>
                  </div>
                </Popconfirm>
              </li>
            );
          })}
          {this.state.pageCount > 1 &&
          <ReactPaginate
            nextLabel={<IcoN name="arrow24" size={24}/>}
            previousLabel={<IcoN name="arrow24" size={24}/>}
            breakLabel={<a href="">...</a>}
            breakClassName="reak-me"
            pageCount={this.state.pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={this.handlePageClick}
            containerClassName="pagination"
            subContainerClassName="pages pagination"
            activeClassName="active"/>}
        </ul>
        <Modal
          title="Add a user"
          wrapClassName="vertical-center-modal"
          width="466px"
          visible={this.state.addUserModal}
          onCancel={this.toggleAddUserModal}
          footer={[
            <button key="back" className="butn secondary" onClick={this.toggleAddUserModal}>
              <Translate>Cancel</Translate>
            </button>,
            <button key="submit" className="butn butn-primary" onClick={this.submitCreateCategoryForm}
                    disabled={!validateForm}>
              {this.state.model._id === '' &&
              <Translate>Add</Translate>}
              {this.state.model._id !== '' &&
              <Translate>Edit</Translate>}
            </button>,
          ]}
        >
          <form className="add-category-modal" onSubmit={this.submitCreateCategoryForm}>
            <input type="text" placeholder={this.translator._getText('Category slug...')}
                   onChange={this.bindInputToModel.bind(this, 'slug')} value={this.state.model.name}/>
            <button className="hidden-submit" type="submit" disabled={!validateForm}/>
          </form>
        </Modal>
      </div>
    );
  }
}

export default AdminUsers;
