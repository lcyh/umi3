import { createContext,useContext } from 'react';
// import { fixContext } from 'react-activation'

export const LayoutContext = createContext({} as any);

export const useStore = () => {
    const store = useContext(LayoutContext);
    if (!store) {
        throw new Error("请在 <StoreProvider> 组件中使用");
    }
    return store;
};
// const { Provider, Consumer } = Context;
// fixContext(Context)

// const LayoutContext = createContext({} as any);

