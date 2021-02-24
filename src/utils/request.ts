import axios from "axios";
import {history} from "umi";
import { IUploadFileResponse, IUploadMaterialResponse } from "request-module";

const instance = axios.create({
    baseURL: "/api",
    timeout: 1000 * 30,
    headers: {
        "Content-Type": "application/json;charset=UTF-8",
    },
    withCredentials: true,
});

// Add a request interceptor
instance.interceptors.request.use(
    function(config) {
        // Do something before request is sent
        return config;
    },
    function(error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
instance.interceptors.response.use(
    function(response) {
        // Do something with response data
        if (response.status === 200 && response.data) {
            let result = response.data;
            //  将服务端返回的 message 赋值给 errorMsg，这样可以避免和 antd 的 message 组件重名
            if (typeof result === "object") {
                result.errorMsg = result.message;
            }
            if (result.code === 0) {
                //  如果 code = 0 则请求成功
                return result;
            } else if (result.code === 99998) {
                // 登录失败
                window.sessionStorage.removeItem("__USER_ACCOUNT__");
                history.replace("/login");
                return Promise.reject("登录失效");
            } else {
                // message.error(result.message || "未知错误~");
                // return Promise.reject(result);
                //  其他错误，原样返回，由开发者处理
                return result;
            }
        } else {
            return response;
            // return Promise.reject(
            //     new Error("请求好像出了点问题，要不刷新一下？")
            // );
        }
    },
    function(error) {
        // Do something with response error
        return Promise.reject(error);
    }
);

/**
 * 上传图片接口
 * @param file
 */
export const uploadFile = (file: File) => {
    const formData = new FormData();
    formData.append("appPath", "jx");
    formData.append("file", file);
    return instance.post<any, IUploadFileResponse>(
        "https://dev.xxx.com/resources-uploadfile/photo/photos",
        formData
    );
};

/**
 * 上传图片接口
 * @param file
 */
export const uploadFiles = (files: File[]) => {
    const formData = new FormData();
    formData.append("appPath", "jx");
    files.forEach(file => {
        formData.append("multipartFiles", file);
    });
    // return instance.post("/resources-uploadfile/photo/photos", formData);
    return instance.post<any, IUploadFileResponse>(
        "/resources-uploadfile/photo/photosMultiple",
        formData
    );
};

/**
 * 素材中心上传图片接口
 * @param file
 */
export const uploadMaterial = async (
    files: File[],
    param: { parentId: string; uuid?: any },
    errCallBack?: Function
) => {
    const formData = new FormData();
    formData.append("parentId", param.parentId);
    param.uuid && formData.append("uuid", param.uuid);
    files.forEach(file => {
        formData.append("files", file);
        // @ts-ignore
        formData.append("webkitRelativePath", file.webkitRelativePath);
    });
    const res = await instance.post<any, IUploadMaterialResponse>(
        "/materialCenter/upload",
        formData,
        {
            timeout: 0,
        }
    );
    if (res.code === 0 && res.data) {
        return res.data.uploadResultList;
    } else {
        errCallBack && errCallBack(res.message);
    }
};

/**
 * 上传文件,带进度条，上传成功后会同步至素材库
 * @param params
 */
export const uploadFileHasProgress = (
    params: any,
    onUploadProgress?: (progressEvent: any) => void
): Promise<any> => {
    return post("/materialCenter/upload", params, {
        timeout: 0,
        onUploadProgress,
    });
};

export default instance;

export const { get, delete: del, post, put, patch } = instance;
