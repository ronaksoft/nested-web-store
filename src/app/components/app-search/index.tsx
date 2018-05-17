import * as React from 'react';
import Select from 'react-select';
import {ISelectOption} from 'api/interfaces';
import {IcoN, Translate, ProperLanguage} from 'components';
import Highlighter from 'react-highlight-words';
import {app as AppFactory} from 'api';

interface IState {
    value: string;
    inputValue: string;
    suggestions: ISelectOption[];
}

export default class AppSearch extends React.Component<any, IState> {
  private translator: Translate;
  private appFactory: AppFactory;

  constructor(props: any) {
    super(props);
    this.state = {
      inputValue: '',
        value: '',
        suggestions: [],
    };
    this.translator = new Translate();
    this.appFactory = new AppFactory();
  }
  public onChange = (event, { newValue }) => {
    console.log(event, newValue);
    this.setState({
      value: newValue,
    });
  }
  public onInputChange = (newValue) => {
    this.setState({
      inputValue: newValue,
    });
    if (newValue) {
      this.appFactory.search(newValue).then((data) => {
        if (data === null) {
          return;
        }
        this.setState({
          suggestions: data.apps.map((app) => {
            return {
              value: app._id,
              label: <ProperLanguage model={app} property="name"/>,
            };
          }),
        });
      });
    }
  }

  // Autosuggest will call this function every time you need to clear suggestions.
  public onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  }

  private renderOption = (option) => {
      return (
          <Highlighter
            searchWords={[this.state.value]}
            textToHighlight={option.label}
          />
      );
  }

  public componentDidMount() {
    window.addEventListener('reactTranslateChangeLanguage', this.updateLang);
  }

  public componentWillUnmount() {
    window.removeEventListener('reactTranslateChangeLanguage', this.updateLang);
  }

  private updateLang = () => {
    setTimeout(() => {
      this.translator = new Translate();
      this.forceUpdate();
    }, 100);
  }

  /**
   * @function render
   * @description Renders the component
   * @returns {ReactElement} markup
   * @memberof IcoN
   */
  public render() {
    const {value, suggestions} = this.state;
    // Finally, render it!
    return (
        <div className="search-box">
            <IcoN name="search24" size={24}/>
            <Select
                name="form-field-name"
                value={value}
                onChange={this.onChange}
                onInputChange={this.onInputChange}
                className={this.state.suggestions.length === 0 && !this.state.inputValue
                  ? 'no-option suggester'
                  : 'suggester'}
                optionRenderer={this.renderOption}
                options={suggestions}
                placeholder={this.translator._getText('Search for apps...')}
            />
        </div>
    );
  }
}
