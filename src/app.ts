import { autoFixContext } from 'react-activation'

autoFixContext(
 [require('react/jsx-runtime'), 'jsx', 'jsxs', 'jsxDEV'],
// @ts-ignore
 [require('react/jsx-dev-runtime'), 'jsx', 'jsxs', 'jsxDEV']
)

/**
getInitialState会在整个应用最开始执行，返回值会作为全局共享的数据。
Layout 插件、Access 插件以及用户都可以通过 useModel('@@initialState') 直接获取到这份数据
*/
export async function getInitialState() {
  // const permissions = await fetchUserPermissions();
  const permissions = {
    userId:'110', 
    role:'admin',
    hasRoutes:['/abtest/experiment','/abtest/audience'] 
  };
  return permissions;
}


