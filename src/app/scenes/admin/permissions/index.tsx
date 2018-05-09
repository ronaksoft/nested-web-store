import * as React from 'react';
import {Translate, IcoN, Tab} from 'components';
import {Modal} from 'antd';
import {IPermission} from 'api/interfaces';

// import {Row, Col, Input, Upload} from 'antd';

interface IProps {
  app: string;
  /**
   * @prop routeParams
   * @desc The parameters are given by React Router
   * @type {*}
   * @memberof IOwnProps
   */
  routeParams?: any;
  location?: any;
}

interface IState {
  loading: boolean;
  permissions: IPermission[];
  untouched: boolean;
  addCategoryModal: boolean;
}

class AdminPermissions extends React.Component<IProps, IState> {
  private translator: Translate;

  /**
   * @constructor
   * Creates an instance of AppAdd.
   * @param {IAdminAppProps} props
   * @memberof Add
   */
  constructor(props: any) {
    super(props);
    let initData: any;
    if (typeof window !== 'undefined') {
      initData = window;
    }
    this.translator = new Translate();
    const state: IState = {
      loading: false,
      addCategoryModal: false,
      untouched: true,
      permissions: [
        {
          _id: 'a',
          value: 0,
          name: 'a',
          description: 'a',
          translations: [
            {
              locale: 'fa',
              name: 'سسس',
              description: 'سسسسسس',
            },
          ],
        },
        {
          _id: 'b',
          value: 2,
          name: 'b',
          description: 'b',
          translations: [
            {
              locale: 'fa',
              name: 'ششش',
              description: 'ششششش',
            },
          ],
        },
      ],
    };
    this.state = state;
  }

  private onSave() {
    console.log('aaa');
  }

  private toggleAddCategoryModal = () => {
    if (!this.state.addCategoryModal) {
      this.setState({
        addCategoryModal: true,
      });
    } else {
      this.setState({
        addCategoryModal: false,
      });
    }
  }

  private createCategory = () => {
    // ssss
  }

  private submitCreateCategoryForm = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.toggleAddCategoryModal();
    // ssss
  }
  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof AdminApp
   * @override
   * @generator
   */
  public render() {
    const validateForm = false;
    const tabs = {};
    tabs[this.translator._getText('English')] = (
      <div key="English">
        <input name="name_en" type="text" placeholder={this.translator._getText('Permission name...')}/>
        <textarea name="des_en" placeholder={this.translator._getText('Permission description...')}/>
      </div>
    );
    tabs[this.translator._getText('Persian')] = (
      <div key="Persian">
        <input name="name_fa" type="text" placeholder={this.translator._getText('Permission name...')}/>
        <textarea name="des_fa" placeholder={this.translator._getText('Permission description...')}/>
      </div>
    );
    return (
      <div className="main-container">
        <div className="main-container-inner vertical admin">
          <div className="page-buttons">
            <div className="page-buttons-inner">
              <h2><Translate>Permission Management</Translate></h2>
                <button className="butn butn-primary" onClick={this.onSave} disabled={this.state.untouched}>
                  <Translate>Save</Translate>
                </button>
            </div>
          </div>
          <div className="permissions-scene">
            <a className="add" onClick={this.toggleAddCategoryModal}>
              <IcoN name="cross24" size={24}/>
              <span>Add a permission control</span>
            </a>
            <ul className="permissions-list">
                {this.state.permissions.map((per) => (
                  <li key={per._id}>
                    <div className="per-icon">
                      <IcoN name="filter16" size={16}/>
                    </div>
                    <div className="per-info">
                      <h4>{per.name}</h4>
                      <p>{per.description}</p>
                    </div>
                    <div className="edit-button">
                      <IcoN name="pencil24" size={24}/>
                    </div>
                    <div className="remove-button">
                      <IcoN name="negativeXCross24" size={24}/>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
        <Modal
            title="Add or edit a permission"
            wrapClassName="vertical-center-modal"
            width="466px"
            visible={this.state.addCategoryModal}
            onOk={this.createCategory}
            onCancel={this.toggleAddCategoryModal}
            footer={[
              <button key="back" className="butn secondary" onClick={this.toggleAddCategoryModal}>
                <Translate>Cancel</Translate>
              </button>,
              <button key="submit" className="butn butn-primary" onClick={this.createCategory}
                disabled={!validateForm}>
                <Translate>Add</Translate>
              </button>,
            ]}
          >
            <div className="add-permission-modal">
              <input type="number" placeholder={this.translator._getText('Permission Value')}/>
              <form className="add-category-modal" onSubmit={this.submitCreateCategoryForm}>
                <Tab items={tabs}/>
                <button className="hidden-submit" type="submit" disabled={!validateForm}/>
              </form>
            </div>
        </Modal>
      </div>
    );
  }
}

export default AdminPermissions;
