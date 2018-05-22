import {IUser} from '../../api/interfaces';

class NestedService {
  private c: any;
  private cyrus: any;
  private xerxes: any;
  private nestedConfigs: any[];

  constructor(user: IUser) {
    if (!user) {
      return;
    }
    if (user._id.length !== 24) {
      return;
    }
    if (user.apps.length === 0) {
      return;
    }
    this.c = {
      token: user.apps[0].token,
      id: user.apps[0].id,
    };
    const config = this.getServerInfo(user.apps[0].url);
    this.cyrus = config.cyrus;
    this.xerxes = config.xerxes;
  }

  public getServerInfo(domain) {
    if (this.nestedConfigs.hasOwnProperty(domain)) {
      return this.nestedConfigs[domain];
    }
    const configFromDB = this.getFromDB(domain);
    if (configFromDB) {
      this.nestedConfigs[domain] = configFromDB;
      return configFromDB;
    }
    const remote = this.xhr({
      method: 'GET',
      async: false,
    }, 'https://npc.nested.me/dns/discover/' + domain);
    if (!remote) {
      return null;
    }
    const config = this.parseConfigFromRemote(remote.data, domain);
    this.nestedConfigs[domain] = config;
    this.setToDB(domain, config);
    return config;
  }

  private getFromDB(domain) {
    const data =  localStorage.getItem(domain);
    if (data) {
      return JSON.parse(data);
    } else {
      return null;
    }
  }

  private setToDB(domain, config) {
    localStorage.setItem(domain, JSON.stringify(config));
  }

  public parseConfigFromRemote(data, domain) {
    const cyrus = [];
    const xerxes = [];
    data.forEach((configs) => {
      const config = configs.split(';');
      config.forEach((item) => {
        if (item.indexOf('cyrus:') === 0) {
          cyrus.push(item);
        } else if (item.indexOf('xerxes:') === 0) {
          xerxes.push(item);
        }
      });
    });
    let cyrusHttpUrl = '';
    let cyrusWsUrl = '';
    let config: any = {};
    cyrus.forEach((item) => {
      config = this.parseConfigData(item);
      if (config.protocol === 'http' || config.protocol === 'https') {
        cyrusHttpUrl = this.getCompleteUrl(config);
      } else if (config.protocol === 'ws' || config.protocol === 'wss') {
        cyrusWsUrl = this.getCompleteUrl(config);
      }
    });
    return {
      cyrus: cyrusHttpUrl + '/api',
      xerxes: cyrusHttpUrl + '/file',
      domain,
    };
  }

  public parseConfigData(data) {
    const items = data.split(':');
    return {
      name: items[0],
      protocol: items[1],
      port: items[2],
      url: items[3],
    };
  }

  public getCompleteUrl(config) {
    return config.protocol + '://' + config.url + ':' + config.port;
  }

  public http(cmd, params, callback, catchCallback) {
    const http = new XMLHttpRequest();
    let parameters: any = {
      _app_token: this.c.token,
      _app_id: this.c.id,
      _cid: 'Appstore',
      cmd,
      data: params,
    };

    if (['session/recall', 'session/register', 'system/get_string_constants'].indexOf(cmd) > -1) {
      delete parameters._app_token;
      delete parameters._app_id;
    }

    http.open('POST', this.cyrus, true);
    http.setRequestHeader('accept', 'application/json');
    http.onreadystatechange = () => {
      if (http.readyState === 4 && http.status === 200) {
        const data = JSON.parse(http.responseText);
        if (data.status === 'ok') {
          if (typeof callback === 'function') {
            callback(data.data);
          }
        } else {
          if (typeof catchCallback === 'function') {
            catchCallback(data.data);
          }
        }
      }
    };
    parameters = JSON.stringify(parameters);
    http.send(parameters);
  }

  public xhr(config, url, params = null, callback = null, catchCallback = null) {
    const http = new XMLHttpRequest();
    const async = config.async === undefined ? true : config.async;
    const method = config.method || 'GET';
    http.open(method, url, async);
    http.setRequestHeader('accept', 'application/json');
    if (async) {
      http.onreadystatechange = () => {
        if (http.readyState === 4) {
          if (http.status === 200) {
            const data = JSON.parse(http.responseText);
            if (typeof callback === 'function') {
              callback(data);
            }
          } else {
            if (typeof catchCallback === 'function') {
              catchCallback(http.statusText);
            }
          }
        }
      };
    }
    let formData;
    if (params && method === 'POST') {
      formData = new FormData();
      params.forEach((param, key) => {
        formData.append(key, param);
      });
    } else {
      formData = null;
    }
    try {
      http.send(formData);
      if (!async) {
        if (http.status === 200) {
          return JSON.parse(http.responseText);
        } else {
          return null;
        }
      }
    } catch (e) {
      return null;
    }
  }
}

export default NestedService;
