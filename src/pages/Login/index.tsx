import { Component } from 'react';

class LoginPage extends Component<any, any> {
  public timer: number;
  public timeShake: boolean;
  constructor(props: any) {
    super(props);
    this.state = {};
    this.timer = 0;
    this.timeShake = true;
  }
  componentDidMount() {
    console.log('初始化componentDidMount-home类组件');
  }
  componentWillUnmount() {
    console.log('卸载home类组件');
  }
  // 倒计时
  timeTick = () => {
    let time = 60;
    this.timer = window.setInterval(() => {
      if (time <= 0) {
        clearInterval(this.timer);
        this.setState({
          time: '获取验证码',
          showSendMsg: true,
        });
      } else {
        this.setState({
          time: `${time}S`,
          showSendMsg: false,
        });
        time--;
      }
    }, 1000);
  };
  // 获取验证码
  getCode = () => {
    const {
      form: { validateFields, getFieldValue },
    } = this.props;
    const { showSendMsg } = this.state;
    validateFields(['phone'], (err: any, value: any) => {
      if (!err) {
        if (this.timeShake && showSendMsg) {
          this.timeShake = false;
          this.setState({
            time: `发送中…`,
            showSendMsg: false,
          });
          // const zone = getFieldValue('zone');
          // this.props.loginStore
          //   .getCode({ phone: value.phone, zone })
          //   .then((res: any) => {
          //     this.timeShake = true;
          //     if (!res.code) {
          //       this.timeTick();
          //     } else {
          //       this.setState({
          //         time: `获取验证码`,
          //         showSendMsg: true,
          //       });
          //     }
          //   });
        }
      }
    });
  };
  render() {
    return <div>login登录页</div>;
  }
}
export default LoginPage;
