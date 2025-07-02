export { };

declare global {
    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }

    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: T[];
    }

    interface ILogin {
        access_token: string;
        user: {
            _id: string;
            name: string;
            email: string;
        };
    }

    interface IRegister {
        _id: string;
        createdAt: string;
    }

    interface IUser {
        email: string;
        name: string;
        _id: string;
    }

    interface IFetchAccount {
        user: IUser;
    }



}