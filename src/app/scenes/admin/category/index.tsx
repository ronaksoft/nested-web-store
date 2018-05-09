import * as React from 'react';
import {Translate, Tab, Loading, IcoN} from 'components';
import {Upload, message, Modal} from 'antd';
import Select from 'react-select';
import {file as FileFactory, app as AppFactory} from './../../../api';
import {IApplication, ISelectOption} from './../../../api/interfaces';
import Const from './../../../api/consts/CServer';
import {cloneDeep} from 'lodash';
import {AppView} from '../../';

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
  preview: boolean;
  imageUrl: string;
  categories: ISelectOption[];
  languages: ISelectOption[];
  selectedCategories: ISelectOption[];
  selectedLanguages: ISelectOption[];
  suggestions: any[];
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
      preview: false,
      imageUrl: '',
      selectedCategories: [],
      selectedLanguages: [],
      categories: [
        {
          label: 'aaa',
          value: 'aaa',
        },
        {
          label: 'bbb',
          value: 'bbb',
        },
      ],
      languages: [
        {
          label: 'farsi',
          value: 'fa',
        },
        {
          label: 'English',
          value: 'en',
        },
      ],
      suggestions: [
        {
          label: 'Form Builder',
          value: 'form_builder',
        },
      ],
      app: {
        _id: '',
        app_id: '',
        logo: null,
        name: '',
        name_fa: '',
        description: '',
        description_fa: '',
        summary: '',
        screenshots: [],
        website: '',
        categories: [],
        permissions: [],
        official: false,
        stared: false,
        status: 0,
        lang: [],
      },
    };
    // if (initData) {
    //   state.app = initData.__INITIAL_DATA__.app || {};
    //   initData.__INITIAL_DATA__ = {};
    // } else {
    //   state.app = {};
    // }
    this.state = state;
    this.appFactory = new AppFactory();
    this.fileFactory = new FileFactory();
    this.customRequest = this.fileFactory.customRequest.bind(this);
  }

  // public componentWillUpdate(nextProps) {
  //
  // }

  public categoryOnChange = (_, {newValue}) => {
    const model = this.state.app;
    model.categories.push({_id: newValue});
    this.setState({
      app: model,
    });
  }

  public languageOnChange = (_, {newValue}) => {
    const model = this.state.app;
    model.lang = newValue;
    this.setState({
      app: model,
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
      console.log(info);
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
    return isValid && isLt1M;
  }

  private bindInputToModel(name, e: any) {
    const model = this.state.app;
    model[name] = e.target.value;
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

  private preview = () => {
    this.setState({
      preview: !this.state.preview,
    });
  }

  private onSubmit = () => {
    const model: IApplication = cloneDeep(this.state.app);
    if (model.logo) {
      model.logo = {
        _id: model.logo._id,
      };
    }
    model.categories = this.state.selectedCategories.map((cat) => {
      return {_id: cat.value};
    });
    model.lang = this.state.selectedLanguages.map((lng) => lng.value);
    model.screenshots.map((val) => {
      return {
        _id: val._id,
      };
    });
    console.log(model);
    this.appFactory.createApp(model).then((data) => {
      console.log(data);
    }).catch((error) => {
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

  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof AdminApp
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
        <h4><Translate>Information</Translate></h4>
        <div className="multi-input-row form-row">
          <input type="text" placeholder={this.translator._getText('App name (eng)')} value={this.state.app.name}
                 onChange={this.bindInputToModel.bind(this, 'name')}/>
          <input type="text" dir="rtl" placeholder="نام اپلیکیشن (فارسی)" value={this.state.app.name_fa}
                 onChange={this.bindInputToModel.bind(this, 'name_fa')}/>
        </div>
        <div className="multi-input-row form-row">
          <textarea placeholder={this.translator._getText('Description (eng)')} value={this.state.app.description}
                    onChange={this.bindInputToModel.bind(this, 'description')}/>
          <textarea dir="rtl" placeholder="توضیحات (فارسی)" value={this.state.app.description_fa}
                    onChange={this.bindInputToModel.bind(this, 'description_fa')}/>
        </div>
        <input className="form-row" type="text" placeholder={this.translator._getText('Summery (open graph)')}
               value={this.state.app.summary} onChange={this.bindInputToModel.bind(this, 'summary')}/>
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
        {/* <ul className="selected-categories">
          {this.state.app.categories.map((cat) => (
            <li key={cat._id}>
              <span>{cat.name}</span>
              <IcoN name="negativeXCross24" size={24}/>
            </li>
          ))}
        </ul> */}
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
            this.state.app.screenshots.map((val, index) => {
              return (
                <div key={index} className="image-handler">
                  <img src={Const.SERVER_URL + val.path} alt=""/>
                  <div className="image-buttons">
                    <div onClick={this.removePictures.bind(this, index)}>
                      <IcoN name="xcross16Red" size={16}/>
                    </div>
                    <div>
                      <IcoN name="pencil16" size={16}/>
                    </div>
                  </div>
                </div>
              );
            })
          }
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
            className="suggester"
            options={this.state.suggestions}
            placeholder={this.translator._getText('Select from the list of permissions')}
          />
        </div>
        <ul className="permissions">
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
      <div className="main-container">
        <div className="main-container-inner vertical admin">
          <div className="page-buttons">
            <div className="page-buttons-inner">
              <h2><Translate>Add an app to the market</Translate></h2>
                <button className="butn butn-blue" onClick={this.preview}>
                  <Translate>Preview</Translate>
                </button>
                <button className="butn butn-primary" onClick={this.onSubmit}>
                  <Translate>Submit</Translate>
                </button>
            </div>
          </div>
          <Tab items={tabs}/>
        </div>
        <Modal
            title="test"
            wrapClassName="vertical-center-modal"
            width="90%"
            visible={this.state.preview}
            onOk={this.preview}
            onCancel={this.preview}
          >
          <AppView app="test" preview={true}/>
        </Modal>
      </div>
    );
  }
}

export default AdminApp;
