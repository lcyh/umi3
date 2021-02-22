/**
 * 获取 URL 参数
 * @param key  参数
 */
export const getQueryParams = (key: string) => {
    let urlParm = window.location.href.split("?")[1];
    let reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
    if (urlParm) {
        let r = urlParm.match(reg);
        return r != null ? decodeURI(r[2]) : "";
    } else {
        return "";
    }
};
