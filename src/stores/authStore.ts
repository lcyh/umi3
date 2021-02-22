import { observable, action } from 'mobx';
import { message } from 'antd';
import { auth } from '@/services';
import { IAuthInfo, IAccountInfo, IMenuInfo } from 'auth-store-module';
import { sysLoginOut } from '@/utils/request';

// 登录注册状态
class AuthStore {
  //当前用户
  @observable currentUserInfo: any = {};

  @observable
  accountInfo: any = { account: '' };

  @observable
  menuList: any[] = [];

  //当前选中的一级菜单
  @observable
  currentFirstMenu: number = 0;

  //当前选中的三级菜单
  @observable
  currentMenuInfo: number = 0;

  //当前展开的菜单
  @observable
  currentOpenKeys: string[] = [''];

  //当前账号，有效的菜单列表，存储的为路由数组
  //系统中有些默认页面，是无需校验权限的，所以放在数组中。
  //"/demo/list", "/demo/detail", "/demo/upload"
  @observable
  validMenuList: string[] = [];

  @observable
  loading: boolean = true;

  @action
  async getCurrentUserData() {
    const { code, data, message: errorMsg } = await auth.getCurrentUser();
    if (code !== 0) {
      return message.error(errorMsg);
    }
    this.currentUserInfo = data || {};
    return data;
  }

  @action
  async getMenuListData() {
    this.loading = true;
    const { code, message: errorMsg, data } = await auth.getAuthList();
    this.loading = false;
    if (code !== 0) {
      return message.error(errorMsg);
    }
    if (!data.authList || data.authList.length === 0) {
      message.error('权限菜单为空');
      return sysLoginOut();
    }
    //  兼容 SSO 登录模式下，无法获取到 用户名 的问题
    if (data.userName) {
      window.localStorage.setItem('__USER_ACCOUNT__', data.userName);
    }
    this.menuList = data.authList;
    //  设置一个默认值，防止未匹配的情况
    this.currentFirstMenu = this.menuList[0].id;
    for (let firstItem of this.menuList) {
      const { children: secondLevelList } = firstItem;
      for (let secondItem of secondLevelList) {
        const thirdLevelList = this.sortByShowTypeThirdLevelList(
          secondItem.children,
        );
        for (let thirdItem of thirdLevelList) {
          //  把有效的菜单路由存储起来，后续做鉴权需要此数据
          this.validMenuList.push(thirdItem.path);
        }
      }
    }
    return {
      validMenuList: this.validMenuList,
      menuList: this.menuList,
    };
  }

  sortByShowTypeThirdLevelList(thirdLevelList: IMenuInfo[]) {
    return thirdLevelList.sort((a: any, b: any) => b.visible - a.visible);
  }

  //  选中当前菜单。
  //  TODO：优化此处与 getMenuList 的逻辑
  checkedMenuInfo = (fn: (res: any) => void) => {
    const pathname = window.location.pathname;
    //  设置一个默认值，防止未匹配的情况
    let currentFirstMenuId, currentSecondMenuId, currentThirdMenuId;
    const currentFirstMenuInfo = this.menuList.find(
      ({ children: secondLevelList }) => {
        return secondLevelList.find(({ children: thirdLevelList }: any) => {
          return (
            thirdLevelList.filter(({ path }: any) => path === pathname).length >
            0
          );
        });
      },
    );
    // 第一级路由id根据 pathname判断
    currentFirstMenuId = currentFirstMenuInfo
      ? currentFirstMenuInfo.id
      : this.menuList[0].id;
    // loop 标识最外层 for 的标记，用于在内层终止外层循环
    loop: for (let firstItem of this.menuList) {
      const { children: secondLevelList } = firstItem;
      for (let secondItem of secondLevelList) {
        const { children: thirdLevelList } = secondItem;
        for (let thirdItem of thirdLevelList) {
          if (thirdItem.path === pathname) {
            currentThirdMenuId = thirdItem.id;
            currentSecondMenuId = secondItem.id;
            break loop;
          }
        }
      }
    }
    let selectedKeys = {
      headerMenuKeys: [`${currentFirstMenuId}`],
      subMenuOpenKeys: [`${currentSecondMenuId}`],
      subMenuItemKeys: [`${currentThirdMenuId}`],
    };
    fn && fn(selectedKeys);

    return selectedKeys;
  };
}

export default new AuthStore();

export type IAuthStore = AuthStore;
