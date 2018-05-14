import * as React from 'react';
import {Translate, Tab, Loading, IcoN, Affixer, RichEditor, NstCrop} from 'components';
import {Upload, message, Modal} from 'antd';
import {EditorState} from 'draft-js';
import Select from 'react-select';
import {
  file as FileFactory,
  app as AppFactory,
  category as CategoryFactory,
  permission as PermissionFactory,
} from 'api';
import {IApplication, ISelectOption} from 'api/interfaces';
// import Const from 'api/consts/CServer';
import {cloneDeep} from 'lodash';
import {AppView} from 'scenes';
import {stateToHTML} from 'draft-js-export-html';

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
  app: IApplication;
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
  selectedLanguages: ISelectOption[];
  selectedPermissions: ISelectOption[];
  croppedFiles: File[];
  base64Files: string[];
  showCropModalCounter: number;
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
      stared: false,
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
      app: cloneDeep(this.emptyModel),
    };
    this.state = state;
    this.appFactory = new AppFactory();
    this.fileFactory = new FileFactory();
    this.categoryFactory = new CategoryFactory();
    this.permissionFactory = new PermissionFactory();
    this.customRequest = this.fileFactory.customRequest.bind(this);
    // EditorState.createWithContent(ContentState.createFromBlockArray(
    //     convertFromHTML(props.message.body).contentBlocks,
    //     convertFromHTML(props.message.body).entityMap
    // ))
  }

  public componentDidMount() {
    this.categoryFactory.getAll().then((data) => {
      if (data == null) {
        return;
      }
      const categories: ISelectOption[] = data.map((category) => {
        return {
          value: category._id,
          label: category.name,
        };
      });
      this.setState({
        categories,
      });
    }).catch(() => {
      message.error(this.translator._getText('Can\'t fetch categories!'));
    });
    this.permissionFactory.getAll().then((data) => {
      if (data == null) {
        return;
      }
      const permissions: ISelectOption[] = data.map((permission) => {
        return {
          value: permission._id,
          label: permission.name,
        };
      });
      this.setState({
        permissions,
      });
    }).catch(() => {
      message.error(this.translator._getText('Can\'t fetch permissions!'));
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
      const app = this.state.app;
      app.logo = info.file.response.data.files[0];
      this.getBase64(info.file.originFileObj, (imageUrl) => this.setState({
        imageUrl,
        loading: false,
        app,
      }));
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
      this.getBase64(file, (base64) => {
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
      model[selector] = e.target.value;
    }
    this.setState({
      app: model,
    });
  }

  private bindDescriptionsToModel() {
    const model = this.state.app;
    model.desc = stateToHTML(this.state.editorStateEn.getCurrentContent());
    model.translations[0].desc = stateToHTML(this.state.editorStateFa.getCurrentContent());
  }

  private removePictures(index) {
    const app = this.state.app;
    app.screenshots.splice(index, 1);
    this.setState({
      app,
    });
  }

  private preview = () => {
    if (!this.state.preview) {
      this.setState({
        preview: true,
        previewModel: this.getModel(true),
      });
    } else {
      this.setState({
        preview: false,
      });
    }
  }

  private getModel(details: boolean): IApplication {
    const model: IApplication = cloneDeep(this.state.app);
    if (!details) {
      if (model.logo) {
        model.logo = {
          _id: model.logo._id,
        };
      }
      model.screenshots.forEach((val, index) => {
        model.screenshots[index] = {
          _id: val._id,
        };
      });
    }
    model.lang = this.state.selectedLanguages.map((lang) => lang.value);
    model.categories = this.state.selectedCategories.map((category) => {
      return {
        _id: category.value,
      };
    });
    model.permissions = this.state.selectedPermissions.map((permissions) => {
      return {
        _id: permissions.value,
      };
    });
    return model;
  }

  private onSubmit = () => {
    const model = this.getModel(false);
    this.bindDescriptionsToModel();
    this.appFactory.create(model).then(() => {
      message.success(this.translator._getText('Application successfully created'));
    }).catch((error) => {
      message.error(this.translator._getText('Can\'t create Application!'));
      message.error(error);
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

  public handleSelectChangePermission = (selectedPermissions) => {
    this.setState({
      selectedPermissions,
    });
  }

  private onChangeEnglishDesc = (editorStateEn: EditorState) => {
    this.setState({editorStateEn});
  }

  private onChangeFarsiDesc = (editorStateFa: EditorState) => {
    this.setState({editorStateFa});
  }

  private onCropped = (file: any) => {
    // const formData = new FormData();
    // formData.append('blob', file, file.name);
    const croppedFiles = this.state.croppedFiles;
    const base64Files = this.state.base64Files;
    croppedFiles[this.state.cropIndex] = file;
    this.getBase64(file, (base64) => {
      base64Files[this.state.cropIndex] = base64;
      this.setState({
        croppedFiles,
        base64Files,
      });
    });
    // todo : upload file
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
  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof AdminAddApp
   * @override
   * @generator
   */
  public render() {
    const {imageUrl} = this.state;
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
               onChange={this.bindInputToModel.bind(this, 'name')}/>
        <RichEditor initialState={this.state.editorStateEn} onStateChange={this.onChangeEnglishDesc}
          placeholder={this.translator._getText('Description (eng)')} textAlignment={'left'}/>
      </div>
    );
    informationTabs[this.translator._getText('Persian')] = (
      <div className="app-translations">
        <input type="text" dir="rtl" placeholder="نام اپلیکیشن (فارسی)" value={this.state.app.translations[0].name}
               onChange={this.bindInputToModel.bind(this, {name: 'translations[]name', index: 0})}/>
        <RichEditor initialState={this.state.editorStateFa} onStateChange={this.onChangeFarsiDesc}
          placeholder="توضیحات (فارسی)" textAlignment={'right'}/>
      </div>
    );
    const tabs = {};
    tabs[this.translator._getText('App info')] = (
      <div className="add-app">
        <p><Translate>
          Add your developed app by filling these fields and helping users find your app better.
        </Translate></p>
        <h4><Translate>App user ID &amp; Logo</Translate></h4>
        <div className="form-row">
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
        </div>
        <div className="multi-input-row form-row">
          <input type="text" placeholder={this.translator._getText('App user ID')} value={this.state.app.app_id}
                 onChange={this.bindInputToModel.bind(this, 'app_id')}/>
          <input type="text" placeholder={this.translator._getText('Owner URL')} value={this.state.app.website}
                 onChange={this.bindInputToModel.bind(this, 'website')}/>
        </div>
        <input className="form-row form-block" type="text"
               placeholder={this.translator._getText('Summery (open graph)')} value={this.state.app.summary}
               onChange={this.bindInputToModel.bind(this, 'summary')}/>
        <h4><Translate>Information</Translate></h4>
        <div>
          <Tab items={informationTabs}/>
        </div>
        <h4><Translate>Category</Translate></h4>
        <div className="form-row">
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
        <div className="form-row">
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
          {
            this.state.base64Files.map((val, index) => {
              return (
                <div key={index} className="image-handler">
                  <img src={val} alt=""/>
                  <div className="image-buttons">
                    <div onClick={this.removePictures.bind(this, index)}>
                      <IcoN name="xcross16Red" size={16}/>
                    </div>
                    <div onClick={this.cropImage.bind(this, index)}>
                      <IcoN name="pencil16" size={16}/>
                    </div>
                  </div>
                </div>
              );
            })
          }
            {/* this.state.app.screenshots.map((val, index) => {
              return (
                <div key={index} className="image-handler">
                  <img src={Const.SERVER_URL + val.path} alt=""/>
                  <div className="image-buttons">
                    <div onClick={this.removePictures.bind(this, index)}>
                      <IcoN name="xcross16Red" size={16}/>
                    </div>
                    <div onClick={this.cropImage.bind(this, index)}>
                      <IcoN name="pencil16" size={16}/>
                    </div>
                  </div>
                </div>
              );
            }) */}
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
        <div className="form-row">
          <Select
            name="permission"
            isMulti={true}
            onChange={this.handleSelectChangePermission}
            options={this.state.permissions}
            placeholder={this.translator._getText('Select from the list of permissions')}
            removeSelected={true}
            rtl={true}
            simpleValue={true}
            className="multi-selector"
            value={this.state.selectedPermissions}
          />
        </div>
        <ul className="permissions-list">
          <li>
            <div className="per-icon">
              <IcoN name="filter16" size={16}/>
            </div>
            <div className="per-info">
              <h4>Personal Info</h4>
              <p>Reads your personal info such as birthday, email, first name, last name, and so on.</p>
            </div>
            <div className="per-remove">
              <IcoN name="negativeXCross24" size={24}/>
            </div>
          </li>
        </ul>
      </div>
    );
    return (
      <div className="admin-wrapper add-app-scene">
        <Affixer offsetTop={72} zIndex={4} height={80}>
          <div className="page-buttons">
            <h2><Translate>Add an app to the market</Translate></h2>
            <button className="butn butn-blue" onClick={this.preview}>
              <Translate>Preview</Translate>
            </button>
            <button className="butn butn-primary" onClick={this.onSubmit}>
              <Translate>Submit</Translate>
            </button>
          </div>
        </Affixer>
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

export default AdminAddApp;
