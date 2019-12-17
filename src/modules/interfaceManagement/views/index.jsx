import React, { useState, useEffect } from 'react';
import styles from './index.less';
import * as Fetch from '../apis';
import { Select, Row, Col, Input, Button, Modal, message } from 'antd';
import JsonFormat from 'json-format';
let didMount = false;
export default () => {
  const [templateId, setTemplateId] = useState('');
  const [templateList, setTemplateList] = useState([]);
  const [pathDict, setPathDict] = useState({});
  const [path, setPath] = useState('');
  const [pathData, setPathData] = useState('{}');
  const [isShowAddTemplate, setIsShowAddTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [isShowAddPath, setIsShowAddPath] = useState(false);
  const [pathName, setPathName] = useState('');
  const [method, setMethod] = useState('GET');
  const [currentTemplate, setCurrentTemplate] = useState({});
  // loading状态
  const [isTemplateLoading, setIsTemplateLoading] = useState(false);
  const [isPathLoading, setIsPathLoading] = useState(false);


  const fetchCurrentTemplate = () => {
    Fetch.getCurrent().then(res => {
      if (res && res.success) {
        setCurrentTemplate(res.data || {});
      }
    })
  }
  function fetchPathDict(id) {
    setIsPathLoading(true);
    Fetch.getPathDict({ id })
      .then(res => {
        if (res && res.success) {
          let data = res.data || {};
          setPathDict(data);
        }
        setIsPathLoading(false);
      });
  }
  const fetchTemplateList = () => {
    setIsTemplateLoading(true);
    Fetch.getConfig().then(res => {
      if (res && res.success) {
        let data = res.data || [];
        setTemplateList(data);
      }
      setIsTemplateLoading(false);
    });
  }
  const handleTemplateChange = (id) => {
    setTemplateId(id);
    setPath('');
    setPathDict({});
    // fetchPathDict(id);
  }
  const handlePathChange = (path) => {
    setPath(path);
    let id = pathDict[path].id;
    Fetch.getPathData({
      id
    })
      .then(res => {
        if (res && res.success) {
          let data = res.data || {};
          data = JsonFormat(data);
          setPathData(data);
        }
      });
  }
  const handlePathDataChange = (e) => {
    setPathData(e.target.value);
  }
  const handleUpdateClick = () => {
    let data = pathData.replace(/\s*/g, "");
    Fetch.updatePathData({
      templateId,
      path,
      pathData: data
    })
      .then(res => {
        if (res && res.success) {
          message.success({
            content: '更新成功'
          });
        }
      });
  }
  const handleAddTemplate = () => {
    setIsShowAddTemplate(true);
  }
  const handleTemplateNameChange = (e) => {
    setTemplateName(e.target.value.trim());
  }
  const submitAddTemplate = () => {
    setIsShowAddTemplate(false);
    Fetch.createTemplate({
      name: templateName
    })
      .then(res => {
        if (res && res.success) {
          // fetchTemplateList();
          message.success({
            content: '添加成功'
          });
        }
      });
  }
  const handleAddPath = () => {
    setIsShowAddPath(true);
  }
  const handlePathNameChange = (e) => {
    setPathName(e.target.value)
  }
  const handleMethodChange = (value) => {
    setMethod(value);
  }
  const submitAddPath = () => {
    setIsShowAddPath(false);
    Fetch.createPath({
      templateId,
      path: pathName,
      method: method
    })
      .then(res => {
        if (res && res.success) {
          setMethod('GET');
        }
      });
  }
  const submitCurrent = () => {
    if (!templateId) {
      message.warning({
        content: '请选择模板'
      });
      return;
    }
    Fetch.setCurrent({
      templateId
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
  const deleteTemplate = () => {
    const onOk = function () {
      Fetch.deleteTemplate({
        templateId
      })
        .then(res => {
          if (res && res.success) {
            fetchTemplateList();
            setTemplateId('');
            setPath('');
            message.success({
              content: '删除成功'
            });
          } else {
            message.warning({
              content: res.msg
            });
          }
        });
    }
    Modal.confirm({
      title: 'Confirm',
      content: '确定要删除吗？',
      okText: '确认',
      cancelText: '取消',
      onOk
    });
  }
  const handleDeletePath = () => {
    const onOk = function () {
      Fetch.deletePath({
        templateId,
        path
      })
        .then(res => {
          if (res && res.success) {
            fetchPathDict();
            setPath('');
            message.success({
              content: '删除成功'
            });
          } else {
            message.warning({
              content: res.msg
            });
          }
        });
    }
    Modal.confirm({
      title: 'Confirm',
      content: '确定要删除吗？',
      okText: '确认',
      cancelText: '取消',
      onOk
    });
  }

  const handleReload = () => {
    Fetch.reload().then(res => {
      if (res && res.success) {
        message.success('重载服务成功，请等待10秒再调用接口');
      }
    })
  }

  // 副作用
  useEffect(() => {
    if (!didMount) {
      didMount = true;
      fetchCurrentTemplate();
    }
  });
  return (
    <div className={styles.interfaceManagement}>
      <div className={styles.left}>
        {/* 模板 */}
        <Row className={styles.row}>
          <Col span={4} className={styles.label}>
            选择模板：
        </Col>
          <Col span={8}>
            <Select onChange={handleTemplateChange} className={styles.select} value={templateId} onFocus={fetchTemplateList} loading={isTemplateLoading}>
              {templateList.map((d, i) => {
                return <Select.Option key={i} value={d.id}>{d.name}</Select.Option>
              })}
            </Select>
          </Col>
          <Button type="primary" className={styles.rightBtn} onClick={handleAddTemplate}>新建模板</Button>
          <Button type="primary" className={styles.rightBtn} onClick={submitCurrent}>选用模板</Button>
          <Button type="danger" className={styles.rightBtn} onClick={deleteTemplate} disabled={!templateId}>删除模板</Button>
        </Row>
        {/* 接口 */}
        {
          templateId && <Row className={styles.row}>
            <Col span={4} className={styles.label}>
              选择接口：
        </Col>
            <Col span={8}>
              <Select onChange={handlePathChange} className={styles.select} value={path} onFocus={() => fetchPathDict(templateId)} loading={isPathLoading}>
                {Object.keys(pathDict).map((key, i) => {
                  return <Select.Option key={i} value={key}>{key}</Select.Option>
                })}
              </Select>
            </Col>
            <Button type="primary" className={styles.rightBtn} onClick={handleAddPath}>新建接口</Button>
            <Button type="danger" className={styles.rightBtn} onClick={handleDeletePath} disabled={!path}>删除接口</Button>
          </Row>
        }
        {/* 接口数据 */}
        {
          path && <Row className={styles.row}>
            <Col span={4} className={styles.label}>
              接口数据：
        </Col>
            <Col span={20}>
              <Input.TextArea value={pathData} onChange={handlePathDataChange} rows="20" />
            </Col>
          </Row>
        }

        {
          path && <Row className={styles.row}>
            <Col offset={4}>
              <Button type="primary" onClick={handleUpdateClick}>更新</Button>
            </Col>
          </Row>
        }
        {/* 新建模板 */}
        <Modal
          visible={isShowAddTemplate}
          onOk={submitAddTemplate}
          onCancel={() => setIsShowAddTemplate(false)}
        >
          <Row className={styles.row}>
            <Col span={6} className={styles.label}>
              模板名称：
        </Col>
            <Col span={14}>
              <Input value={templateName} onChange={handleTemplateNameChange} />
            </Col>
          </Row>
        </Modal>
        {/* 新建接口 */}
        <Modal
          visible={isShowAddPath}
          onOk={submitAddPath}
          onCancel={() => setIsShowAddPath(false)}
        >
          <Row className={styles.row}>
            <Col span={6} className={styles.label}>
              接口名称：
        </Col>
            <Col span={14}>
              <Input value={pathName} onChange={handlePathNameChange} />
            </Col>
          </Row>
          <Row>
            <Col span={6} className={styles.label}>
              方法：
        </Col>
            <Col span={14}>
              <Select value={method} onChange={handleMethodChange} >
                <Select.Option value="GET">GET</Select.Option>
                <Select.Option value="POST">POST</Select.Option>
              </Select>
            </Col>
          </Row>
        </Modal>
      </div>
      <div className={styles.right}>
        <Row className={styles.row}>
          <Col span={6} className={styles.label}>
            当前模板：
        </Col>
          <Col span={14} className={styles.labelText}>
            {currentTemplate.name}
          </Col>
          <Button type="primary" className={styles.rightBtn} onClick={handleReload}>重载服务</Button>
        </Row>
        <Row className={styles.row}>
          <Col span={6} className={styles.label}>
            当前接口：
        </Col>
          <Col span={14}>
            <ul className={styles.list}>
              {(currentTemplate.list || []).map(d => {
                return (
                  <li>
                    {d}
                  </li>
                )
              })}
            </ul>
          </Col>
        </Row>
      </div>
    </div>
  )
}