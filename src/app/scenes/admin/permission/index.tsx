import * as React from 'react';
import {Translate, IcoN, Tab, Affixer, Loading} from 'components';
import {message, Modal, Popconfirm, Upload} from 'antd';
import {IPermission} from 'api/interfaces';
import * as _ from 'lodash';
import {
  file as FileFactory,
  permission as PermissionFactory,
} from 'api';
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
  model: IPermission;
  permissions: IPermission[];
  untouched: boolean;
  addModal: boolean;
  imageUrl: string;
}

class AdminPermission extends React.Component<IProps, IState> {
  private translator: Translate;
  private customRequest: any;
  private fileFactory: FileFactory;
  private permissionFactory: PermissionFactory;
  private emptyModel: IPermission;

  /**
   * @constructor
   * Creates an instance of AppAdd.
   * @param {IProps} props
   * @memberof AdminPermission
   */
  constructor(props: any) {
    super(props);
    this.emptyModel = {
      _id: '',
      code: null,
      name: '',
      desc: '',
      translations: [{
        name: '',
        desc: '',
        locale: 'fa',
      }],
    };
    this.translator = new Translate();
    this.state = {
      loading: false,
      addModal: false,
      untouched: true,
      permissions: [],
      imageUrl: '',
      model: _.cloneDeep(this.emptyModel),
    };
    this.permissionFactory = new PermissionFactory();
    this.fileFactory = new FileFactory();
    this.customRequest = this.fileFactory.customRequest.bind(this);
  }

  public componentDidMount() {
    this.permissionFactory.getAll().then((data) => {
      if (data === null) {
        return;
      }
      this.setState({
        permissions: data,
      });
    }).catch(() => {
      message.error(this.translator._getText('Can\'t fetch permissions!'));
    });
  }

  private toggleAddModal = () => {
    if (!this.state.addModal) {
      this.setState({
        addModal: true,
      });
    } else {
      this.setState({
        addModal: false,
      });
    }
  }

  private onEdit = (id) => {
    const index = _.findIndex(this.state.permissions, {
      _id: id,
    });
    if (index === -1) {
      return;
    }
    const model = this.state.permissions[index];
    this.setState({
      model,
      addModal: true,
    });
  }

  private onRemove = (id) => {
    const permissions: IPermission[] = this.state.permissions;
    this.permissionFactory.remove(id).then(() => {
      const index = _.findIndex(permissions, {
        _id: id,
      });
      if (index > -1) {
        permissions.splice(index, 1);
      }
      this.setState({
        permissions,
        model: this.emptyModel,
        addModal: false,
      });
      message.success(this.translator._getText('Permission successfully removed'));
    }).catch(() => {
      message.error(this.translator._getText('Can\'t remove permission!'));
    });
  }

  private submitCreatePermissionForm = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.toggleAddModal();
    const permissions: IPermission[] = this.state.permissions;
    if (this.state.model._id === '') {
      this.permissionFactory.create(this.state.model).then((data) => {
        permissions.push(data);
        this.setState({
          permissions,
          model: this.emptyModel,
          addModal: false,
        });
        message.success(this.translator._getText('Permission successfully created'));
      }).catch(() => {
        message.error(this.translator._getText('Can\'t create permission!'));
      });
    } else {
      this.permissionFactory.edit(this.state.model).then((data) => {
        const index = _.findIndex(permissions, {
          _id: data._id,
        });
        if (index > -1) {
          permissions[index] = data;
        }
        this.setState({
          permissions,
          model: this.emptyModel,
          addModal: false,
        });
        message.success(this.translator._getText('Permission successfully edited'));
      }).catch(() => {
        message.error(this.translator._getText('Can\'t edit permission!'));
      });
    }
  }

  private validateForm(model: IPermission) {
    if (model.code > 0 &&
      model.name.length > 0 &&
      model.translations[0].name.length > 0) {
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
      if (selector === 'code') {
        model[selector] = parseInt(e.target.value, 10);
      } else {
        model[selector] = e.target.value;
      }
    }
    this.setState({
      model,
    });
  }

  private beforeUploadLogo = (file: any) => {
    const isSVG = file.type === 'image/svg+xml';
    if (!isSVG) {
      message.error('You can only upload SVG file!');
    }
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      message.error('Image must smaller than 1MB!');
    }
    return isSVG && isLt1M;
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
      const permission = this.state.model;
      permission.icon = info.file.response.data.files[0];
      this.getBase64(info.file.originFileObj, (imageUrl) => this.setState({
        imageUrl,
        loading: false,
        model: permission,
      }));
    }
  }
  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof AdminPermission
   * @override
   * @generator
   */
  public render() {
    const validateForm = this.validateForm(this.state.model);
    const {imageUrl} = this.state;
    const tabs = {};
    const uploadButton = (
      <div>
        {this.state.loading && <Loading active={true}/>}
        {!this.state.loading && <IcoN name="cross24" size={24}/>}
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    tabs[this.translator._getText('English')] = (
      <div key="English">
        <input name="name_en" type="text" placeholder={this.translator._getText('Permission name...')}
               onChange={this.bindInputToModel.bind(this, 'name')} value={this.state.model.name}/>
        <textarea name="des_en" placeholder={this.translator._getText('Permission description...')}
                  onChange={this.bindInputToModel.bind(this, 'desc')} value={this.state.model.desc}/>
      </div>
    );
    tabs[this.translator._getText('Persian')] = (
      <div key="Persian">
        <input name="name_fa" dir="rtl" type="text" placeholder={this.translator._getText('نام دسترسی...')}
               onChange={this.bindInputToModel.bind(this, {name: 'translations[]name', index: 0})}
               value={this.state.model.translations[0].name}/>
        <textarea name="des_fa" dir="rtl" placeholder={this.translator._getText('توضیح دسترسی...')}
                  onChange={this.bindInputToModel.bind(this, {name: 'translations[]desc', index: 0})}
                  value={this.state.model.translations[0].desc}/>
      </div>
    );
    return (
      <div className="admin-wrapper">
        <div className="permissions-scene">
          <Affixer offsetTop={72} zIndex={4} height={80}>
            <div className="page-buttons">
              <h2><Translate>Permission Management</Translate></h2>
            </div>
          </Affixer>
          <a className="add" onClick={this.toggleAddModal}>
            <IcoN name="cross24" size={24}/>
            <span>Add a permission control</span>
          </a>
          <ul className="permissions-list admin-list">
            {this.state.permissions.map((permission) => (
              <li key={permission._id}>
                <div className="per-icon">
                  <IcoN name="filter16" size={16}/>
                </div>
                <div className="per-info">
                  <h4>{permission.name}</h4>
                  <p>{permission.desc}</p>
                </div>
                <div className="edit-button" onClick={this.onEdit.bind(this, permission._id)}>
                  <IcoN name="pencil24" size={24}/>
                </div>
                <Popconfirm title="Are you sure about removing this Permission?"
                            onConfirm={this.onRemove.bind(this, permission._id)}
                            okText="Yes" cancelText="No">
                  <div className="remove-button">
                    <IcoN name="negativeXCross24" size={24}/>
                  </div>
                </Popconfirm>
              </li>
            ))}
          </ul>
        </div>
        <Modal
          title="Add or edit a permission"
          wrapClassName="vertical-center-modal"
          width="466px"
          visible={this.state.addModal}
          onCancel={this.toggleAddModal}
          footer={[
            <button key="back" className="butn secondary" onClick={this.toggleAddModal}>
              <Translate>Cancel</Translate>
            </button>,
            <button key="submit" className="butn butn-primary" onClick={this.submitCreatePermissionForm}
                    disabled={!validateForm}>
              {this.state.model._id === '' &&
              <Translate>Add</Translate>}
              {this.state.model._id !== '' &&
              <Translate>Edit</Translate>}
            </button>,
          ]}
        >
          <div className="add-permission-modal">
            <input type="number" placeholder={this.translator._getText('Permission Value')}
                   onChange={this.bindInputToModel.bind(this, 'code')} value={this.state.model.code}/>
            <div className="_df">
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={this.beforeUploadLogo}
                onChange={this.logoChangeHandler}
                customRequest={this.customRequest}
              >
                {imageUrl ? <img src={imageUrl} alt=""/> : uploadButton}
              </Upload>
              <form onSubmit={this.submitCreatePermissionForm}>
                <Tab items={tabs}/>
                <button className="hidden-submit" type="submit" disabled={!validateForm}/>
              </form>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default AdminPermission;
