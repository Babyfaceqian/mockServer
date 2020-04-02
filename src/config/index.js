import InterfaceManagement from '../modules/interfaceManagement/views';
import InterfacePublish from '../modules/interfacePublish/views';
import Tools from '../modules/tools/views';
export const menuList = [
  {
    name: '接口管理',
    to: '/management',
    comp: InterfaceManagement
  },
  {
    name: '接口发布',
    to: '/publish',
    comp: InterfacePublish
  },
  {
    name: '工具',
    to: '/tools',
    comp: Tools
  }
];
