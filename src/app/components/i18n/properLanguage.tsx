import * as React from 'react';
interface IProps {
  model: any;
  property: string;
  html?: boolean;
}
interface IState {
  language: string;
  html?: boolean;
}
export default class ProperLanguage extends React.Component <IProps, IState> {
  private defaultLanguage: string;
  private debugMode: boolean;
  private mounted: boolean = false;

  public constructor(props) {
    super(props);
    let win: any;
    if (typeof window !== 'undefined') {
      win = window;
    }
    this.defaultLanguage = 'en';
    this.debugMode = false;
    if (win) {
      this.state = {
        language: win.locale || this.defaultLanguage,
        html: this.props.html,
      };
    } else {
      this.state = {
        language: this.defaultLanguage,
        html: this.props.html,
      };
    }
  }

  public componentDidMount() {
    window.addEventListener('reactTranslateChangeLanguage', this._changeLanguage.bind(this));
    this.mounted = true;
  }

  public componentWillUnmount() {
    this.mounted = false;
  }

  public render() {
    if (
      this.state.language !== 'en' &&
      this.props.model.translations &&
      this.props.model.translations.length > 0
    ) {
      const thisTranslate = this.props.model.translations
        .find((translate) => translate.locale === this.state.language);
        if (thisTranslate) {
          return !this.state.html ? (
            <span>{thisTranslate[this.props.property]}</span>
          ) : (
            <div dangerouslySetInnerHTML={{__html: thisTranslate[this.props.property]}}/>
          );
        } else {
          return !this.state.html ? (
            <span>{this.props.model[this.props.property]}</span>
          ) : (
            <div dangerouslySetInnerHTML={{__html: this.props.model[this.props.property]}}/>
          );
        }
    } else {
      return !this.state.html ? (
        <span>{this.props.model[this.props.property]}</span>
      ) : (
        <div dangerouslySetInnerHTML={{__html: this.props.model[this.props.property]}}/>
      );
    }
  }

  public _changeLanguage(event) {
    if (this.mounted) {
      this.setState({language: event.detail});
    }
  }

}
