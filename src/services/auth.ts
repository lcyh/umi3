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
