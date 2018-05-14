import * as React from 'react';
import {Modal} from 'antd';
// import ReactCrop, {makeAspectCrop} from 'react-image-crop';
const ReactCrop = require('react-image-crop');

// import {IcoN} from 'components';

interface IProps {
  avatar: any;
  onCropped: (file: any) => void;
  forceUpdateCounter?: number;
}

interface IStates {
  base64: string;
  crop: any;
  visible: boolean;
  file: any;
  maxHeight: number;
  forceUpdateCounter?: number;
}

export default class NstCrop extends React.Component<IProps, IStates > {
  public crop: any;
  constructor(props: any) {
    super(props);
    this.state = {
      crop: {
        x: 20,
        y: 20,
        minWidth: 300,
        minHeight : 100,
        keepSelection: true,
      },
      visible: false,
      maxHeight: 600,
      base64: '',
      file: '',
      forceUpdateCounter: 0,
    };
  }

  private onCropComplete = () => {
    const imgDom = document.querySelector('.ReactCrop__image');
    this
      .getCroppedImg(imgDom, this.state.crop, 'pic.jpg').then((file) => {
        if (file) {
          this.props.onCropped(file);
          this.handleCancel();
        }
      });
  }

  public componentWillReceiveProps(props: any) {
    if (props.forceUpdateCounter && props.forceUpdateCounter !== this.state.forceUpdateCounter) {
      return this.setState({visible: true, forceUpdateCounter: props.forceUpdateCounter});
    }
    const name = !this.props.avatar ? '' : this.props.avatar.name;
    if (props.avatar && props.avatar.name && props.avatar.name !== name) {
      const file = props.avatar;
      const imageType = /^image\//;

      if (!file || !imageType.test(file.type)) {
        return;
      }
      const reader = new FileReader();

      reader.onload = (e2: any) => {
        this.setState({base64: e2.target.result, file: props.avatar, visible: true});
      };
      reader.readAsDataURL(file);
    }
  }

  private onCropChange = (crop) => {
    this.setState({crop});
  }

  private onImageLoaded = (image) => {
    this.setState({
      crop: ReactCrop.makeAspectCrop({
        x: 0,
        y: 0,
      }, image.naturalWidth / image.naturalHeight),
    });
  }

  private getCroppedImg = (image: any, pixelCrop: any, fileName: string) => {
    const canvas = document.createElement('canvas');
    const naturalWidth = image.naturalWidth;
    const naturalHeight = image.naturalHeight;
    canvas.width = pixelCrop.width * naturalWidth / 100;
    canvas.height = pixelCrop.height * naturalHeight / 100;
    const ctx = canvas.getContext('2d');

    image.style.width = naturalWidth;
    image.style.height = naturalHeight;

    ctx.drawImage(image, pixelCrop.x * naturalWidth / 100,
      pixelCrop.y * naturalHeight / 100, pixelCrop.width * naturalWidth / 100,
      pixelCrop.height * naturalHeight / 100, 0, 0, pixelCrop.width * naturalWidth / 100,
      pixelCrop.height * naturalHeight / 100);
    // as Base64 string const base64Image = canvas.toDataURL('image/jpeg'); as a
    // blob var fileObj = new File([base64Image], fileName, {type: 'image/jpeg'});
    return new Promise((resolve) => {
      // console.log(this.state.file, fileObj); resolve(fileObj);
      canvas.toBlob((file: any) => {
        file.name = fileName;
        return resolve(file);
      }, 'image/jpeg');
    });
  }

  private handleCancel = () => {
    this.setState({visible: false});
  }

  private cropElementRefHandler = (element) => {
    this.crop = element;
  }

  public render() {
    const src = typeof this.state.base64 === 'string'
      ? this.state.base64
      : '';
    const modalFooter = (
      <div className="modal-foot">
        <button
          className="butn butn-white"
          onClick={this
          .handleCancel}>Discard</button>
        <button
          className="butn butn-green"
          onClick={this
          .onCropComplete}>Done</button>
      </div>
    );
    return (
      <Modal
        className="crop-modal"
        maskClosable={true}
        width={800}
        closable={true}
        onCancel={this
        .handleCancel}
        visible={this.state.visible}
        footer={modalFooter}
        title="Crop Image">
        <ReactCrop
          src={src}
          ref={this.cropElementRefHandler}
          onImageLoaded={this.onImageLoaded}
          onChange={this.onCropChange}
          {...this.state}/>
      </Modal>
    );
  }

}
