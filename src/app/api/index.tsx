import {Server, IRequest, IResponse} from 'services/server';
import IRequestKeyList from './interfaces/IRequestKeyList';
import Unique from './../services/utils/unique';

/**
 * @class Api
 * @desc Base of all Api classes
 */
class Api {
  private static instance;
  private server;
  private messageCanceller = null;
  private hasCredential: boolean = false;
  private syncActivityListeners: object = {};
  private requestKeyList: IRequestKeyList[] = [];

  private constructor() {
    // start api service
    this.syncActivityListeners = {};
  }

  /**
   * @func getInstance
   * @desc Creates an instance of Api and keeps it singletonewhile the app is running
   * @static
   * @returns {Api}
   * @memberof Api
   */
  public static getInstance(): Api {
    if (!Api.instance) {
      Api.instance = new Api();
    }
    return Api.instance;
  }

  /**
   * @func setHasCredential
   * @desc Sets value of hasCredential
   * @param {boolean} value
   * @memberof Api
   */
  public setHasCredential(value: boolean) {
    this.hasCredential = value;
  }

  /**
   * @func getHasCredential
   * @desc Returns value of hasCredential
   * @returns
   * @memberof Api
   */
  public getHasCredential() {
    return this.hasCredential;
  }

  /**
   * @func request
   * @desc Sends a request and resolves/rejects based on the response
   * @param {IRequest} req
   * @returns {Promise<any>}
   * @memberof Api
   */
  public request(req: IRequest): Promise<any> {
    const requestKeyJson: IRequest = {
      cmd: req.cmd,
      data: req.data,
    };
    const requestKey: string = JSON.stringify(requestKeyJson);
    if (!this.requestKeyList.hasOwnProperty(requestKey)) {
      this.requestKeyList[requestKey] = {
        request: [],
        response: null,
        status: null,
        resolve: true,
      };
      this.getServer().request(req).then((response: IResponse) => {
        if (response.status === 'ok') {
          this.requestKeyList[requestKey].response = response.data;
          this.requestKeyList[requestKey].resolve = true;
        } else {
          this.requestKeyList[requestKey].response = response.data;
          this.requestKeyList[requestKey].resolve = false;
        }
        this.requestKeyList[requestKey].status = response.status;
        this.callAllPromisesByRequestKey(requestKey);
      }).catch((error) => {
        console.log(error);
        console.log('Promise Catch');
        this.requestKeyList[requestKey].response = null;
        this.requestKeyList[requestKey].resolve = null;
        this.callAllPromisesByRequestKey(requestKey);
      });
    }

    let internalResolve;
    let internalReject;

    const promise = new Promise((res, rej) => {
      internalResolve = res;
      internalReject = rej;
    });

    this.requestKeyList[requestKey].request.push({
      param: req,
      promise: {
        resolve: internalResolve,
        reject: internalReject,
      },
    });

    return promise;

  }

  /**
   * @func callAllPromisesByRequestKey
   * @desc call all promises by key request
   * @param {string} requestKey
   * @returns {void}
   * @memberof Api
   */
  private callAllPromisesByRequestKey(requestKey: string): any {
    const requestList = this.requestKeyList[requestKey];
    requestList.request.forEach((value) => {
      const response: IResponse = {
        _reqid: value.param._reqid,
        status: requestList.status,
        data: requestList.response,
      };
      if (requestList.resolve === true) {
        value.promise.resolve(response.data);
      } else if (requestList.resolve === null) {
        value.promise.reject();
      } else {
        value.promise.reject(response.data);
      }
    });
    delete this.requestKeyList[requestKey];
  }

  // TODO: Ask sina to explain these functions
  public addSyncActivityListener(callback: (syncObj: any) => void): any {
    const listenerId = 'listener_' + Unique.get();
    console.log(this.syncActivityListeners, listenerId);
    this.syncActivityListeners[listenerId] = callback;
    const canceler = () => {
      delete this.syncActivityListeners[listenerId];
    };
    return canceler;
  }

  private callServerMessageListener(message: any) {
    if (message.cmd === 'sync-a') {
      Object.keys(this.syncActivityListeners).forEach((key: string) => {
        this.syncActivityListeners[key](message.data);
      });
    }
  }

  private getServer() {
    if (!this.server) {
      this.server = new Server();
    }
    if (this.messageCanceller === null) {
      this.messageCanceller = this.server.addMessageListener(this.callServerMessageListener.bind(this));
    }
    return this.server;
  }

}

export default Api;
