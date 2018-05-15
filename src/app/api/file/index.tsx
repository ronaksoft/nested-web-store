import axios from 'axios';
import Const from '../consts/CServer';

class FileFactory {

  public create(formData: any) {
    return axios.post(Const.SERVER_URL + '/admin/file/add', formData).then((response) => {
      return response.data.data.files;
    });
  }

  public customRequest(uploadData) {
    const formData = new FormData();
    formData.append('file-' + uploadData.filename, uploadData.file);
    axios
      .post(Const.SERVER_URL + '/admin/file/add', formData, {
        onUploadProgress: ({total, loaded}) => {
          uploadData.onProgress({percent: Math.round(loaded / total * 100).toFixed(2)}, uploadData.file);
        },
      })
      .then(({data: response}) => {
        uploadData.onSuccess(response, uploadData.file);
      })
      .catch(uploadData.onError);
    return {
      abort() {
        console.log('upload progress is aborted.');
      },
    };
  }
}

export default FileFactory;
