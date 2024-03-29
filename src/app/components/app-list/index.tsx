import * as React from 'react';
import {Translate, ProperLanguage, ScrollArea} from 'components';
import {Link} from 'react-router';
import {IApplication, ICategory} from '../../api/interfaces';
import {Config} from 'api/consts/CServer';

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
            {this.props.noScrollbar && (
              <div className="no-scrollbar list-body">
                {this.state.items.map((item, index) => (
                  <Link to={'/app/' + item.app_id} key={index} className={isMini ? 'app-card-mini' : 'app-card'}>
                    <div className="app-image">
                      <div className="app-image-inner">
                        <img src={Config().SERVER_URL + item.logo.path} alt=""/>
                      </div>
                      {!isMini && (
                        <div className="app-image-bg">
                          <img src={Config().SERVER_URL + item.logo.path} alt=""/>
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
            )}
            {!this.props.noScrollbar && (
              <div className="list-body">
                <ScrollArea
                  speed={0.8}
                  className="area"
                  contentClassName="content"
                  horizontal={true}
                  vertical={false}
                  >
                  {this.state.items.map((item, index) => (
                    <Link to={'/app/' + item.app_id} key={index} className={isMini ? 'app-card-mini' : 'app-card'}>
                      <div className="app-image">
                        <div className="app-image-inner">
                          <img src={Config().SERVER_URL + item.logo.path} alt=""/>
                        </div>
                        {!isMini && (
                          <div className="app-image-bg">
                            <img src={Config().SERVER_URL + item.logo.path} alt=""/>
                          </div>
                        )}
                      </div>
                      <div className="app-data">
                        <h4><ProperLanguage model={item} property="name"/></h4>
                        <aside>{getCategoriesName(item.categories).map((el) => el)}</aside>
                      </div>
                    </Link>
                  ))}
                </ScrollArea>
              </div>
            )}
          </div>
          )}
        </div>
      );
  }
}
