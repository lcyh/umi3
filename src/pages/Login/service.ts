import { post,get } from "@/utils/request";

/**
 * 登录
 * @param data
 */
export const accountLogin = (
    account: string,
    verifyCode: string,
    ticket?: string,
    randstr?: string
): Promise<any> => {
    return post("/account/login", {
        loginType: "phone",
        account,
        verifyCode,
        ticket,
        randstr,
    });
};
/**
 * 模拟获取验证码
 * @param mobile 手机号
 */
export const getVerifyCode = (mobile: string): Promise<any> => {
  return get(`/login/captcha?mobile=${mobile}`, {});
};


