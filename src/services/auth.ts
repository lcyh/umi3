import { post,get } from "@/utils/request";

/**
 * 登录
 * @param data
 */
export const getAuthList = (): Promise<any> => {
    return get("/authList", {});
};

export const getCurrentUser = (): Promise<any> => {
    return get("/currentUser", {});
};

/**
 * 校验登录状态
 * @param data
 */
export const checkLogin = (): Promise<any> => {
    return post("/user/checkLogin", {});
};

// 退出登录
export const sysLoginOut = () => {
    //  清除保存的信息
    localStorage.removeItem('token');
    window.localStorage.removeItem('__USER_ACCOUNT__');
    return post('/login/outLogin');
};