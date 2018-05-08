import axios from 'axios';
import Const from '../consts/CServer';

class FileFactory {

  public createFile(formData: any) {
    return axios.post(Const.SERVER_URL + '/admin/file/add', formData, {
      headers: '',
    }).then((response) => {
      return response.data;
    });
  }

  public customRequest(uploadData) {
    const formData = new FormData();
    if (uploadData.data) {
      Object.keys(uploadData.data).map((key) => {
        formData.append(key, uploadData.data[key]);
      });
    }
    formData.append('file-' + uploadData.filename, uploadData.file);
    axios
      .post(Const.SERVER_URL + '/admin/file/add', formData, {
        headers: '',
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
