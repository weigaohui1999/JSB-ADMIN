export default () => {
    return {
        columns: [
            { title: '姓名', width: 100, dataIndex: 'name', fixed: 'left' },
            { title: '头像', width: 100, dataIndex: 'headPicture', align: "center" },
            { title: '性别', width: 100, dataIndex: 'sex', align: "center"},
            { title: '编号', dataIndex: 'number'},
            { title: '评分', dataIndex: 'grade', align: "center"},
            { title: '办理数量', dataIndex: 'doThingNumber', align: "center" },
            { title: '办理上限', dataIndex: 'businessLimit', align: "center" },
            { title: '部门', dataIndex: 'department' },
            { title: '手机', dataIndex: 'phone' },
            { title: '擅长', dataIndex: 'goodAt', ellipsis: true, },
            { title: '地址', dataIndex: 'address', ellipsis: true, },
            { title: '状态', dataIndex: 'status' },
            {
                title: "操作",
                dataIndex: "operation",
                align: "center",
            },
        ]
    }
}