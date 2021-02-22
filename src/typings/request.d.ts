declare module "request-module" {
    interface IRequestParam {}

    interface IResponseData<T> {
        data: T | T[];
        code: number;
        message: string;
    }

    interface IPagination {
        pageIndex: number;
        pageSize: number;
    }

    interface IUploadFileResponse {
        code: number;
        data: string;
    }

    interface IUploadMaterialResponse {
        code: number;
        data: {
            uploadResultList: uploadResult[];
        };
        message: string;
    }
    interface uploadResult {
        folderName?: string;
        materialId: string;
        materialName: string;
        size?: number;
        uploadStatus?: number;
        url: string;
        width?: number;
        height?: number;
        format?: string;
    }
}
