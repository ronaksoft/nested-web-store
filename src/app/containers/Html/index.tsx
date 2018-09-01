import {IStore} from 'redux/IStore';
import * as React from 'react';
import {Helmet} from 'react-helmet';
import * as serialize from 'serialize-javascript';

const appConfig = require('../../../../config/main');
import CONFIG from './../../defaultConfig';

interface IHtmlProps {
  manifest?: any;
  markup?: string;
  store?: Redux.Store<IStore>;
}

class Html extends React.Component<IHtmlProps, {}> {
  private resolve(files) {
    return files.map((src) => {
      if (!this.props.manifest[src]) {
        return;
      }
      return '/public/' + this.props.manifest[src];
    }).filter((file) => file !== undefined);
  }

  public render() {
    const head = Helmet.rewind();
    const {markup, store} = this.props;

    const styles = this.resolve(['vendor.css', 'app.css']);
    const renderStyles = styles.map((src, i) =>
      <link key={i} rel="stylesheet" type="text/css" href={src}/>,
    );

    const scripts = this.resolve(['vendor.js', 'app.js']);
    const renderScripts = scripts.map((src, i) =>
      <script src={src} key={i}/>,
    );

    // tslint:disable-next-line:max-line-length
    const initialState = (
      <script
        dangerouslySetInnerHTML={{__html: `window.__INITIAL_STATE__=${serialize(store.getState(), {isJSON: true})};`}}
        charSet="UTF-8"/>
    );

    const nestedConfig = (
      <script
        dangerouslySetInnerHTML={{__html: `window.__NESTED_CONFIG__=${serialize(CONFIG, {isJSON: true})};`}}
        charSet="UTF-8"/>
    );
    return (
      <html lang="en">
      <head>
        {head.base.toComponent()}
        {head.title.toComponent()}
        {head.meta.toComponent()}
        {head.link.toComponent()}
        {head.script.toComponent()}
        <Helmet meta={appConfig.app.head.meta} title={appConfig.app.head.title || 'Nested App Store'}/>
        {renderStyles}
        <link rel="shortcut icon" href="/public/favicon.ico"/>
        <link rel="manifest" href="/public/manifest.json"/>
        <link rel="apple-touch-icon" href="/public/images/nested-144.png" sizes="152x152"/>
        <link rel="apple-touch-icon" href="/public/images/nested-192.png" sizes="180x180"/>
        <link rel="apple-touch-icon" href="/public/images/nested-168.png" sizes="167x167"/>
        <link rel="apple-touch-icon" href="/public/nested-512.png"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="mobile-web-app-capable" content="yes"/>
        <link rel="apple-touch-startup-image" href="/public/images/nested-512.png"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/>
      </head>
      <body>
      <main className="nested-main" id="app" dangerouslySetInnerHTML={{__html: markup}}/>
        {initialState}
        {nestedConfig}
        {renderScripts}
      </body>
      </html>
    );
  }
}

export {Html}
