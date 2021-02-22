declare module "auth-store-module" {
    /**
     * 账户信息
     */
    interface IAccountInfo {
        account: string;
    }

    //  菜单对象定义具体缘由可以查看此处：http://showdoc.weimob.com/index.php?s=/96&page_id=21142
    /**
     * 权限信息（对应系统头部的快捷菜单）
     */
    interface IAuthInfo {
        id: number;
        name: string;
        children: ISecondLevel[];
        [key:string]:any;
    }

    /**
     * 二级菜单（对应系统左侧的一级菜单）
     */
    interface ISecondLevel {
        id: number;
        name: string;
        children: IMenuInfo[];
        [key:string]:any;
    }

    /**
     * 三级菜单（对应系统左侧的二级菜单）
     */
    interface IMenuInfo {
        id: number;
        name: string;
        sourceTarget?: string;
        showType: number;
        [key:string]:any;
    }
}
