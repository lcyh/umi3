import { post } from "../../utils/request";

/**
 * 获取权限列表
 * 前端：
 * 服务端：
 * ShowDoc：
 */
export const getAuthList = async () => {
    const { data } = await post<{ authList: any[]; userName: string }>(
        "/backendUser/authority/authList"
    );
    return data;
};
