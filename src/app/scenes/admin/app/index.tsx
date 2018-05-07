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
        <div>
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
        <div className="multi-input-row">
          <input type="text" placeholder={this.translator._getText('App user ID')}/>
          <input type="text" placeholder={this.translator._getText('Owner URL')}/>
        </div>
        <h4><Translate>Information</Translate></h4>
        <div className="multi-input-row">
          <input type="text" placeholder={this.translator._getText('App name (eng)')}/>
          <input type="text" placeholder="(یسراف) نشیکیلپا مان"/>
        </div>
        <div className="multi-input-row">
          <textarea placeholder={this.translator._getText('Description (eng)')}/>
          <textarea placeholder="(یسراف) تاحیضوت"/>
        </div>
        <input type="text" placeholder={this.translator._getText('Summery (open graph)')}/>
        <h4><Translate>Category</Translate></h4>
        <Select
            name="form-field-name"
            value={this.state.category}
            onChange={this.categoryOnChange}
            className="suggester"
            options={this.state.suggestions}
            placeholder={this.translator._getText('Search for apps...')}
        />
      </div>
    );
    tabs[this.translator._getText('Pictures')] = <div>a</div>;
    tabs[this.translator._getText('Permissions')] = <div>a</div>;
    return (
      <div className="main-container">
        <div className="main-container-inner vertical">
          <h2><Translate>Add an app to the market</Translate></h2>
          <p><Translate>
              Add your developed app by filling these fields and helping users find your app better.
          </Translate></p>
          <Tab items={tabs}/>
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
