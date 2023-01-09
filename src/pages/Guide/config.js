export default () => {
  return {
    columns: [
      { title: "事项名称", dataIndex: "itemName" },
      { title: "承诺时间", dataIndex: "promiseTime" },
      {
        title: "操作",
        dataIndex: "operation",
        align: "center",
      },
    ],
  };
};
