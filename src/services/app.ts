import { post } from "@/utils/request";

/**
 * 获取消息列表
 * @param
 */
export const getMsglist = (params: any): Promise<any> => {
    return post("/msg/shopmsg/getlist", params);
};

/**
 * 获取未读消息列表
 * @param
 */
export const getMsgUnreadCount = (params?: any): Promise<any> => {
    return post("/msg/shopmsg/msgcount", params);
};
