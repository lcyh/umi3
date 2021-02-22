import { observable, action } from "mobx";
import { message } from "antd";
import { app } from "@/services";

/**
 * 系统全局数据
 */
class AppStore {
    //  当前登录用户信息
    @observable
    userInfo: any = {};

    //  未读消息列表
    @observable
    unreadMsgList: any = [];

    @observable
    unread: number = 0;

    //  用于存储 Form 中表单数据
    @observable
    searchForm: any = {};

    //  获取未读消息列表
    @action
    async refreshUnreadMsgList() {
        const { code, errorMsg, data } = await app.getMsglist({ msgRead: 0 });
        if (code !== 0) {
            return message.error(errorMsg);
        }
        this.unreadMsgList = data.msgs || [];
    }

    @action
    async getMsgUnreadCount() {
        const { code, errorMsg, data } = await app.getMsgUnreadCount();
        if (code !== 0) {
            return message.error(errorMsg);
        }
        this.unread = data.unread || 0;
    }

    @action
    setFormParams(searchForm: any) {
        this.searchForm = searchForm;
    }

}

export default new AppStore();

export type IAppStore = AppStore;
