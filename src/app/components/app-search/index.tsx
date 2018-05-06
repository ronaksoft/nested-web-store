import * as React from 'react';
import Select from 'react-select';
import {IcoN, Translate} from 'components';
import Highlighter from 'react-highlight-words';

interface IState {
    value: string;
    suggestions: any[];
};

export default class AppSearch extends React.Component<any, IState> {
  private translator: Translate;
  constructor(props: any) {
    super(props);
    this.state = {
        value: '',
        suggestions: [
            {
              label: 'Form Builder',
              value: 'form_builder',
            },
            {
              label: 'Poll',
              value: 'poll',
            },
            {
              label: 'Form Builder',
              value: 'form_builder',
            },
            {
              label: 'Poll',
              value: 'poll',
            },
            {
              label: 'Form Builder',
              value: 'form_builder',
            },
            {
              label: 'Poll',
              value: 'poll',
            },
            {
              label: 'Form Builder',
              value: 'form_builder',
            },
            {
              label: 'Poll',
              value: 'poll',
            },
            {
              label: 'Form Builder',
              value: 'form_builder',
            },
            {
              label: 'Poll',
              value: 'poll',
            },
            {
              label: 'Form Builder',
              value: 'form_builder',
            },
            {
              label: 'Poll',
              value: 'poll',
            },
        ],
    };
    this.translator = new Translate();
  }
  public onChange = (event, { newValue }) => {
    console.log(event);
    this.setState({
      value: newValue,
    });
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

  private updateLang = () => {
    setTimeout(() => {
      this.translator = new Translate();
      this.forceUpdate();
    }, 100);
  }

  public componentWillUnmount() {
    window.removeEventListener('reactTranslateChangeLanguage', this.updateLang);
  }

  /**
   * @function render
   * @description Renders the component
   * @returns {ReactElement} markup
   * @memberof IcoN
   */
  public render() {
    const { value, suggestions } = this.state;

    // Finally, render it!
    return (
        <div className="search-box">
            <IcoN name="search24" size={24}/>
            <Select
                name="form-field-name"
                value={value}
                onChange={this.onChange}
                className="suggester"
                optionRenderer={this.renderOption}
                options={suggestions}
                placeholder={this.translator._getText('Search for apps...')}
            />
        </div>
    );
  }
}
