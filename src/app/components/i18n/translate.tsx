import * as React from 'react';
const translations = require('./translations.json');
// import translations from './translations';
interface IState {
  language: string;
}
export default class Translate extends React.Component <any, IState> {
  private translations: any;
  private defaultLanguage: string;
  private debugMode: boolean;

  public constructor(props = {}) {
    super(props);
    let win: any;
    if (typeof window !== 'undefined') {
      win = window;
    }
    this.translations = translations;
    this.defaultLanguage = 'en';
    this.debugMode = false;
    if (win) {
      this.state = {
        language: win.locale || this.defaultLanguage,
      };
    } else {
      this.state = {
        language: this.defaultLanguage,
      };
    }
  }

  public componentDidMount() {
    window.addEventListener('reactTranslateChangeLanguage', this._changeLanguage.bind(this));
  }

  public render() {
    return (
      <span style={this._getDebugModeStyles(this.props.children)}>{this._getText(this.props.children)}</span>
    );
  }

  public _getText(text, locale?) {
    const lng = locale || this.state.language;
    if (text) {
      if (this.translations[text] && this.translations[text][lng]) {
        return this.translations[text][lng];
      }
    }
    return text;
  }

  public _changeLanguage(event) {
    this.setState({language: event.detail});
  }

  public _getDebugModeStyles(text) {
    if (
        this.debugMode && text &&
        (
            !this.translations[text] ||
            (
                !this.translations[text][this.state.language] &&
                this.state.language !== this.defaultLanguage
            )
        )
    ) {
      return {backgroundColor: 'yellow'};
    }
    return {};
  }

}
