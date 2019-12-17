import React from 'react';
import styles from './index.less';
import Header from '../header';
export default (props) => {
  const { children } = props;
  return (
    <div className={styles.wrapper}>
      <Header />
      {children}
    </div>
  )
}