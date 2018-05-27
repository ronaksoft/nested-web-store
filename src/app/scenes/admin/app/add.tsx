import * as React from 'react';
import {connect} from 'react-redux';
import {Translate, Tab, Loading, IcoN, Affixer, RichEditor, NstCrop} from 'components';
import {Upload, message, Modal} from 'antd';
import {EditorState, convertFromHTML, ContentState} from 'draft-js';
import Select from 'react-select';
import {
  file as FileFactory,
  app as AppFactory,
  category as CategoryFactory,
  permission as PermissionFactory,
} from 'api';
import {
  IApplication, ISelectOption, IFile, ICategory, IPermission,
  IApplicationValidation, IUser,
} from 'api/interfaces';
import Const from 'api/consts/CServer';
import {REGEX} from 'api/consts/CRegex';
import * as _ from 'lodash';
import {AppView} from 'scenes';
import {stateToHTML} from 'draft-js-export-html';
import {browserHistory} from 'react-router';

interface IOwnProps {
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

interface IProps {
  user: IUser;
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
  app: IApplication;
  appValidation: IApplicationValidation;
  loading: boolean;
  cropIndex: number;
  editorStateFa: any;
  editorStateEn: any;
  pickedImage: any;
  preview: boolean;
  previewModel: IApplication;
  imageUrl: string;
  categories: ISelectOption[];
  languages: ISelectOption[];
  permissions: ISelectOption[];
  selectedCategories: ISelectOption[];
  selectedStatus: ISelectOption;
  selectedLanguages: ISelectOption[];
  selectedPermissions: ISelectOption[];
  croppedFiles: File[];
  base64Files: any[];
  showCropModalCounter: number;
  user: IUser;
}

class AdminAddApp extends React.Component<IProps, IState> {
  private translator: Translate;
  private customRequest: any;
  private appFactory: AppFactory;
  private fileFactory: FileFactory;
  private categoryFactory: CategoryFactory;
  private permissionFactory: PermissionFactory;
  private emptyModel: IApplication;
  private originalFiles: File[] = [];
  private statuses: ISelectOption[] = [];
  private categories: ICategory[] = [];
  private permissions: IPermission[] = [];

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
    const state: IState = {
      loading: false,
      preview: false,
      cropIndex: null,
      previewModel: null,
      imageUrl: '',
      selectedCategories: [],
      selectedStatus: {value: '', label: ''},
      croppedFiles: [],
      base64Files: [],
      showCropModalCounter: 0,
      selectedLanguages: [],
      selectedPermissions: [],
      categories: [],
      permissions: [],
      pickedImage: '',
      editorStateFa: EditorState.createEmpty(), // this.state.app.desc
      editorStateEn: EditorState.createEmpty(), // this.state.app.translations[0].desc
      languages: [
        {
          label: 'Farsi',
          value: 'fa',
        },
        {
          label: 'English',
          value: 'en',
        },
      ],
      app: _.cloneDeep(this.emptyModel),
      appValidation: this.resetValidation(),
      user: this.props.user,
    };
    this.state = state;
    this.appFactory = new AppFactory();
    this.fileFactory = new FileFactory();
    this.categoryFactory = new CategoryFactory();
    this.permissionFactory = new PermissionFactory();
    this.customRequest = this.fileFactory.customRequest.bind(this);
    this.statuses = [
      {
        value: '1',
        label: 'Publish',
      }, {
        value: '2',
        label: 'Pending',
      }, {
        value: '3',
        label: 'Suspend',
      }, {
        value: '4',
        label: 'Decline',
      },
    ];
    // EditorState.createWithContent(ContentState.createFromBlockArray(
    //     convertFromHTML(props.message.body).contentBlocks,
    //     convertFromHTML(props.message.body).entityMap
    // ))
  }

  private resetValidation = () => {
    const appV = {};
    Object.keys(_.cloneDeep(this.emptyModel)).forEach((key) => {
      appV[key] = {
        isValid: true,
        message: '',
      };
    });
    return _.cloneDeep(appV) as IApplicationValidation;
  }

  public componentDidMount() {
    const promises = [];
    promises.push(this.categoryFactory.getAll());
    promises.push(this.permissionFactory.getAll());
    Promise.all(promises).then((data) => {
      if (data[0] !== null) {
        this.categories = data[0];
        const categories: ISelectOption[] = data[0].map((category) => {
          return {
            value: category._id,
            label: category.name,
          };
        });
        this.setState({
          categories,
        });
      }
      if (data[1] !== null) {
        this.permissions = data[1];
        const permissions: ISelectOption[] = data[1].map((permission) => {
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
    }).then(() => {
      if (this.props.location.pathname.indexOf('/admin/app/edit/') > -1 && this.props.routeParams.id) {
        this.appFactory.getById(this.props.routeParams.id).then((data) => {
          this.fillModel(data);
        }).catch((e) => {
          console.log(e);
          message.error(this.translator._getText('Can\'t fetch application!'));
        });
      }
    });
    window.addEventListener('reactTranslateChangeLanguage', this.updateLang);
  }

  public componentWillUnmount() {
    window.removeEventListener('reactTranslateChangeLanguage', this.updateLang);
  }

  public componentWillReceiveProps(newProps) {
    this.setState({
      user: newProps.user,
    });
  }

  private updateLang = () => {
    setTimeout(() => {
      this.translator = new Translate();
      this.forceUpdate();
    }, 100);
  }

  private fillModel(data: IApplication) {
    data = _.merge(this.emptyModel, _.omitBy(data, _.isNull));
    const selectedStatus: ISelectOption = {
      value: `${data.status}`,
      label: `${this.statuses[data.status - 1].label}`,
    };
    let selectedCategories: ISelectOption[] = [];
    if (data.categories) {
      selectedCategories = data.categories.map((item): ISelectOption => {
        return {
          value: item._id,
          label: item.name,
        };
      });
    }
    let selectedPermissions: ISelectOption[] = [];
    if (data.permissions) {
      selectedPermissions = data.permissions.map((item): ISelectOption => {
        return {
          value: item._id,
          label: item.name,
          data: item,
        };
      });
    }
    let selectedLanguages: ISelectOption[] = [];
    if (data.lang) {
      selectedLanguages = data.lang.map((item): ISelectOption => {
        return {
          value: item,
          label: item,
        };
      });
    }
    let editorStateEn = this.state.editorStateEn;
    if (data.desc) {
      const blocksFromHTMLEn = convertFromHTML(data.desc || '');
      editorStateEn = EditorState.createWithContent(ContentState.createFromBlockArray(
        blocksFromHTMLEn.contentBlocks,
        blocksFromHTMLEn.entityMap,
      ));
    }
    let editorStateFa = this.state.editorStateFa;
    if (data.translations[0] && data.translations[0].desc && data.translations[0].desc !== '<p><br></p>') {
      const blocksFromHTMLFa = convertFromHTML(data.translations[0].desc || '');
      editorStateFa = EditorState.createWithContent(ContentState.createFromBlockArray(
        blocksFromHTMLFa.contentBlocks,
        blocksFromHTMLFa.entityMap,
      ));
    }
    // this.getBase64().then((res) => {
    //   console.log(res);
    // });
    this.setState({
      app: data,
      editorStateEn,
      editorStateFa,
      selectedPermissions,
      selectedCategories,
      selectedLanguages,
      selectedStatus,
    });
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

  private picturesChangeHandler = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({loading: true});
      return;
    }
    if (info.file.status === 'done') {
      const app = this.state.app;
      app.screenshots.push(info.file.response.data.files[0]);
      this.setState({
        app,
      });
    }
  }

  private beforeUploadPictures = (file: any) => {
    const isValid = (['image/png', 'image/jpg', 'image/jpeg'].indexOf(file.type) > -1);
    if (!isValid) {
      message.error('You can only upload PNG and JPG file!');
    }
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      message.error('Image must smaller than 1MB!');
    }
    if (isValid && isLt1M) {
      this.originalFiles.push(file);
      this.getBase64(file).then((base64) => {
        this.setState({
          croppedFiles: [...this.state.croppedFiles, file],
          base64Files: [...this.state.base64Files, base64],
        });
      });
    }
    return false;
  }

  private bindInputToModel(selector: any, e: any) {
    const model = this.state.app;
    if (typeof selector === 'object') {
      const elem = selector.name.split('[]');
      model[elem[0]][selector.index][elem[1]] = e.target.value;
    } else {
      if (selector === 'app_id') {
        model[selector] = model[selector].toLowerCase().split(' ').join('_');
      }
      model[selector] = e.target.value;
    }
    this.setState({
      app: model,
    });
  }

  private removePictures(index) {
    const app = this.state.app;
    app.screenshots.splice(index, 1);
    this.setState({
      app,
    });
  }

  private removeCropPictures(index) {
    this.originalFiles.splice(index);
    const croppedFiles = this.state.croppedFiles;
    croppedFiles.splice(index, 1);
    this.setState({
      croppedFiles,
    });
  }

  private removePermission(index) {
    const selectedPermissions = this.state.selectedPermissions;
    selectedPermissions.splice(index, 1);
    this.setState({
      selectedPermissions,
    });
  }

  private preview = () => {
    if (!this.state.preview) {
      this.getModel(true, this.state.croppedFiles).then((model) => {
        this.setState({
          preview: true,
          previewModel: model,
        });
      });
    } else {
      this.setState({
        preview: false,
      });
    }
  }

  private getModel(details: boolean, files: any[]): Promise<IApplication> {
    return new Promise((resolve) => {
      const model: IApplication = _.cloneDeep(this.state.app);
      model.lang = this.state.selectedLanguages.map((lang) => lang.value);
      model.desc = stateToHTML(this.state.editorStateEn.getCurrentContent());
      model.translations[0].desc = stateToHTML(this.state.editorStateFa.getCurrentContent());
      if (!details) {
        if (model.logo) {
          model.logo = {_id: model.logo._id};
        }
        const defFiles = model.screenshots = model.screenshots.map((file): IFile => {
          return {_id: file._id};
        });
        if (files.length > 0) {
          model.screenshots = files.map((val): IFile => {
            return {_id: val._id};
          });
          model.screenshots = [...defFiles, ...model.screenshots];
        } else {
          model.screenshots = defFiles;
        }
        model.categories = this.state.selectedCategories.map((category) => {
          return {
            _id: category.value,
            slug: _.find(this.categories, {_id: category.value}).slug,
          };
        });
        model.permissions = this.state.selectedPermissions.map((permission) => {
          return {_id: permission.value};
        });
        resolve(model);
      } else {
        model.categories = this.state.selectedCategories.map((category) => {
          return _.find(this.categories, {_id: category.value});
        });
        model.permissions = this.state.selectedPermissions.map((permission) => {
          return _.find(this.permissions, {_id: permission.value});
        });
        if (files.length > 0) {
          const promises = [];
          files.forEach((file) => {
            promises.push(this.getBase64(file));
          });
          Promise.all(promises).then((base64s) => {
            model.screenshots = base64s.map((base64) => {
              return {
                _id: _.uniqueId(),
                path: base64,
                name: 'temp',
                tmp: true,
              };
            });
            model.screenshots = [...this.state.app.screenshots, ...model.screenshots];
            resolve(model);
          });
        } else {
          resolve(model);
        }
      }
    });
  }

  private uploadScreenShots = (): Promise<any> => {
    if (this.state.croppedFiles.length === 0) {
      return Promise.resolve([]);
    }
    const data = new FormData();
    this.state.croppedFiles.forEach((file) => {
      data.append(_.uniqueId('file-'), file, file.name);
    });
    return this.fileFactory.create(data);
  }

  private onSubmit = () => {
    const appValidation = this.checkValidation();
    if (
      Object.keys(appValidation)
        .map((key) => appValidation[key].isValid)
        .filter((isValid) => !isValid)
        .length > 0) {
      return;
    }
    let loadingMessage = null;
    if (this.state.croppedFiles.length !== 0) {
      loadingMessage = message.loading(this.translator._getText('Files are being uploaded...'), 10000);
    }
    this.uploadScreenShots().then((files) => {
      loadingMessage();
      return this.getModel(false, files);
    }).then((model) => {
      if (model._id.length === 24) {
        this.appFactory.edit(model).then(() => {
          message.success(this.translator._getText('Application successfully edited'));
        }).catch((error) => {
          message.error(this.translator._getText('Can\'t edit the Application!'));
          message.error(error);
        });
      } else {
        this.appFactory.create(model).then(() => {
          message.success(this.translator._getText('Application successfully created'));
          browserHistory.push('/admin/app');
        }).catch((error) => {
          message.error(this.translator._getText('Can\'t create the Application!'));
          message.error(error);
        });
      }
    });
  }

  public handleSelectChangeStatus = (selectedStatus: ISelectOption) => {
    this.setAppStatus(parseInt(selectedStatus.value, 10));
    this.setState({
      selectedStatus,
    });
  }

  public handleSelectChangeCategories = (selectedCategories) => {
    this.setState({
      selectedCategories,
    });
  }

  public handleSelectChangeLanguage = (selectedLanguages) => {
    this.setState({
      selectedLanguages,
    });
  }

  public handleSelectChangePermission = (selectedPermission) => {
    selectedPermission.data = _.find(this.permissions, {_id: selectedPermission.value});
    this.setState({
      selectedPermissions: [...this.state.selectedPermissions, selectedPermission],
    });
  }

  private onChangeEnglishDesc = (editorStateEn: EditorState) => {
    this.setState({editorStateEn});
  }

  private onChangeFarsiDesc = (editorStateFa: EditorState) => {
    this.setState({editorStateFa});
  }

  private onCropped = (file: any) => {
    const croppedFiles = this.state.croppedFiles;
    const base64Files = this.state.base64Files;
    croppedFiles[this.state.cropIndex] = file;
    this.getBase64(file).then((base64) => {
      base64Files[this.state.cropIndex] = base64;
      this.setState({
        croppedFiles,
        base64Files,
      });
    });
  }

  private cropImage = (index: number) => {
    if (index === this.state.cropIndex) {
      return this.setState({
        showCropModalCounter: this.state.showCropModalCounter + 1,
      });
    }
    this.setState({
      cropIndex: index,
      pickedImage: this.originalFiles[index],
    });
  }

  public getPermissions() {
    return _.differenceBy(this.state.permissions, this.state.selectedPermissions, '_id');
  }

  public checkValidation = () => {
    const model = this.state.app;
    model.desc = stateToHTML(this.state.editorStateEn.getCurrentContent());
    model.translations[0].desc = stateToHTML(this.state.editorStateFa.getCurrentContent());
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

    if (!model.summary) {
      appValidation.summary = {
        isValid: false,
        message: 'required',
      };
    } else if (model.summary.trim().length < 10) {
      appValidation.summary = {
        isValid: false,
        message: 'App summary is too short !',
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

    if (this.state.selectedCategories.length === 0) {
      appValidation.categories = {
        isValid: false,
        message: 'you must choose at least a category',
      };
    }

    if (this.state.selectedLanguages.length === 0) {
      appValidation.lang = {
        isValid: false,
        message: 'you must choose at least a language',
      };
    }

    if (_.some(this.state.selectedLanguages, {value: 'fa'})) {
      if (!model.translations[0]) {
        appValidation.translations = {
          isValid: false,
          message: 'required',
        };
      } else if (!model.translations[0].name) {
        appValidation.translations = {
          isValid: false,
          message: 'please fill Farsi name of your application',
        };
      }
    }

    if (!model.app_id) {
      appValidation.app_id = {
        isValid: false,
        message: 'please fill app id',
      };
    } else if (!model.app_id.match(REGEX.APP_ID)) {
      appValidation.app_id = {
        isValid: false,
        message: 'app id contains disallowed characters',
      };
    } else {
      if (!this.state.appValidation.app_id.isValid &&
        this.state.appValidation.app_id.message === 'App Id\'s already taken!') {
        // 'App Id Already taken!'
        appValidation.app_id = this.state.appValidation.app_id;
      }
    }
    this.setState({appValidation});
    return appValidation;
  }

  private appIdKeyUp = (event) => {
    this.checkAppIdDebounced(event.target.value);
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

  private setAppStatus = (status: number) => {
    let app = this.state.app;
    const prvStatus = app.status;
    app.status = status;
    this.setState({app});
    if (!this.props.routeParams.id) {
      return;
    }
    this.appFactory.setStatus(this.props.routeParams.id, status).then().catch(() => {
      app = this.state.app;
      app.status = prvStatus;
      this.setState({app});
    });
  }

  private checkAppIdDebounced = _.debounce(this.checkAppId, 512);

  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof AdminAddApp
   * @override
   * @generator
   */
  public render() {
    const {imageUrl, appValidation} = this.state;
    const errors = Object.keys(appValidation)
      .map((key) => appValidation[key].message)
      .filter((message) => message && message !== 'required');
    const permissions = this.getPermissions();
    const uploadButton = (
      <div>
        {this.state.loading && <Loading active={true}/>}
        {!this.state.loading && <IcoN name="cross24" size={24}/>}
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const informationTabs = {};
    informationTabs[this.translator._getText('English')] = (
      <div className="app-translations">
        <input type="text" placeholder={this.translator._getText('App name (eng)')} value={this.state.app.name}
               onChange={this.bindInputToModel.bind(this, 'name')}
               className={!appValidation.name.isValid ? 'has-error' : ''}/>
        <RichEditor initialState={this.state.editorStateEn} onStateChange={this.onChangeEnglishDesc}
                    placeholder={this.translator._getText('Description (eng)')} textAlignment={'left'}/>
      </div>
    );
    informationTabs[this.translator._getText('Persian')] = (
      <div className="app-translations">
        <input type="text" dir="rtl" placeholder="نام اپلیکیشن (فارسی)" value={this.state.app.translations[0].name}
               onChange={this.bindInputToModel.bind(this, {name: 'translations[]name', index: 0})}
               className={!appValidation.translations.isValid ? 'has-error' : ''}/>
        <RichEditor initialState={this.state.editorStateFa} onStateChange={this.onChangeFarsiDesc}
                    placeholder="توضیحات (فارسی)" textAlignment={'right'}/>
      </div>
    );
    const tabs = {};
    tabs[this.translator._getText('App info')] = (
      <div className="add-app">
        {this.state.app.status === 4 && (
          <p className="error-message">
            <IcoN name="alertRed24" size={24}/>
            <Translate>
              Your app has been declined because of our <a>terms &amp; conditions</a> are being violated.
            </Translate>
          </p>
        )}
        <p><Translate>
          Add your developed app by filling these fields and helping users find your app better.
        </Translate></p>
        <h4><Translate>App user ID &amp; Logo</Translate></h4>
        <div className="form-row _df">
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={this.beforeUploadLogo}
            onChange={this.logoChangeHandler}
            customRequest={this.customRequest}
          >
            {imageUrl ? <img src={imageUrl} alt=""/> : this.state.app.logo ?
              <img src={Const.SERVER_URL + this.state.app.logo.path} alt=""/> : uploadButton}
          </Upload>
          <div className="multi-input-row">
            <input type="text" placeholder={this.translator._getText('App ID')} value={this.state.app.app_id}
                   onChange={this.bindInputToModel.bind(this, 'app_id')}
                   onKeyUp={this.appIdKeyUp} pattern={REGEX.APP_ID}
                   className={!appValidation.app_id.isValid ? 'has-error' : ''}/>
            <input type="url" placeholder={this.translator._getText('Owner URL')} value={this.state.app.website}
                   onChange={this.bindInputToModel.bind(this, 'website')} autoComplete="website"
                   className={!appValidation.website.isValid ? 'has-error' : ''}
                   pattern={REGEX.URL}/>
          </div>
        </div>
        <input type="text"
               placeholder={this.translator._getText('Summery (open graph)')} value={this.state.app.summary}
               onChange={this.bindInputToModel.bind(this, 'summary')}
               className={!appValidation.summary.isValid ? 'form-row form-block has-error' : 'form-row form-block'}/>
        <h4><Translate>Information</Translate></h4>
        <div>
          <Tab items={informationTabs}/>
        </div>
        <h4><Translate>Category</Translate></h4>
        <div className={!appValidation.categories.isValid ? 'form-row has-error' : 'form-row'}>
          <Select
            isMulti={true}
            onChange={this.handleSelectChangeCategories}
            options={this.state.categories}
            placeholder={this.translator._getText('Select from the list of categories')}
            removeSelected={true}
            rtl={true}
            simpleValue={true}
            className="multi-selector"
            value={this.state.selectedCategories}
          />
        </div>
        <h4><Translate>Languages</Translate></h4>
        <div className={!appValidation.lang.isValid ? 'form-row has-error' : 'form-row'}>
          <Select
            name="language"
            isMulti={true}
            onChange={this.handleSelectChangeLanguage}
            options={this.state.languages}
            placeholder={this.translator._getText('Select your app languages')}
            removeSelected={true}
            rtl={true}
            simpleValue={true}
            className="multi-selector"
            value={this.state.selectedLanguages}
          />
        </div>
      </div>
    );
    tabs[this.translator._getText('Pictures')] = (
      <div className="add-app">
        <p><Translate>
          Add your developed app by filling these fields and helping users find your app better.
        </Translate></p>
        <h4><Translate>Screenshots &amp; Pictures</Translate></h4>
        <div className="images-container">
          {this.state.app.screenshots.map((val, index) => {
            return (
              <div key={index} className="image-handler">
                <img src={Const.SERVER_URL + val.path} alt=""/>
                <div className="image-buttons">
                  <div onClick={this.removePictures.bind(this, index)}>
                    <IcoN name="xcross16Red" size={16}/>
                  </div>
                </div>
              </div>
            );
          })}
          {this.state.base64Files.map((val, index) => {
            return (
              <div key={index} className="image-handler">
                <img src={val} alt=""/>
                <div className="image-buttons">
                  <div onClick={this.removeCropPictures.bind(this, index)}>
                    <IcoN name="xcross16Red" size={16}/>
                  </div>
                  <div onClick={this.cropImage.bind(this, index)}>
                    <IcoN name="pencil16" size={16}/>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="upload-box">
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={this.beforeUploadPictures}
              multiple={true}
              onChange={this.picturesChangeHandler}
              customRequest={this.customRequest}
            >
              <div className="ant-upload-text">+<br/>Add photo</div>
            </Upload>
          </div>
        </div>
      </div>
    );
    tabs[this.translator._getText('Permissions')] = (
      <div className="add-app">
        <p><Translate>
          Add your developed app by filling these fields and helping users find your app better.
        </Translate></p>
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
      </div>
    );
    return (
      <div className="admin-wrapper add-app-scene">
        <Affixer offsetTop={72} zIndex={4} height={80}>
          <div className="page-buttons">
            <h2><Translate>Add an app to the market</Translate></h2>
            {this.state.app._id && this.state.user.admin && (
              <div className={'form-row app-status-selector status-' + this.state.selectedStatus.value}>
                <Select
                  isMulti={false}
                  onChange={this.handleSelectChangeStatus}
                  options={this.statuses}
                  placeholder={this.translator._getText('Status')}
                  removeSelected={false}
                  rtl={true}
                  disabled={true}
                  simpleValue={true}
                  className="multi-selector"
                  value={this.state.selectedStatus}
                />
              </div>
            )}
            {this.state.app._id && !this.state.user.admin && (
              <div className={'form-row app-status-selector status-' + this.state.selectedStatus.value}>
                <div className="multi-selector">
                  <div className="multi-selector__control">
                    <div className="multi-selector__value-container multi-selector__value-container--hasValue">
                      <div className="multi-selector__single-value">
                        {this.state.selectedStatus.label}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {this.state.app._id && this.state.app.status === 3 && (
              <div className="butn butn-red"><Translate>Declined</Translate></div>
            )}
            <button className="butn butn-blue secondary" onClick={this.preview}>
              <Translate>Preview</Translate>
            </button>
            <button className="butn butn-primary" onClick={this.onSubmit}>
              {this.state.app._id === '' &&
              <Translate>Submit</Translate>}
              {this.state.app._id !== '' &&
              <Translate>Apply</Translate>}
            </button>
          </div>
        </Affixer>
        <ul className="errors">
          {errors.map((err, index) => <li key={index}>{err}</li>)}
        </ul>
        <Tab items={tabs}/>
        <Modal
          title="test"
          wrapClassName="vertical-center-modal"
          width="90%"
          visible={this.state.preview}
          onOk={this.preview}
          onCancel={this.preview}
        >
          <AppView app="test" preview={true} model={this.state.previewModel}/>
        </Modal>
        <NstCrop avatar={this.state.pickedImage} forceUpdateCounter={this.state.showCropModalCounter}
                onCropped={this.onCropped}/>
      </div>
    );
  }
}

/**
 * redux store mapper
 * @param {any} store store
 * @param {IOwnProps} props
 * @returns store item object
 */
const mapStateToProps = (store, props: IOwnProps): IProps => ({
  user: store.app.user,
  app: props.app,
  routeParams: props.routeParams,
  location: props.location,
});

export default connect(mapStateToProps, {})(AdminAddApp);
