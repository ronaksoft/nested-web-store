import * as React from 'react';
import {Translate, Loading, IcoN, RichEditor} from 'components';
import {Config} from 'api/consts/CServer';
import Select from 'react-select';
import {EditorState} from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';
import {file as FileFactory, app as AppFactory, permission as PermissionFactory} from 'api';
import {Upload, message} from 'antd';
import {REGEX} from 'api/consts/CRegex';
import {debounce, cloneDeep, find, differenceBy} from 'lodash';
import {browserHistory} from 'react-router';

import {IApplication, ISelectOption, IApplicationValidation, IPermission} from 'api/interfaces';

interface IState {
  step: number;
  imageUrl: string;
  editorStateEn: any;
  created: boolean;
  agreement: boolean;
  loading: boolean;
  app: IApplication;
  permissions: ISelectOption[];
  selectedPermissions: ISelectOption[];
  appValidation: IApplicationValidation;
}

class Developer extends React.Component<any, IState> {
  private translator: Translate;
  private appFactory: AppFactory;
  private fileFactory: FileFactory;
  private customRequest: any;
  private emptyModel: IApplication;
  private permissionFactory: PermissionFactory;
  private permissions: IPermission[] = [];

  /**
   * @constructor
   * Creates an instance of Sidebar.
   * @param {ISidebarProps} props
   * @memberof Main
   */
  constructor(props: any) {
    super(props);
    this.emptyModel = {
      _id: '',
      app_id: '',
      logo: null,
      name: '',
      desc: '',
      summary: '',
      screenshots: [],
      website: '',
      categories: [],
      translations: [{
        locale: 'fa',
        name: '',
        desc: '',
      }],
      permissions: [],
      official: false,
      starred: false,
      status: 0,
      lang: [],
    };
    this.state = {
      app: cloneDeep(this.emptyModel),
      selectedPermissions: [],
      permissions: [],
      step: 1,
      created: false,
      agreement: false,
      loading: false,
      appValidation: this.resetValidation(),
      editorStateEn: EditorState.createEmpty(), // this.state.app.translations[0].desc
      imageUrl: '',
    };
    this.translator = new Translate();
    this.appFactory = new AppFactory();
    this.fileFactory = new FileFactory();
    this.permissionFactory = new PermissionFactory();
    this.customRequest = this.fileFactory.customRequest.bind(this);
  }

  private resetValidation = () => {
    const appV = {};
    Object.keys(cloneDeep(this.emptyModel)).forEach((key) => {
      appV[key] = {
        isValid: true,
        message: '',
      };
    });
    return cloneDeep(appV) as IApplicationValidation;
  }

  public componentDidMount() {
    this.permissionFactory.getAll().then((data) => {
      if (data !== null) {
        this.permissions = data;
        const permissions: ISelectOption[] = data.map((permission) => {
          return {
            value: permission._id,
            label: permission.name,
          };
        });
        this.setState({
          permissions,
        });
      }
    }).catch(() => {
      message.error(this.translator._getText('Can\'t init data!'));
    });

    window.addEventListener('reactTranslateChangeLanguage', this.updateLang);
  }

  public checkValidation = () => {
    const model = this.state.app;
    model.desc = stateToHTML(this.state.editorStateEn.getCurrentContent());
    const appValidation = this.resetValidation();
    if (!model.website) {
      appValidation.website = {
        isValid: false,
        message: 'required',
      };
    } else if (!model.website.match(REGEX.URL)) {
      appValidation.website = {
        isValid: false,
        message: 'invalid',
      };
    }

    if (!model.app_id) {
      appValidation.app_id = {
        isValid: false,
        message: 'required',
      };
    }

    if (!model.name) {
      appValidation.name = {
        isValid: false,
        message: 'required',
      };
    } else if (model.name.length < 3) {
      appValidation.name = {
        isValid: false,
        message: 'you app name is too short',
      };
    }

    if (!model.desc) {
      appValidation.desc = {
        isValid: false,
        message: 'required',
      };
    } else if (model.desc.length < 12) {
      appValidation.desc = {
        isValid: false,
        message: 'you app descriptions is too short',
      };
    }

    // if (!model.screenshots) {
    //   appValidation.screenshots = {
    //     isValid: false,
    //     message: 'required',
    //   };
    // } else if (model.screenshots.length === 0) {
    //   appValidation.screenshots = {
    //     isValid: false,
    //     message: 'you must upload at least one screenshot of your app',
    //   };
    // }

    if (this.state.selectedPermissions.length === 0) {
      appValidation.permissions = {
        isValid: false,
        message: 'you must choose at least one permission',
      };
    }

    if (!model.logo) {
      appValidation.logo = {
        isValid: false,
        message: 'required',
      };
    }

    if (!this.state.appValidation.app_id.isValid &&
      this.state.appValidation.app_id.message === 'App Id\'s already taken!') {
      // 'App Id Already taken!'
      appValidation.app_id = this.state.appValidation.app_id;
    }

    this.setState({appValidation});
    return appValidation;
  }

  private onSubmit = () => {
    const appValidation = this.checkValidation();
    const model = this.state.app;
    console.log(appValidation, model);
    if (
      Object.keys(appValidation)
        .map((key) => appValidation[key].isValid)
        .filter((isValid) => !isValid)
        .length > 0) {
      return;
    }
    model.permissions = this.state.selectedPermissions.map((permission) => {
      return {_id: permission.value};
    });
    return this.appFactory.create(model).then(() => {
      message.success(this.translator._getText('Application successfully created'));
      this.setState({
        created: true,
      }, this.goStepThree);
    }).catch((error) => {
      message.error(this.translator._getText('Can\'t create the Application!'));
      message.error(error);
    });
  }

  public componentWillUnmount() {
    window.removeEventListener('reactTranslateChangeLanguage', this.updateLang);
  }

  private beforeUploadLogo = (file: any) => {
    const isPNG = file.type === 'image/png';
    if (!isPNG) {
      message.error('You can only upload PNG file!');
    }
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      message.error('Image must smaller than 1MB!');
    }
    return isPNG && isLt1M;
  }

  private getBase64 = (img: any): Promise<any> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result));
      reader.readAsDataURL(img);
    });
  }

  private logoChangeHandler = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({loading: true});
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      const app = this.state.app;
      app.logo = info.file.response.data.files[0];
      this.getBase64(info.file.originFileObj).then((imageUrl) => {
        this.setState({
          imageUrl,
          loading: false,
          app,
        });
      });
    }
  }

  public handleSelectChangePermission = (selectedPermission) => {
    selectedPermission.data = find(this.permissions, {_id: selectedPermission.value});
    this.setState({
      selectedPermissions: [...this.state.selectedPermissions, selectedPermission],
    });
  }

  private updateLang = () => {
    setTimeout(() => {
      this.translator = new Translate();
      this.forceUpdate();
    }, 100);
  }

  private goStepFirst = () => {
    this.setState({step: 1});
  }

  private goStepSecond = () => {
    if (this.state.agreement) {
      this.setState({step: 2});
    }
  }

  private goStepThree = () => {
    if (this.state.created) {
      this.setState({step: 3});
    }
  }

  private goMoreSetting = () => {
    browserHistory.push(`/admin/app/edit/${this.state.app.app_id}`);
  }

  private onChangeEnglishDesc = (editorStateEn: EditorState) => {
    this.setState({editorStateEn});
  }

  private bindInputToModel(selector: any, e: any) {
    const model = this.state.app;
    if (typeof selector === 'object') {
      const elem = selector.name.split('[]');
      model[elem[0]][selector.index][elem[1]] = e.target.value;
    } else {
      if (selector === 'name') {
        model.app_id = e.target.value.replace(/\W/g, '_').toLowerCase();
      }
      if (selector === 'app_id') {
        model[selector] = model[selector].toLowerCase().split(' ').join('_');
      }
      model[selector] = e.target.value;
    }
    this.setState({
      app: model,
    });
  }

  private checkAppId = (id: string) => {
    return new Promise((resolve, reject) => {
      this.appFactory.appIdAvailable(id).then((isAvailable) => {
        const appValidation = this.state.appValidation;
        appValidation.app_id = {
          isValid: isAvailable,
          message: isAvailable ? '' : 'App Id Already taken!',
        };
        resolve(isAvailable);
        this.setState({appValidation});
      }).catch(reject);
    });
  }

  private checkAppIdDebounced = debounce(this.checkAppId, 512);

  private appIdKeyUp = (event) => {
    this.checkAppIdDebounced(event.target.value.replace(/\W/g, '_').toLowerCase());
  }

  private removePermission(index) {
    const selectedPermissions = this.state.selectedPermissions;
    selectedPermissions.splice(index, 1);
    this.setState({
      selectedPermissions,
    });
  }

  public getPermissions() {
    return differenceBy(this.state.permissions, this.state.selectedPermissions, '_id');
  }

  public acceptAgreement = () => {
    this.setState({
      agreement: true,
    }, () => {
      this.goStepSecond();
    });
  }

  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof Main
   * @override
   * @generator
   */
  public render() {
    const {step, imageUrl, appValidation} = this.state;
    const permissions = this.getPermissions();
    const uploadButton = (
      <div>
        {this.state.loading && <Loading active={true}/>}
        {!this.state.loading && <IcoN name="cross24" size={24}/>}
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="create-app-developer">
        <div className="create-app-header">
          <h1><Translate>Build your own application with just a few steps!</Translate></h1>
          <div className={'steps-path step' + step}>
            <div onClick={this.goStepFirst}>
              <a><Translate>License<br/>agreement</Translate></a>
            </div>
            <div onClick={this.goStepSecond}>
              <a><Translate>Basic<br/>Info</Translate></a>
            </div>
            <div onClick={this.goStepThree}>
              <a><Translate>Done!</Translate></a>
            </div>
          </div>
        </div>
        <div className="create-app-body">

          {step === 1 && <h2><Translate>Some words with the developers.</Translate></h2>}
          {step === 2 && <h2><Translate>Put the pieces together!.</Translate></h2>}
          {step === 3 && <h2><Translate>And, done!</Translate></h2>}

          {step === 1 && <div className="content">
            <h3><Translate>License agreement</Translate></h3>
            <p>License</p>
          </div>}
          {step === 2 && <div className="content">
            <Upload
              name="avatar"
              listType="picture-card"
              className={['avatar-uploader', !appValidation.logo.isValid ? 'has-error' : ''].join(' ')}
              showUploadList={false}
              beforeUpload={this.beforeUploadLogo}
              onChange={this.logoChangeHandler}
              customRequest={this.customRequest}
            >
              {imageUrl ? <img src={imageUrl} alt=""/> : this.state.app.logo ?
                <img src={Config().SERVER_URL + this.state.app.logo.path} alt=""/> : uploadButton}
            </Upload>
            <input type="text" placeholder={this.translator._getText('App name')} value={this.state.app.name}
                   onChange={this.bindInputToModel.bind(this, 'name')} onKeyUp={this.appIdKeyUp}
                   className={(!appValidation.name.isValid || !appValidation.app_id.isValid) ? 'has-error' : ''}/>
            <input type="url" placeholder={this.translator._getText('Owner URL')} value={this.state.app.website}
                   onChange={this.bindInputToModel.bind(this, 'website')} autoComplete="website"
                   className={!appValidation.website.isValid ? 'has-error' : ''}
                   pattern={REGEX.URL}/>
            <input type="text" placeholder={this.translator._getText('App ID')} value={this.state.app.app_id}
                   onChange={this.bindInputToModel.bind(this, 'app_id')}
                   onKeyUp={this.appIdKeyUp} pattern={REGEX.APP_ID} hidden={true}
                   className={!appValidation.app_id.isValid ? 'has-error' : ''}/>
            <div className={!appValidation.permissions.isValid ? 'form-row has-error' : 'form-row'}>
              <Select
                name="permission"
                onChange={this.handleSelectChangePermission}
                options={permissions}
                placeholder={this.translator._getText('Select from the list of permissions')}
                rtl={true}
                simpleValue={true}
                className="multi-selector"
                value={[]}
              />
            </div>
            <ul className="permissions-list admin-list">
              {this.state.selectedPermissions.map((permission, index) => {
                return (
                  <li key={'permission-' + index}>
                    <div className="per-icon">
                      <IcoN name="filter16" size={16}/>
                    </div>
                    <div className="per-info">
                      <h4>{permission.data.name}</h4>
                      <p>{permission.data.desc}</p>
                    </div>
                    <div className="per-remove" onClick={this.removePermission.bind(this, index)}>
                      <IcoN name="binRed24" size={24}/>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className={!appValidation.desc.isValid ? ' has-error' : ''}>
              <RichEditor initialState={this.state.editorStateEn} onStateChange={this.onChangeEnglishDesc}
                      placeholder={this.translator._getText('Description (eng)')} textAlignment={'left'}/>
            </div>
          </div>}
          {step === 3 && <div className="content app-created-view">
            <img src={Config().SERVER_URL + this.state.app.logo.path} alt=""/>
            <div className="app-data">
              <h4>{this.state.app.name}</h4>
              <p>{this.state.app.desc}</p>
              <a target="_blank" href={this.state.app.website}>{this.state.app.website}</a>
            </div>
          </div>}

          <div className="footer-buttons">
            {step === 1 && <button className="butn butn-primary" onClick={this.acceptAgreement}>
              <Translate>Accept</Translate>
            </button>}
            {step === 2 && <button className="butn butn-solid secondary" onClick={this.goStepFirst}>
              <Translate>Back</Translate>
            </button>}
            {step === 2 && <button className="butn butn-primary" onClick={this.onSubmit}>
              <Translate>Next</Translate>
            </button>}
            {step === 3 && <button className="butn butn-solid secondary" onClick={this.goStepSecond}>
              <Translate>Back</Translate>
            </button>}
            {step === 3 && <button className="butn butn-blue primary" onClick={this.goMoreSetting}>
              <Translate>More Settings</Translate>
            </button>}
            {step === 3 && <button className="butn butn-primary">
              <Translate>Done</Translate>
            </button>}
          </div>
        </div>
      </div>
    );
  }
}

export default Developer;
