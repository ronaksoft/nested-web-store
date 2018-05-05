import * as log from 'loglevel';

// TODO: Do not import whole lodash. Just import the required functions
import axios from 'axios';

import {
  IHttpConfig,
} from './interfaces';
/**
 * @const defaultConfig
 * @default
 * @desc Socket's default configuration
 */
const defaultConfig: IHttpConfig = {
  server: '',
};

/**
 * @class Socket
 * @desc A lightweight web-socket service built on top of browser WebSocket
 */
class Http {
  /**
   * @property config
   * @desc The configuration which the class uses to establish a socket connection
   * @private
   * @type {ISocketConfig}
   * @memberof Socket
   */
  private config: IHttpConfig;

  /**
   * Creates an instance of Socket.
   * @param {ISocketConfig} [config=defaultConfig]
   * @memberof Socket
   */
  constructor(config: IHttpConfig = defaultConfig) {
    if (config.server === '') {
      throw Error('WebSocket Server isn\'t declared!');
    }
    this.config = config;
  }

  public post(msg: any) {
    return new Promise((res, rej) => {
      axios.post(this.config.server + msg.cmd, msg.data)
      .then(res)
      .catch(rej);
      log.debug(`Post | >>>`, msg);
    });
  }

  public get(msg: any) {
    return new Promise((res, rej) => {
      axios.get(this.config.server + msg.cmd, msg.data || {})
      .then(res)
      .catch(rej);
      log.debug(`Get | >>>`, msg);
    });
  }

}

export {Http};
