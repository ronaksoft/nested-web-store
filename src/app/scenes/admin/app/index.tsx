import * as React from 'react';
import {Translate, Tab, Loading, IcoN} from 'components';
import { Upload, message} from 'antd';
import Select from 'react-select';

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
  app: any;
  loading: boolean;
  imageUrl: string;
  category: string;
  language: string;
  suggestions: any[];
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
    const state: any = {
      loading: false,
      imageUrl: '',
      category: '',
      language: '',
      suggestions: [
          {
            label: 'Form Builder',
            value: 'form_builder',
          },
      ],
    };
    if (initData) {
      state.app = initData.__INITIAL_DATA__.app || {};
      initData.__INITIAL_DATA__ = {};
    } else {
      state.app = {};
    }
    this.state = state;
  }
  // public componentWillUpdate(nextProps) {
  //
  // }

  public categoryOnChange = (event, { newValue }) => {
    console.log(event);
    this.setState({
      category: newValue,
    });
  }

  public languageOnChange = (event, { newValue }) => {
    console.log(event);
    this.setState({
      language: newValue,
    });
  }

  private handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => this.setState({
        imageUrl,
        loading: false,
      }));
    }
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
      <div>
        <h4><Translate>App user ID &amp; Logo</Translate></h4>
        <div className="form-row">
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="http://localhost:8080/admin/file/add"
            beforeUpload={beforeUpload}
            onChange={this.handleChange}
          >
            {imageUrl ? <img src={imageUrl} alt="" /> : uploadButton}
          </Upload>
        </div>
        <div className="multi-input-row form-row">
          <input type="text" placeholder={this.translator._getText('App user ID')}/>
          <input type="text" placeholder={this.translator._getText('Owner URL')}/>
        </div>
        <h4><Translate>Information</Translate></h4>
        <div className="multi-input-row form-row">
          <input type="text" placeholder={this.translator._getText('App name (eng)')}/>
          <input type="text" dir="rtl" placeholder="نام اپلیکیشن (فارسی)"/>
        </div>
        <div className="multi-input-row form-row">
          <textarea placeholder={this.translator._getText('Description (eng)')}/>
          <textarea dir="rtl" placeholder="توضیحات (فارسی)"/>
        </div>
        <input className="form-row" type="text" placeholder={this.translator._getText('Summery (open graph)')}/>
        <h4><Translate>Category</Translate></h4>
        <div className="form-row">
          <Select
              name="category"
              value={this.state.category}
              onChange={this.categoryOnChange}
              className="suggester"
              options={this.state.suggestions}
              placeholder={this.translator._getText('Select from the list of categories')}
          />
        </div>
        <h4><Translate>Languages</Translate></h4>
        <div className="form-row">
          <Select
              name="language"
              value={this.state.language}
              onChange={this.languageOnChange}
              className="suggester"
              options={this.state.suggestions}
              placeholder={this.translator._getText('Select your app languages')}
          />
        </div>
      </div>
    );
    tabs[this.translator._getText('Pictures')] = (
      <div>
        <h4><Translate>Screenshots &amp; Pictures</Translate></h4>
        <div className="images-container">
          <div className="image-handler">
            <img src="/public/assets/icons/Nested_Logo.svg" alt=""/>
            <div className="image-buttons">
              <div>
                <IcoN name="xcross16Red" size={16} />
              </div>
              <div>
                <IcoN name="pencil16" size={16} />
              </div>
            </div>
          </div>
          <div className="upload-box">
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="//jsonplaceholder.typicode.com/posts/"
              beforeUpload={beforeUpload}
              onChange={this.handleChange}
            >
              <div className="ant-upload-text">+<br/>Add photo</div>
            </Upload>
          </div>
        </div>
      </div>
    );
    tabs[this.translator._getText('Permissions')] = (
      <div>
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
              <IcoN name="negativeXCross24" size={24} />
            </div>
          </li>
        </ul>
      </div>
    );
    return (
      <div className="main-container">
        <div className="main-container-inner vertical admin">
          <div className="add-app">
            <h2><Translate>Add an app to the market</Translate></h2>
            <p><Translate>
                Add your developed app by filling these fields and helping users find your app better.
            </Translate></p>
            <Tab items={tabs}/>
          </div>
        </div>
      </div>
    );
  }
}

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJPG && isLt2M || true;
}

export default AdminApp;
