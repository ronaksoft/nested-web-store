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
        <div className="content-wrapper">
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
            </div>
        </div>
    );
  }
}
