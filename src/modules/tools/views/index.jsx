import React from 'react';
import styles from './index.less';
import * as Fetch from '../apis';
import { Button, message } from 'antd';
export default () => {
  const clearZombieData = () => {
    Fetch.clearZombieData().then(res => {
      if (res.success) {
        message.success('清理成功');
      } else {
        message.error('清理失败');
      }
    })
  }
  return (
    <div className={styles.tools}>
      <Button type="primary" onClick={clearZombieData}>清理僵尸数据</Button>
    </div>
  )
}