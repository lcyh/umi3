/*
 * @Author: changluo
 * @Description: 
 */
// src/access.ts
export default function(initialState:any) {
    console.log('initialState',initialState);
    const { userId, role,hasRoutes=[] } = initialState;
   
    return {
      canReadFoo: true,
      canUpdateFoo: role ==='admin',
      canDeleteFoo: (curRoute:any) => {
        if(curRoute){
            return hasRoutes.includes(curRoute.name);
        }
        return false;
      },
      canCustomFoo: (cusParams:any) => {
        if(cusParams){
            return hasRoutes.owerId===userId;
        }
        return false;
      },
    };
  }
  