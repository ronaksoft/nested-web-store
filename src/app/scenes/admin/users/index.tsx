import * as React from 'react';
import {Translate, IcoN, Affixer, Loading} from 'components';
import {Modal, message, Popconfirm, Popover, Upload} from 'antd';
import {IUser} from 'api/interfaces';
import * as _ from 'lodash';
import {
  user as UserFactory,
  file as FileFactory,
} from 'api';
import Const from 'api/consts/CServer';

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
  userLogoUrl: string;
  pageCount: number;
  keyword: string;
  userRole: string;
}

class AdminUsers extends React.Component<IProps, IState> {
  private translator: Translate;
  private userFactory: UserFactory;
  private fileFactory: FileFactory;
  private customRequest: any;
  private emptyModel: IUser;
  private pagination: any;
  private filterbar: any;

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
      nested_domain: '',
      nested_username: '',
      apps: [],
      admin: false,
      developer: true,
      created_at: 0,
    };
    const state: IState = {
      loading: false,
      addUserModal: false,
      untouched: true,
      userLogoUrl: '',
      keyword: '',
      users: [],
      pageCount: 1,
      model: _.cloneDeep(this.emptyModel),
      userRole: 'normal',
    };
    this.state = state;
    this.userFactory = new UserFactory();
    this.pagination = {
      skip: 0,
      limit: 10,
    };
    this.fileFactory = new FileFactory();
    this.customRequest = this.fileFactory.customRequest.bind(this);
  }

  public componentDidMount() {
    this.loadUsers();
  }

  private loadUsers() {
    this.userFactory.getAll(this.state.keyword, [], this.pagination.skip, this.pagination.limit).then((data) => {
      if (data.users === null) {
        this.setState({
          users: [],
          pageCount: 1,
        });
        if (this.pagination.skip > 0) {
          message.warning(this.translator._getText('Reached the end!'));
        } else {
          message.warning(this.translator._getText('No results'));
        }
        return;
      }
      this.setState({
        users: data.users,
        pageCount: Math.floor(data.count / this.pagination.limit) + 1,
      });
    }).catch(() => {
      message.error(this.translator._getText('Can\'t fetch users!'));
    });
  }

  private loadUsersDebounced = _.debounce(this.loadUsers, 512);

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

  private refHandler = (element) => {
    this.filterbar = element;
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

  private submitCreateUserFrom = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const users: IUser[] = this.state.users;
    const model = this.state.model;
    if (this.state.userRole === 'admin') {
      model.admin = true;
    } else if (this.state.userRole === 'developer') {
      model.developer = true;
    }
    model.nested = model.nested_username + '@' + model.nested_domain;
    if (this.state.model._id === '') {
      this.userFactory.create(model).then((data) => {
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
      this.userFactory.edit(model).then((data) => {
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

  private beforeUploadLogo = (file: any) => {
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      message.error('Image must smaller than 1MB!');
    }
    return isLt1M;
  }

  private onEdit = (id) => {
    const index = _.findIndex(this.state.users, {
      _id: id,
    });
    if (index === -1) {
      return;
    }
    const model = this.state.users[index];
    const nested = model.nested.split('@');
    model.nested_domain = nested[1];
    model.nested_username = nested[0];
    let userRole = 'normal';
    if (model.admin) {
      userRole = 'admin';
    } else if (model.developer) {
      userRole = 'developer';
    }
    this.setState({
      model,
      userRole,
      addUserModal: true,
    });
  }

  private validateForm(model: IUser) {
    if (model.name.length === 0) {
      return false;
    }
    if (model.nested_domain.length === 0) {
      return false;
    }
    if (model.nested_username.length === 0) {
      return false;
    }
    if (model.username.length === 0) {
      return false;
    }
    return true;
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

  private handleRoleChange = (e) => {
    this.setState({
      userRole: e.target.value,
    });
  }

  private getBase64 = (img: any, callback: any) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  private logoChangeHandler = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({loading: true});
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      const model = this.state.model;
      model.picture = info.file.response.data.files[0].path;
      this.getBase64(info.file.originFileObj, (userLogoUrl) => this.setState({
        userLogoUrl,
        loading: false,
        model,
      }));
    }
  }

  private changeSearch = (event) => {
    this.setState({keyword: event.target.value});
    this.pagination = {
      skip: 0,
      limit: 10,
    };
    this.loadUsersDebounced();
  }

  private getPopupContainer = () => this.filterbar;

  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof AdminCategory
   * @override
   * @generator
   */
  public render() {
    const {userLogoUrl} = this.state;
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
    const uploadButton = (
      <div>
        {this.state.loading && <Loading active={true}/>}
        {!this.state.loading && <IcoN name="cross24" size={24}/>}
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="admin-wrapper admin-users-list">
        <Affixer offsetTop={72} zIndex={4} height={80}>
          <div className="page-buttons">
            <h2><Translate>Users List</Translate></h2>
            <button className="butn butn-blue" onClick={this.toggleAddUserModal}>
              <Translate>Add User</Translate>
            </button>
            <div className="_df" ref={this.refHandler}>
              <Popover placement="bottomRight" trigger="click" content={filterMenu}
                getPopupContainer={this.getPopupContainer}
                overlayClassName="popover-no-padding popover-filter-bar">
                <div className="filter">
                  <IcoN name="filter24" size={24}/>
                </div>
              </Popover>
              <Popover placement="bottomRight" trigger="click" content={sortMenu}
              getPopupContainer={this.getPopupContainer}
                overlayClassName="popover-no-padding popover-filter-bar">
                <div className="sort">
                  <IcoN name="sort24" size={24}/>
                </div>
              </Popover>
            </div>
          </div>
        </Affixer>
        <Affixer offsetTop={136} zIndex={4} height={48}>
          <div className="search-list">
            <IcoN name="search24" size={24}/>
            <input type="text" onChange={this.changeSearch}
              placeholder={this.translator._getText('Search in apps...')}/>
          </div>
        </Affixer>
        <ul className="users-list admin-list">
          {this.state.users.map((user, index) => {
            return (
              <li key={'user-' + index}>
                <div className="user-logo">
                  {!user.picture &&
                  <img src={'/public/assets/icons/absents_place.svg'} alt=""/>}
                  {user.picture &&
                  <img src={user.picture.indexOf('http') > -1 ? user.picture : Const.SERVER_URL + user.picture}
                       alt=""/>}
                </div>
                <div className="user-info">
                  <b>{user.name}</b>
                  <span>{user.nested}</span>
                </div>
                <div className="edit-button" onClick={this.onEdit.bind(this, user._id)}>
                  <IcoN name="pencil24" size={24}/>
                </div>
                <Popconfirm title={this.translator._getText('Are you sure about removing this user?')}
                            onConfirm={this.onRemove.bind(this, 'robzizo')}
                            okText={this.translator._getText('Yes')} cancelText={this.translator._getText('No')}>
                  <div className="remove-button">
                    <IcoN name="binRed24" size={24}/>
                  </div>
                </Popconfirm>
              </li>
            );
          })}
        </ul>
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
        <Modal
          title="Add or edit a user manually"
          wrapClassName="vertical-center-modal"
          width="466px"
          visible={this.state.addUserModal}
          onCancel={this.toggleAddUserModal}
          footer={[
            <button key="back" className="butn secondary" onClick={this.toggleAddUserModal}>
              <Translate>Cancel</Translate>
            </button>,
            <button key="submit" className="butn butn-primary" onClick={this.submitCreateUserFrom}
                    disabled={!validateForm}>
              {this.state.model._id === '' &&
              <Translate>Add</Translate>}
              {this.state.model._id !== '' &&
              <Translate>Apply</Translate>}
            </button>,
          ]}
        >
          <form className="add-user-modal" onSubmit={this.submitCreateUserFrom}>
            <div className="_df">
              <div>
                <legend><Translate>Basic info</Translate></legend>
                <input type="text" placeholder={this.translator._getText('Name')}
                       onChange={this.bindInputToModel.bind(this, 'name')} value={this.state.model.name}/>
                <input type="text" placeholder={this.translator._getText('Username')}
                       onChange={this.bindInputToModel.bind(this, 'username')} value={this.state.model.username}/>
              </div>
              <div className="user-logo">
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={this.beforeUploadLogo}
                  onChange={this.logoChangeHandler}
                  customRequest={this.customRequest}
                >
                  {userLogoUrl ? <img src={userLogoUrl} alt=""/> : uploadButton}
                </Upload>
              </div>
            </div>
            <input type="text" placeholder={this.translator._getText('Email address')}
                   onChange={this.bindInputToModel.bind(this, 'email')} value={this.state.model.email}/>
            <select value={this.state.userRole} onChange={this.handleRoleChange}>
              <option value="normal">Normal</option>
              <option value="developer">Developer</option>
              <option value="admin">Admin</option>
            </select>
            <legend><Translate>Nested Account Info</Translate></legend>
            <input type="text" placeholder={this.translator._getText('Nested domain')}
                   onChange={this.bindInputToModel.bind(this, 'nested_domain')}
                   value={this.state.model.nested_domain}/>
            <input type="text" placeholder={this.translator._getText('Nested username')}
                   onChange={this.bindInputToModel.bind(this, 'nested_username')}
                   value={this.state.model.nested_username}/>
            <button className="hidden-submit" type="submit" disabled={!validateForm}/>
          </form>
        </Modal>
      </div>
    );
  }
}

export default AdminUsers;
