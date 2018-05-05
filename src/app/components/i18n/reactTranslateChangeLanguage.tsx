import {connect} from 'react-redux';
import * as React from 'react';
import {setLang} from 'redux/app/actions';

interface IProps {
    setLang: (language: string) => {};
}
class ReactTranslateChangeLanguage extends React.Component<IProps, any> {
    public static change = (language) => {
        const reactTranslateChangeLanguage = new CustomEvent('reactTranslateChangeLanguage',
            { detail: language });
        window.dispatchEvent(reactTranslateChangeLanguage);
        window.document.dir = language === 'fa' ? 'rtl' : 'ltr';
    }
}

/**
 * reducer actions functions mapper
 * @param {any} dispatch reducer dispacther
 * @returns reducer actions object
 */
const mapDispatchToProps = (dispatch) => {
    return {
        setLang: (language: string) => {
            dispatch(setLang(language));
        },
    };
};

const translateChangeLanguag  = ReactTranslateChangeLanguage.change;
export {translateChangeLanguag}
export default connect(null, mapDispatchToProps)(ReactTranslateChangeLanguage);
