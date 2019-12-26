import React, { useState, useEffect } from 'react';
import styles from './index.less';
import * as Fetch from '../apis';
import { Select, Row, Col, Button, Tooltip, message } from 'antd';
export default () => {
  const [templateIds, setTemplateIds] = useState([]);
  const [templateList, setTemplateList] = useState([]);
  const [isTemplateLoading, setIsTemplateLoading] = useState(false);
  // 当前选用接口集
  console.log('templateList', templateList);

  const fetchCurrentTemplate = () => {
    Fetch.getCurrent().then(res => {
      if (res && res.success) {
        setTemplateIds(res.data || {});
      }
    })
  }

  const fetchTemplateList = (cb) => {
    setIsTemplateLoading(true);
    Fetch.getConfig().then(res => {
      if (res && res.success) {
        let data = res.data || [];
        setTemplateList(data);
        cb && cb();
        setIsTemplateLoading(false);
      }
    });
  }
  const handleTemplateChange = (value) => {
    setTemplateIds(value);
  }

  const handleReload = () => {
    Fetch.reload().then(res => {
      if (res && res.success) {
        message.success('重载服务成功，请等待10秒再调用接口');
      }
    })
  }


  const submitCurrent = () => {
    Fetch.setCurrent({
      templateIds
    })
      .then(res => {
        if (res && res.success) {
          fetchCurrentTemplate();
          message.success({
            content: '选择成功'
          });
        }
      });
  }
  // 副作用
  useEffect(() => {
    fetchTemplateList();
    fetchCurrentTemplate();
  }, []);
  return (
    <div className={styles.interfacePublish}>
      <div className={styles.left}>

        <Row className={styles.row}>
          <Col span={4} className={styles.label}>
            选择接口集：
        </Col>
          <Col span={8}>
            <Select
              mode="multiple"
              onChange={handleTemplateChange}
              className={styles.select}
              value={templateIds}
              onFocus={fetchTemplateList}
              loading={isTemplateLoading}
            >
              {templateList.map((d, i) => {
                return <Select.Option key={i} value={d.id}>{d.name}</Select.Option>
              })}
            </Select>
          </Col>
          <Tooltip title="更新接口集"><Button type="primary" icon="check" className={styles.rightBtn} onClick={submitCurrent} disabled={templateIds.length === 0}></Button></Tooltip>
          <Tooltip title="重载服务"><Button type="primary" icon="reload" className={styles.rightBtn} onClick={handleReload}></Button></Tooltip>
        </Row>
      </div>
    </div>
  )
}