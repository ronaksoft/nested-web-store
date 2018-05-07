import * as React from 'react';
interface IProps {
    items: any;
    location?: any;
}

interface IState {
    activeTab: number;
}

export default class Tab extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
        activeTab: 0,
    };
  }

    // private getTabIndexFromHash(hash) {
    //     return hash ? Object.keys(this.props.items).indexOf(hash.replace('#', '')) : 0;
    // }
    private setTab(activeTab: number) {
        this.setState({activeTab});
    }
  public render() {
      const hashLinks = Object.keys(this.props.items);
      const {activeTab} = this.state;
    return (
        <div className="apps-wrapper">
            <div className="tabs">
                {hashLinks.map((title, index) => (
                    <a key={title} onClick={this.setTab.bind(this, index)}
                        className={activeTab === index ? 'active' : ''}>
                        {title}
                    </a>
                ))}
            </div>
            <div className="tabs-content">
                {this.props.items[hashLinks[activeTab]]}
            {/* {activeTab === 0 && (
                <div>a</div>
            )}
            {activeTab === 1 && (
                <div className="pictures">
                <img src="" alt=""/>
                </div>
            )}
            {activeTab === 2 && (
                <div>
                <ul className="permissions">
                    <li>
                    <div className="per-icon">
                        <IcoN name="filter16" size={16}/>
                    </div>
                    <div className="per-info">
                        <h4>Personal Info</h4>
                        <p>Reads your personal info such as birthday, email, first name, last name, and so on.</p>
                    </div>
                    </li>
                </ul>
                </div>
            )}
            {activeTab === 3 && (
                <div>
                <Rating appId="aaa"/>
                <ul className="reviews">
                    <li>
                    <div className="rev-logo">
                        <img src="" alt=""/>
                    </div>
                    <div className="rev-info">
                        <h4>
                        Personal Info
                        <div className="rating">
                            <IcoN name="star16" size={16}/>
                            <IcoN name="star16" size={16}/>
                            <IcoN name="star16" size={16}/>
                            <IcoN name="starWire16" size={16}/>
                            <IcoN name="starWire16" size={16}/>
                        </div>
                        </h4>
                        <p>Reads your personal info such as birthday, email, first name, last name, and so on.</p>
                    </div>
                    </li>
                </ul>
                </div>
            )} */}
            </div>
        </div>
    );
  }
}
