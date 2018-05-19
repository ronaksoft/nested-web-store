import * as React from 'react';
import {Translate, ProperLanguage} from 'components';
import {Link} from 'react-router';
import {IApplication, ICategory} from '../../api/interfaces';
import Const from '../../api/consts/CServer';

interface IProps {
  items: IApplication[];
  mode?: string;
  title: any;
  haveMore: boolean;
  noScrollbar?: boolean;
}

interface IState {
  items: IApplication[];
}

export default class AppList extends React.Component<IProps, IState> {
  private translator: Translate;

  constructor(props: any) {
    super(props);
    this.state = {
      items: props.items,
    };
    this.translator = new Translate();
    // this.translator._getText('Search for apps...')
  }

  public componentWillReceiveProps(props: IProps) {
    this.setState({
      items: props.items,
    });
  }

  public render() {
    const isMini = this.props.mode === 'mini';
    const enable = this.state.items.length > 0;
    const getCategoriesName = (categories: ICategory[]) => {
      return categories.slice(0, 2).map((item, index) => {
        return <ProperLanguage key={index} model={item} property="name"/>;
      });
    };
    // Finally, render it!
    return (
        <div className={'content-wrapper' + enable ? '' : ' hide'}>
          {enable && (
          <div className="app-list">
            <div className="list-head">
              <h3>{this.props.title}</h3>
              <div className="filler"/>
              {this.props.haveMore && <a href=""><Translate>See more</Translate></a>}
            </div>
            <div className={(this.props.noScrollbar ? 'no-scrollbar ' : '') + 'list-body'}>
              {this.state.items.map((item, index) => (
                <Link to={'/app/' + item.app_id} key={index} className={isMini ? 'app-card-mini' : 'app-card'}>
                  <div className="app-image">
                    <img src={Const.SERVER_URL + item.logo.path} alt=""/>
                    {!isMini && (
                      <div className="app-image-bg">
                        <img src={Const.SERVER_URL + item.logo.path} alt=""/>
                      </div>
                    )}
                  </div>
                  <div className="app-data">
                    <h4><ProperLanguage model={item} property="name"/></h4>
                    <aside>{getCategoriesName(item.categories).map((el) => el)}</aside>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          )}
        </div>
      );
  }
}
