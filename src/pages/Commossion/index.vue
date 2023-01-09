<script setup>
// import my
import MyLoading from "@c/MyLoading/index.vue"
import MyUpload from "@c/MyUpload/index.vue"

// import ui
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue';
import { UserOutlined } from '@ant-design/icons-vue';
// import api

// import other
import Utils from "@u/Utils";
import {
  DELETE_COMMOSSION,
  GET_COMMOSSION_BY_ID,
  POST_ADD_COMMOSSION,
  POST_LIST,
  PUT_UPDATA_COMMOSSION
} from '@a/commossion.js'
import config from "./config"
import {GET_LIST} from "@a/department.js";
import dayjs from "dayjs";
import {POST_FILE} from "@a/file.js";
//if error; please run npm install unplugin-vue-define-options -D

//设置vue组件名称
defineOptions({
  name: 'Commossion',
})

//引入组件
defineComponent({
  components: {
    UserOutlined,
  },
})
// vue api

// my config
const { columns } = config()
const state = reactive({
  //  表单是否展示
  show: false,
  //  业务提交类型
  dataType: true,
  //  加载状态
  loading: false
})
const page = reactive({
  pageNum: 1,
  pageSize: 10,
  total: null,
  param: {},
  showTotal: (total, range) =>
      `当前展示${range[0]}-${range[1]}项, 共 ${total} 项数据`,
  change(pageNum, pageSize) {
    page.pageNum = pageNum
    page.pageSize = pageSize
    data.methods.list()
  }
})
const data = reactive({
  list: [],
  methods: {
    async list() {
      const res = await POST_LIST()
      if(res && res.code == 200) {
        data.list = res.data
        page.total = res.total
      }
      state.loading = false
    }
  },
  created() {
    data.methods.list()
  }
})

const form = reactive({
  departmentId: [],
  add: {
    birthday: '',
    sex: '',
    grade: null,
    number: null,
    doThingNumber: null,
    businessLimit: null,
    departmentId: null,
    adminId: null,
    address: '',
    goodAt: '',
    phone: '',
    idCard: null,
    name: '',
    token: sessionStorage.getItem('token'),
    account: sessionStorage.getItem('account'),
    headPicture: '',
    password: null,
    department: null
  },
  edit: {},
  methods: {
    async get_departmentId() {
      const res = await GET_LIST()
      if (res && res.code == 200) {
        form.departmentId = Utils.editDictConfig(res.data, {
          label: 'name',
          value: 'id',
          id: 'id'
        })
      }
    },
    model() {
     return state.dataType ? form.add : form.edit
    },
    add() {
      state.show = true
      state.dataType = true
    },
    async edit(id) {
      const res = await GET_COMMOSSION_BY_ID(id)
      res.data.birthday = dayjs(res.data.birthday)
      form.edit = Utils.objectData(res.data, form.add)
      form.edit['id'] = id
      state.show = true
      state.dataType = false
    },
    close() {
      MyForm?.value.resetFields();
    },
    async del(id) {
      const res = await DELETE_COMMOSSION(id)
      if(res.code === 200) {
        message.success(res.message)
        page.pageNum = 1
        data.methods.list()
      } else {
        message.warning(res.message)
      }
    },
    async onFinish() {
      let callback = state.dataType ? POST_ADD_COMMOSSION : PUT_UPDATA_COMMOSSION
      const res = await callback(form.methods.model())
      if(res.code === 200) {
        message.success(res.message)
        state.show = false
        form.methods.close()
        data.methods.list()
      } else {
        message.warning(res.message)
      }
    }
  },
  created() {
    form.methods.get_departmentId()
  }
})
data.created()
form.created()
</script>

<template>
  <div class="body">
    <div class="header">
      <div class="search"></div>
      <div class="btn">
        <a-button type="primary" title="新增" @click="form.methods.add()">
          新增
        </a-button>
      </div>
    </div>
    <div class="main">
      <div class="table">
        <a-table size="middle" :row-key="(record) => record.id" :pagination="false" :columns="columns"
                 :scroll="{ x: 1000 }"
                 :data-source="data.list">
          <template #bodyCell="{ text, record, index, column }">
            <template v-if="column.dataIndex === 'headPicture'">
              <a-avatar :src="record.headPicture" :size="32" class="head">
                <template v-if="!record.headPicture" #icon><UserOutlined /></template>
              </a-avatar>
            </template>
            <template v-if="column.dataIndex === 'sex'">
              {{ record.sex === 0 ? '女' : '男' }}
            </template>
            <template v-if="column.dataIndex === 'operation'">
              <!-- 编辑 -->
              <a-button
                  type="link"
                  shape="circle"
                  title="编辑"
                  @click="form.methods.edit(record.id)"
              >
                <template #icon>
                  <edit-two-tone />
                </template>
              </a-button>
              <!-- 删除 -->
              <a-popconfirm
                  title="是否确认删除？"
                  ok-text="确认"
                  cancel-text="取消"
                  @confirm="form.methods.del(record.id)"
              >
                <a-button type="link" shape="circle" danger title="删除">
                  <template #icon>
                    <delete-two-tone two-tone-color="#eb2f96" />
                  </template>
                </a-button>
              </a-popconfirm>
            </template>
          </template>
        </a-table>
        <MyLoading v-show="state.loading" />
      </div>
    </div>
    <div class="page">
      <a-pagination
          size="small"
          showSizeChanger
          showQuickJumper
          v-model:current="page.pageNum"
          v-model:page-size="page.pageSize"
          :total="page.total"
          :show-total="page.showTotal"
          @change="page.change"
      />
    </div>
    <a-drawer v-model:visible="state.show"
      :title="state.dataType ? '添加': '编辑'"
      @close="form.methods.close"
      width="400"
    >
      <a-form ref="MyForm" :model="form.methods.model()"
        name="basic"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        autocomplete="off"
        @finish="form.methods.onFinish"
      >
        <a-form-item label="姓名" required name="name">
          <a-input v-model:value="form.methods.model().name" required placeholder="请输入姓名"></a-input>
        </a-form-item>
        <a-form-item label="性别" name="sex">
          <a-select v-model:value="form.methods.model().sex" placeholder="请选择性别">
            <a-select-option :value="0">女</a-select-option>
            <a-select-option :value="1">男</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="头像" name="headPicture">
          <MyUpload :upload="POST_FILE" v-model:value="form.methods.model().headPicture" />
        </a-form-item>
        <a-form-item label="评分" name="grade">
          <a-input-number v-model:value="form.methods.model().grade" min="0" placeholder="请输入评分" style="width: 100%"></a-input-number>
        </a-form-item>
        <a-form-item label="出生日期" name="birthday">
          <a-date-picker v-model:value="form.methods.model().birthday" placeholder="请选择出生日期" style="width: 100%"></a-date-picker>
        </a-form-item>
        <a-form-item label="办件数量" name="doThingNumber">
          <a-input-number v-model:value="form.methods.model().doThingNumber" min="0" placeholder="请选择办件数量" style="width: 100%"></a-input-number>
        </a-form-item>
        <a-form-item label="业务上限" name="businessLimit">
          <a-input-number v-model:value="form.methods.model().businessLimit" min="0" placeholder="请选择业务上限" style="width: 100%"></a-input-number>
        </a-form-item>
        <a-form-item label="身份证号" required name="idCard">
          <a-input v-model:value="form.methods.model().idCard" required placeholder="请输入身份证号"></a-input>
        </a-form-item>
        <a-form-item label="手机号" required name="phone">
          <a-input v-model:value="form.methods.model().phone" required placeholder="请输入手机号"></a-input>
        </a-form-item>
        <a-form-item label="擅长领域" name="goodAt">
          <a-input v-model:value="form.methods.model().goodAt" placeholder="请输入擅长领域"></a-input>
        </a-form-item>
        <a-form-item label="联系地址" name="address">
          <a-input v-model:value="form.methods.model().address" placeholder="请输入联系地址"></a-input>
        </a-form-item>
        <a-form-item label="相关部门" required name="departmentId">
          <a-select
              v-model:value="form.methods.model().departmentId"
              placeholder="请选择相关部门"
          >
            <a-select-option
                :value="item.value"
                v-for="item in form.departmentId"
                :key="item.id"
            >
              <span>{{ item.label }}</span>
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 6, span: 18 }">
          <a-button type="primary" html-type="submit">提交</a-button>
        </a-form-item>
      </a-form>
    </a-drawer>
  </div>
</template>

<style scoped>

</style>