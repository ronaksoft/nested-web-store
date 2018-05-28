import axios from 'axios';
import {Config} from 'api/consts/CServer';

const CallApi = (url, params): Promise<any> => {
  return new Promise((resolve, reject) => {
    axios.post(Config().SERVER_URL + url, params).then((response) => {
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
