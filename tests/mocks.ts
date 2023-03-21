import {jest} from "@jest/globals";

export
const app = {
    getCompanyInformation: jest.fn(),
    getAppConfig: jest.fn(),
    setAppConfig: jest.fn()
};
export
const ITFinApp = {
    createCommunityApp: () => {
        return app;
    }
};
export 
const ITFinRequest = {
    post: jest.fn()
}

let globalWithITFin = global as typeof globalThis & {
    app: object;
    ITFinApp: object;
    ITFinRequest: object;
};
globalWithITFin.app = app;
globalWithITFin.ITFinApp = ITFinApp;
globalWithITFin.ITFinRequest = ITFinRequest;
