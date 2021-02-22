import { KeepAlive } from 'umi';
function KeepAliveWrapper(
  WrapperComponent: any,
  path: string,
  saveScrollPosition: any = 'screen',
) {
  return function KeepAliveInner() {
    return (
      <KeepAlive name={path} saveScrollPosition={saveScrollPosition}>
        <WrapperComponent />
      </KeepAlive>
    );
  };
}

export default KeepAliveWrapper;
