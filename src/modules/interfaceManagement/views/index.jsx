import React, { useState, useEffect } from 'react';
import styles from './index.less';
import * as Fetch from '../apis';
import { Select, Row, Col, Input, Button, Modal, message, Tooltip } from 'antd';
import JsonFormat from 'json-format';
export default () => {
  // 接口集
  const [templateId, setTemplateId] = useState('');
  const [templateList, setTemplateList] = useState([]);
  // 接口
  const [pathDict, setPathDict] = useState({});
  const [path, setPath] = useState('');
  // 函数
  const [fn, setFn] = useState('');
  // 接口数据
  const [dataIndex, setDataIndex] = useState('');
  const [pathData, setPathData] = useState('{}');
  // 添加接口集
  const [isShowAddTemplate, setIsShowAddTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');
  // 复制接口集
  const [isShowCopyTemplate, setIsShowCopyTemplate] = useState(false);
  // 编辑接口集
  const [isShowEditTemplate, setIsShowEditTemplate] = useState(false);
  // 添加接口
  const [isShowAddPath, setIsShowAddPath] = useState(false);
  const [pathName, setPathName] = useState('');
  const [method, setMethod] = useState('GET');
  // 编辑接口
  const [isShowEditPath, setIsShowEditPath] = useState(false);
  // // 当前选用接口集
  // const [currentTemplate, setCurrentTemplate] = useState({});
  // loading状态
  const [isTemplateLoading, setIsTemplateLoading] = useState(false);
  const [isPathLoading, setIsPathLoading] = useState(false);
  // // 重载提示
  // const [isNeedToReload, setIsNeedToReload] = useState(false);
  // 变量
  let pathObj = pathDict[path] || {};

  // const fetchCurrentTemplate = () => {
  //   Fetch.getCurrent().then(res => {
  //     if (res && res.success) {
  //       setCurrentTemplate(res.data || {});
  //     }
  //   })
  // }
  function fetchPathDict(id, cb) {
    setIsPathLoading(true);
    Fetch.getPathDict({ id })
      .then(res => {
        if (res && res.success) {
          let data = res.data || {};
          setPathDict(data);
          cb && cb();
        }
        setIsPathLoading(false);
      });
  }
  const fetchTemplateList = (cb) => {
    setIsTemplateLoading(true);
    Fetch.getConfig().then(res => {
      if (res && res.success) {
        let data = res.data || [];
        setTemplateList(data);
        cb && cb();
      }
      setIsTemplateLoading(false);
    });
  }
  const handleTemplateChange = (id) => {
    setTemplateId(id);
    setPath('');
    setDataIndex('');
    setPathDict({});
    // fetchPathDict(id);
  }
  const fetchGetPathData = (id) => {
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
  };
  const fetchGetFn = (id) => {
    Fetch.getFn({ id }).then(res => {
      if (res && res.success) {
        setFn(res.data);
      }
    })
  }
  const handlePathChange = (path) => {
    setPath(path);
    let pathObj = pathDict[path];
    let id = pathObj.ids[0];
    let fnId = pathObj.fnId;
    fetchGetFn(fnId);
    setDataIndex('');
    fetchGetPathData(id);
  }
  const handlePathDataChange = (e) => {
    setPathData(e.target.value);
  }
  const handleUpdateClick = () => {
    let pathObj = pathDict[path];
    let pathDataId = pathObj.ids[dataIndex];
    Fetch.updatePathData({
      pathDataId,
      pathData
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
          message.success({
            content: '添加成功'
          });
          let id = res.data || '';
          fetchTemplateList(() => {
            setTemplateId(id);
          })
        }
      });
    setTemplateName('');
  }
  const handleAddPath = () => {
    setIsShowAddPath(true);
  }
  const handlePathNameChange = (e) => {
    setPathName(e.target.value.trim())
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
          fetchPathDict(templateId, () => {
            setPath(pathName);
          });
          // if (currentTemplate.id === templateId) {
          //   setIsNeedToReload(true);
          // }
        }
      });
    setPathName('');
    setDataIndex('');
    setFn('');
    setPathData('');
    setMethod('GET');
  }
  // const submitCurrent = () => {
  //   if (!templateId) {
  //     message.warning({
  //       content: '请选择接口集'
  //     });
  //     return;
  //   }
  //   Fetch.setCurrent({
  //     templateId
  //   })
  //     .then(res => {
  //       if (res && res.success) {
  //         fetchCurrentTemplate();
  //         if (currentTemplate.id !== templateId) {
  //           setIsNeedToReload(true);
  //         }
  //         message.success({
  //           content: '选择成功'
  //         });
  //       }
  //     });
  // }
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
            setDataIndex('');
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
            setDataIndex('');
            message.success({
              content: '删除成功'
            });
            // if (currentTemplate.id === templateId) {
            //   setIsNeedToReload(true);
            // }
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

  const handleFnChange = (e) => {
    setFn(e.target.value.trim());
  }

  const updatePathFn = () => {
    let pathObj = pathDict[path];
    console.log('pathObj', pathObj)
    let fnId = pathObj.fnId;
    Fetch.updatePathFn({ fnId, fn }).then(res => {
      if (res && res.success) {
        message.success('更新成功')
      }
    })
  }

  const handleReload = () => {
    Fetch.reload().then(res => {
      if (res && res.success) {
        message.success('重载服务成功，请等待10秒再调用接口');
        // setIsNeedToReload(false);
      }
    })
  }

  const handleDataIndexChange = (index) => {
    setDataIndex(index);
    let id = pathObj.ids[index];
    fetchGetPathData(id);
  }

  const handleAddPathData = () => {
    Fetch.addPathData({ templateId, path }).then(res => {
      if (res && res.success) {
        message.success('添加成功');
        fetchPathDict(templateId);
      }
    })
  }

  const handleDeletePathData = () => {
    if (pathObj.ids.length === 1) {
      message.warning('至少存在一个条件数据');
      return;
    }
    const onOk = () => {
      Fetch.deletePathData({ templateId, path, index: dataIndex }).then(res => {
        if (res && res.success) {
          fetchPathDict(templateId);
          setDataIndex('');
        }
      })
    }
    Modal.confirm({
      title: 'Confirm',
      content: '确定要删除吗？',
      okText: '确认',
      cancelText: '取消',
      onOk
    });
  }

  const handleCopyTemplate = () => {
    setIsShowCopyTemplate(true);
  }

  const submitCopyTemplate = () => {
    setIsShowCopyTemplate(false);
    Fetch.copyTemplate({
      copyId: templateId,
      name: templateName
    })
      .then(res => {
        if (res && res.success) {
          message.success({
            content: '复制成功'
          });
          let id = res.data || '';
          fetchTemplateList(() => {
            setTemplateId(id);
          })
        }
      });
    setTemplateName('');
  }

  const handleEditTemplate = () => {
    setIsShowEditTemplate(true);
    setTemplateName(templateList.find(d => d.id === templateId).name);
  }

  const submitEditTemplate = () => {
    setIsShowEditTemplate(false);
    Fetch.editTemplate({
      id: templateId,
      name: templateName
    })
      .then(res => {
        if (res && res.success) {
          message.success({
            content: '修改成功'
          });
          let id = res.data || '';
          fetchTemplateList();
        }
      });
    setTemplateName('');
  }

  const handleEditPath = () => {
    setIsShowEditPath(true);
  }

  const submitEditPath = () => {
    setIsShowEditPath(false);
    Fetch.editPath({
      id: templateId,
      path,
      method
    })
      .then(res => {
        if (res && res.success) {
          message.success({
            content: '修改成功'
          });
          fetchPathDict(templateId);
          // if (currentTemplate.id === templateId) {
          //   setIsNeedToReload(true);
          // }
        }
      });
    setMethod('GET');
  }

  // 副作用
  // useEffect(() => {
  // });
  // console.log('isNeedToReload', isNeedToReload);
  return (
    <div className={styles.interfaceManagement}>
      <div className={styles.left}>
        {/* 接口集 */}
        <Row className={styles.row}>
          <Col span={4} className={styles.label}>
            选择接口集：
        </Col>
          <Col span={8}>
            <Select
              showSearch
              onChange={handleTemplateChange}
              className={styles.select}
              value={templateId}
              onFocus={fetchTemplateList}
              loading={isTemplateLoading}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {templateList.map((d, i) => {
                return <Select.Option key={i} value={d.id}>{d.name}</Select.Option>
              })}
            </Select>
          </Col>
          <Tooltip title="新建接口集"><Button type="primary" icon="plus" className={styles.rightBtn} onClick={handleAddTemplate}></Button></Tooltip>
          <Tooltip title="复制接口集"><Button type="primary" icon="copy" className={styles.rightBtn} onClick={handleCopyTemplate} disabled={!templateId}></Button></Tooltip>
          <Tooltip title="编辑接口集"><Button type="primary" icon="edit" className={styles.rightBtn} onClick={handleEditTemplate} disabled={!templateId}></Button></Tooltip>
          {/* <Tooltip title="选用接口集"><Button type="primary" icon="check" className={styles.rightBtn} onClick={submitCurrent} disabled={!templateId}></Button></Tooltip> */}
          <Tooltip title="删除接口集"><Button type="danger" icon="minus" className={styles.rightBtn} onClick={deleteTemplate} disabled={!templateId}></Button></Tooltip>
          {/* <Tooltip title="重载服务"><Button type="primary" icon="reload" className={styles.rightBtn} onClick={handleReload}>
            {isNeedToReload && <span className={styles.dotTip}></span>}
          </Button></Tooltip> */}
        </Row>
        {/* 接口 */}
        {
          templateId && <Row className={styles.row}>
            <Col span={4} className={styles.label}>
              选择接口：
        </Col>
            <Col span={8}>
              <Select
                showSearch
                onChange={handlePathChange}
                className={styles.select}
                value={path}
                onFocus={() => fetchPathDict(templateId)}
                loading={isPathLoading}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {Object.keys(pathDict).map((key, i) => {
                  return <Select.Option key={i} value={key}>{key}</Select.Option>
                })}
              </Select>
            </Col>
            <Tooltip title="新建接口"><Button type="primary" icon="plus" className={styles.rightBtn} onClick={handleAddPath}></Button></Tooltip>
            <Tooltip title="编辑接口"><Button type="primary" icon="edit" className={styles.rightBtn} onClick={handleEditPath} disabled={!path}></Button></Tooltip>
            <Tooltip title="删除接口"><Button type="danger" icon="minus" className={styles.rightBtn} onClick={handleDeletePath} disabled={!path}></Button></Tooltip>
          </Row>
        }
        {/* 函数 */}
        {
          path && <Row className={styles.row}>
            <Col span={4} className={styles.label}>
              函数：
        </Col>
            <Col span={12}>
              <Input.TextArea value={fn} rows={10} onChange={handleFnChange} />
            </Col>
            <Tooltip title="更新函数"><Button type="primary" icon="sync" className={styles.rightBtn} onClick={updatePathFn}></Button></Tooltip>
          </Row>
        }
        {/* 条件数据 */}
        {
          path && <Row className={styles.row}>
            <Col span={4} className={styles.label}>
              条件数据：
        </Col>
            <Col span={8}>
              <Select
                showSearch
                value={dataIndex}
                onChange={handleDataIndexChange}
                className={styles.select}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {(pathObj.ids || []).map((d, i) => {
                  return (
                    <Select.Option value={i + ''} key={i}>
                      {i}
                    </Select.Option>
                  )
                })}
              </Select>
            </Col>
            <Tooltip title="添加数据"><Button type="primary" icon="plus" className={styles.rightBtn} onClick={handleAddPathData}></Button></Tooltip>
            <Tooltip title="删除数据"><Button type="danger" icon="minus" className={styles.rightBtn} disabled={!dataIndex} onClick={handleDeletePathData}></Button></Tooltip>
          </Row>
        }
      </div>
      <div className={styles.right}>
        {/* 接口数据 */}
        {
          dataIndex && <Row className={styles.row}>
            <Col span={24}>
              接口数据：
            </Col>
          </Row>
        }
        {
          dataIndex && <Row className={styles.row}>
            <Col span={24}>
              <Input.TextArea value={pathData} onChange={handlePathDataChange} rows="20" />
            </Col>
          </Row>
        }
        {
          dataIndex && <Row className={styles.row}>
            <Col>
              <Tooltip title="更新数据"><Button type="primary" icon="sync" onClick={handleUpdateClick}></Button></Tooltip>
            </Col>
          </Row>
        }
        {/* <Row className={styles.row}>
          <Col span={6} className={styles.label}>
            当前接口集：
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
        </Row> */}
      </div>


      {/* 新建接口集 */}
      <Modal
        title="新建接口集"
        visible={isShowAddTemplate}
        onOk={submitAddTemplate}
        onCancel={() => setIsShowAddTemplate(false)}
      >
        <Row className={styles.row}>
          <Col span={6} className={styles.label}>
            接口集名称：
        </Col>
          <Col span={14}>
            <Input value={templateName} onChange={handleTemplateNameChange} />
          </Col>
        </Row>
      </Modal>
      {/* 复制接口集 */}
      <Modal
        title="复制接口集"
        visible={isShowCopyTemplate}
        onOk={submitCopyTemplate}
        onCancel={() => setIsShowCopyTemplate(false)}
      >
        <Row className={styles.row}>
          <Col span={6} className={styles.label}>
            接口集名称：
        </Col>
          <Col span={14}>
            <Input value={templateName} onChange={handleTemplateNameChange} />
          </Col>
        </Row>
      </Modal>

      {/* 编辑接口集 */}
      <Modal
        title="编辑接口集"
        visible={isShowEditTemplate}
        onOk={submitEditTemplate}
        onCancel={() => setIsShowEditTemplate(false)}
      >
        <Row className={styles.row}>
          <Col span={6} className={styles.label}>
            接口集名称：
        </Col>
          <Col span={14}>
            <Input value={templateName} onChange={handleTemplateNameChange} />
          </Col>
        </Row>
      </Modal>
      {/* 新建接口 */}
      <Modal
        title="新建接口"
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
      {/* 编辑接口 */}
      <Modal
        title="编辑接口"
        visible={isShowEditPath}
        onOk={submitEditPath}
        onCancel={() => setIsShowEditPath(false)}
      >
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
  )
}