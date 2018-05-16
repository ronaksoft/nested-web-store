import axios from 'axios';
import Const from '../consts/CServer';

const CallApi = (url, params): Promise<any> => {
  return new Promise((resolve, reject) => {
    axios.post(Const.SERVER_URL + url, params).then((response) => {
      if (response.data.status === 'ok') {
        resolve(response.data.data);
      } else {
        reject(response.data.data);
      }
    }).catch((error) => {
      reject(error.response);
    });
  });
};

export default CallApi;
