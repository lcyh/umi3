import React from 'react';
import { observer, Provider } from 'mobx-react';
import { toJS } from 'mobx';
import qs from 'qs';
import {
  Layout,
  ConfigProvider,
  Menu,
  Breadcrumb,
  Dropdown,
  Avatar,
} from 'antd';
import { History, Location } from 'history';
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { LayoutContext } from './context'; // 用于处理 layout 内部控制外层 Layout 属性
import styles from './index.less';
import IconFont from '@/components/IconFont';
import stores from '@/stores';

import {
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
moment.locale('zh-cn');

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

const IconMap: any = {
  default: 'BILIBILI_LOGO',
  ABtest: 'abtest',
  实验管理: 'experiment',
  受众管理: 'audience',
};
export interface Route {
  authority?: any;
  inherited?: any;
  path: string;
  component: any;
  name: any;
  routes?: Route[];
}
interface IBasicProps {
  location: Location;
  history: History;
  match: any;
  route: Route;
}

interface IState {
  collapsed: boolean;
  ENV: string;
  subMenuItemKeys: string[];
  headerMenuKeys: string[];
  currentThirdMenuId: number;
  subMenuOpenKeys: string[];
  menuData: any[];
}

@observer
export default class BasicLayout extends React.PureComponent<
  IBasicProps,
  IState
> {
  constructor(props: IBasicProps) {
    super(props);
    this.state = {
      collapsed: false,
      ENV: '',
      headerMenuKeys: [],
      currentThirdMenuId: 0,
      subMenuItemKeys: [],
      subMenuOpenKeys: [],
      menuData: [],
    };
  }
  async componentDidMount() {
    // 初始化
    await this.handleInitMenu();
  }
  handleInitMenu = async () => {
    // 用户信息
    const userInfo = await stores.authStore.getCurrentUserData();
    // 获取账号菜单列表
    const {
      menuList,
      validMenuList,
    } = await stores.authStore.getMenuListData();
    console.log('stores.authStore.currentUserInfo----', {
      userInfo,
      user: stores.authStore.currentUserInfo,
      menuList,
      validMenuList,
    });
    // this.setState({ menuData: menuList });
    if (!Array.isArray(toJS(validMenuList))) {
      // 如果返回值不是 数组，则表示报错或者数据为空。
      return;
    }
    const pathname = window.location.pathname;
    if (pathname === '/') {
      this.props.history.replace(validMenuList[0]);
    }
    // 设置 头部导航,左侧菜单初始化高亮状态
    stores.authStore.checkedMenuInfo(
      ({ headerMenuKeys, subMenuOpenKeys, subMenuItemKeys }) => {
        this.setState({
          headerMenuKeys,
          subMenuOpenKeys,
          subMenuItemKeys,
          menuData: menuList,
        });
      },
    );
  };
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };
  /**
   *
   * @param headerMenuKeys 当前选中的 头部导航
   */
  // 初始化 头部导航和左侧菜单选中状态
  handleInitHeaderMenu = (headerMenuKeys: string[]) => {
    const currentSelectedFirstLevelMenu: any = this.handleGetCurrentFirstLevel(
      headerMenuKeys,
    );
    // 当前打开的左侧菜单和当前选中的左侧菜单
    let currentSelectedOpenKeys: string = '',
      siderMenuKeys: string = '';
    if (currentSelectedFirstLevelMenu.children.length) {
      currentSelectedOpenKeys = `${currentSelectedFirstLevelMenu.children[0].id}`;
    }
    if (
      currentSelectedFirstLevelMenu.children[0] &&
      currentSelectedFirstLevelMenu.children[0].children.length
    ) {
      let currentThirdLevel: any =
        currentSelectedFirstLevelMenu.children[0].children[0];
      siderMenuKeys = `${currentThirdLevel.id}`;
      // 点击 头部高亮,左侧导航高亮,路由跳转
      this.props.history.push(currentThirdLevel.path);
    }
    this.setState({
      headerMenuKeys: headerMenuKeys,
      subMenuOpenKeys: [currentSelectedOpenKeys],
      subMenuItemKeys: [siderMenuKeys],
    });
  };
  // 点击 头部导航
  handleChooseHeaderMenu = (e: any) => {
    this.handleInitHeaderMenu(e.keyPath);
  };

  handleChooseSiderMenu = (e: any) => {
    this.setState({ subMenuItemKeys: e.keyPath });
  };

  handleOpenChange = (openKeys: React.ReactText[]) => {
    this.setState({ subMenuOpenKeys: openKeys as string[] });
  };

  handleMenuItemClick = (url: string) => {
    //可以 根据情况 history.replace()
    console.log('url', url);
    this.props.history.push(url);
  };

  handleGetCurrentFirstLevel = (headerMenuKeys: string[]) => {
    const { menuData } = this.state;
    if (!menuData || menuData.length === 0) {
      return;
    }
    const currentFirstLevelMenu: any =
      menuData.find(({ id }) => headerMenuKeys!.includes(id + '')) || {};
    return currentFirstLevelMenu;
  };
  handleLogout = async () => {
    console.log('退出登录');
    // await Service.loginOut();
    // this.props.history.push('/login');
  };
  renderHeaderMenu = () => {
    const { menuData, headerMenuKeys } = this.state;
    const { currentUserInfo } = stores.authStore;
    console.log('currentUserInfo', currentUserInfo);

    return (
      <Header className={styles['header']}>
        <div className={styles['logo']}>
          <IconFont type={`icon-${IconMap['default']}`} />
        </div>
        <Menu
          onClick={this.handleChooseHeaderMenu}
          selectedKeys={headerMenuKeys}
          mode="horizontal"
          className={styles['header-menu']}
          theme="dark"
        >
          {menuData.map(({ id, name }) => {
            return (
              <Menu.Item
                key={id}
                // icon={<MailOutlined />}
              >
                <div>{name}</div>
              </Menu.Item>
            );
          })}
        </Menu>
        <div className={styles['header-right']}>
          <Dropdown
            className={styles['user-info']}
            overlay={
              <Menu>
                <Menu.Item onClick={this.handleLogout}>退出登录</Menu.Item>
              </Menu>
            }
          >
            <div>
              <Avatar
                size={30}
                src={currentUserInfo.avatar}
                icon={<UserOutlined />}
              />
              <span className={styles['user-name']}>
                {currentUserInfo.name}
              </span>
            </div>
          </Dropdown>
        </div>
      </Header>
    );
  };
  renderSiderMenu = () => {
    const { subMenuOpenKeys, subMenuItemKeys, headerMenuKeys } = this.state;
    const currentSelectedFirstLevelMenu: any = this.handleGetCurrentFirstLevel(
      headerMenuKeys,
    );
    if (
      !currentSelectedFirstLevelMenu ||
      !currentSelectedFirstLevelMenu.children
    ) {
      return;
    }
    return (
      <Menu
        theme="dark"
        mode="inline"
        openKeys={subMenuOpenKeys}
        selectedKeys={subMenuItemKeys}
        onOpenChange={this.handleOpenChange}
        onClick={this.handleChooseSiderMenu}
      >
        {currentSelectedFirstLevelMenu.children.map(
          ({ id, name, children: thirdLevelList }: any) => {
            return (
              <SubMenu
                key={id}
                icon={<QuestionCircleOutlined />}
                title={
                  <span>
                    {/* <IconFont type={`icon-${IconMap[name] || 'default'}`} /> */}
                    <span>{name}</span>
                  </span>
                }
              >
                {thirdLevelList.map(({ id, name, path, visible }: any) =>
                  // visible：1（展示），0（不展示）
                  visible ? (
                    <Menu.Item
                      icon={
                        <IconFont type={`icon-${IconMap[name] || 'default'}`} />
                      }
                      key={id}
                      onClick={() => this.handleMenuItemClick(path)}
                    >
                      {name}
                    </Menu.Item>
                  ) : null,
                )}
              </SubMenu>
            );
          },
        )}
      </Menu>
    );
  };
  getCurrentRoute = (currentPath?: string) => {
    // 获取当前路径信息
    const { location } = this.props;
    const { menuData } = this.state;
    if (!location || !location.pathname || location.pathname.length < 3) {
      return null;
    }
    let currentPathName = currentPath || location.pathname;
    let oneLevel = '',
      twoLevel = '',
      threeLevel = '',
      firstLevelPath = '',
      secondLevelPath = '',
      thirdLevelPath = '',
      currentThirdMenuId,
      currentSecondMenuId,
      currentFirstMenuId;
    menuData!.forEach((firstLevel) => {
      firstLevel.children.forEach((secondLevel: any) => {
        secondLevel.children.forEach((thirdLevel: any) => {
          if (thirdLevel.path === currentPathName) {
            threeLevel = thirdLevel.name;
            twoLevel = secondLevel.name;
            oneLevel = firstLevel.name;
            firstLevelPath = firstLevel.path;
            secondLevelPath = secondLevel.path;
            thirdLevelPath = thirdLevel.path;
            currentThirdMenuId = thirdLevel.id;
            currentSecondMenuId = secondLevel.id;
            currentFirstMenuId = firstLevel.id;
            return;
          }
        });
      });
    });

    return {
      oneLevel,
      twoLevel,
      threeLevel,
      firstLevelPath,
      secondLevelPath,
      thirdLevelPath,
      headerMenuKeys: [`${currentFirstMenuId}`],
      subMenuOpenKeys: [`${currentSecondMenuId}`],
      subMenuItemKeys: [`${currentThirdMenuId}`],
    };
  };
  handleClickBreadCrumbJump = (path: string) => {
    this.props.history.push(path);
    const currentRoute = this.getCurrentRoute(path);
    if (!currentRoute) {
      return null;
    }
    const { headerMenuKeys, subMenuOpenKeys, subMenuItemKeys } = currentRoute;
    this.setState({ headerMenuKeys, subMenuOpenKeys, subMenuItemKeys });
  };
  getBreadcrumb = () => {
    // 面包屑获取当前页面名称
    const currentRoute = this.getCurrentRoute();
    if (!currentRoute) {
      return null;
    }
    const {
      oneLevel,
      twoLevel,
      threeLevel,
      firstLevelPath,
      secondLevelPath,
      thirdLevelPath,
    } = currentRoute;
    return (
      <div className={styles['breadcrumb-wrapper']}>
        <Breadcrumb className={styles['breadcrumb-list']} separator={'/'}>
          <Breadcrumb.Item
            onClick={() => this.handleClickBreadCrumbJump(firstLevelPath)}
          >
            {oneLevel || '未配置'}
          </Breadcrumb.Item>
          <Breadcrumb.Item
            onClick={() => this.handleClickBreadCrumbJump(secondLevelPath)}
          >
            {twoLevel || '未配置'}
          </Breadcrumb.Item>
          <Breadcrumb.Item
            onClick={() => this.handleClickBreadCrumbJump(thirdLevelPath)}
          >
            {threeLevel || '未配置'}
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
    );
  };

  render() {
    const {
      route: { routes },
      children,
    } = this.props;
    console.log('basicLayout-this.props-routes', { props: this.props });

    const { collapsed, ENV, menuData } = this.state;
    //左侧菜单
    const layout = (
      <Layout className={styles['layout-wrapper']}>
        {this.renderHeaderMenu()}
        <Layout>
          <Sider
            trigger={
              <div className={styles['menu-icon']} onClick={this.toggle}>
                {React.createElement(
                  this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                )}
              </div>
            }
            width={200}
            collapsible
            collapsed={collapsed}
            className={styles['sider-wrapper']}
          >
            {this.renderSiderMenu()}
          </Sider>
          <Layout className={styles['right-layout']}>
            {this.getBreadcrumb()}
            <Content className={styles['layout-content']}>
              <h1>Content</h1>
              {children}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
    return (
      <React.Fragment>
        {/* <Provider store={stores}> */}
        <LayoutContext.Provider
          value={{
            ...stores,
            // ENV,
            // location,
            // history,
            // routes: menuData,
            // query: qs.parse(location.search.substr(1)),
          }}
        >
          <ConfigProvider locale={zhCN}>
            {/*这里可以展示页面的其他信息*/}
            <div>{layout}</div>
          </ConfigProvider>
        </LayoutContext.Provider>
        {/* </Provider> */}
      </React.Fragment>
    );
  }
}
