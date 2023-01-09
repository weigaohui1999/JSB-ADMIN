
<script setup>
// import vue api

// import my

// import ui
import { createFromIconfontCN, EditTwoTone, DeleteTwoTone } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
// import api
import {DEL_LIST, GET_DETAIL, GET_LIST, POST_GUDIE, PUT_GUDIE} from "@a/guide"
import {POST_LIST} from "@a/item"
// import other
import Utils from "@u/Utils";
import config from "./config"
import icons from "@/assets/js/dict"
import {computed, watch} from "vue";
//if error; please run npm install unplugin-vue-define-options -D
//设置vue组件名称
defineOptions({
    name: 'Guide',
})

// vue api

// my config
const { columns } = config()
const IconFont = createFromIconfontCN({
    scriptUrl: import.meta.env.VITE_ALICDN_URL
});
// refs
const MyForm = ref(null)


const state = reactive({
    //  表单是否展示
    show: false,
    //  业务提交类型
    dataType: true,
})
const data = reactive({
    //  table数据源
    list: [],
    methods: {
        async list() {
            const res = await GET_LIST()
            if (res && res.code == 200) {
                data.list = res.data
            }
        },
        async itemList() {
          const res = await POST_LIST({ pageNum: 1, pageSize: 100 })
          if (res && res.code == 200) {
            form.itemId = res.data
          }
        }
    },
    created() {
        data.methods.list()
        data.methods.itemList()
    }
})

const form = reactive({
    itemId: [],
    processingTime1: [],
    processingTime2: [],
    //  新增业务模型
    add: {
      itemId: null,
      promiseTime: null,
      officeAddress: null,
      addressPhone: null,
      approvalBasis: null,
      guideQuestion: null,
      processingTime: null
    },
    //  编辑业务模型
    edit: {},
  created() {

  },
  methods: {
        //  返回对应按钮状态下的数据结构,让表单动态绑定不同数据模式
        model() {
            return state.dataType ? form.add : form.edit
        },
        //  新增: 打开表单,设置提交类型为新增
        add() {
            state.show = true
            state.dataType = true
        },
        async del(id) {
            const res = await DEL_LIST(id)
            if (res && res.code == 200) {
                message.success(res.message);
                data.methods.list()
            } else {
                message.warning(res.message);
            }
        },
        async edit(id) {
            const res = await GET_DETAIL(id)
            if (res && res.code == 200) {
                if(res.data.guideModel[0].processingTime) {
                  res.data.guideModel[0].processingTime = res.data.guideModel[0].processingTime?.split(' ')
                }
                form.edit = Utils.objectData(res.data.guideModel[0], form.add)
                form.processingTime1 = res.data.guideModel[0].processingTime[0].split('-')
                form.processingTime2 = res.data.guideModel[0].processingTime[1].split('-')
                console.log(form.edit)
                form.edit['id'] = id
                state.show = true
                state.dataType = false
            }
        },
        close() {
            MyForm?.value.resetFields();
        },
        async onFinish(values) {
            let callback = state.dataType ? POST_GUDIE : PUT_GUDIE
            form.methods.model().processingTime = form.processingTime1 + ' ' + form.processingTime2
            const res = await callback(form.methods.model())
            if (res && res.code == 200) {
                message.success(res.message);
                state.show = false
                form.methods.close()
                data.methods.list()
            } else {
                message.warning(res.message);
            }
        }
    }
})

data.created()
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
                <a-table size="middle" :rowKey="(record) => record.id" :pagination="false" :columns="columns"
                    :data-source="data.list">
                    <template #bodyCell="{ text, record, index, column }">
                        <template v-if="column.dataIndex === 'operation'">
                            <!-- 编辑 -->
                            <a-button type="link" shape="circle" title="编辑" @click="form.methods.edit(record.id)">
                                <template #icon>
                                    <edit-two-tone />
                                </template>
                            </a-button>
                            <!-- 删除 -->
                            <a-popconfirm title="是否确认删除？" ok-text="确认" cancel-text="取消"
                                @confirm="form.methods.del(record.id)">
                                <a-button type="link" shape="circle" danger title="删除">
                                    <template #icon>
                                        <delete-two-tone two-tone-color="#eb2f96" />
                                    </template>
                                </a-button>
                            </a-popconfirm>
                        </template>
                    </template>

                </a-table>
            </div>
        </div>
        <a-drawer v-model:visible="state.show" @close="form.methods.close" :title="state.dataType ? '添加' : '编辑'"
            placement="right" width="480">
            <a-form :model="form.methods.model()" ref="MyForm" name="basic" :label-col="{ span: 6 }"
                :wrapper-col="{ span: 18 }" autocomplete="off" @finish="form.methods.onFinish">
                <a-form-item label="事项" required name="itemId">
                  <a-select v-model:value="form.methods.model().itemId" placeholder="请选择事项">
                    <a-select-option :value="item.id" v-for="item in form.itemId" :key="item.id" >{{item.name}}</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="承诺时效" required name="promiseTime">
                    <a-input v-model:value="form.methods.model().promiseTime" placeholder="请输入承诺时效" />
                </a-form-item>
                <a-form-item label="详细地址" required name="officeAddress">
                    <a-input v-model:value="form.methods.model().officeAddress" placeholder="请输入详细地址" />
                </a-form-item>
                <a-form-item label="地址电话" required name="addressPhone">
                    <a-input v-model:value="form.methods.model().addressPhone" placeholder="请输入地址电话" />
                </a-form-item>
                <a-form-item label="审批依据" required name="approvalBasis">
                    <a-input v-model:value="form.methods.model().approvalBasis" placeholder="请输入审批依据" />
                </a-form-item>
                <a-form-item label="办理时间" required>
                    <a-time-range-picker v-model:value="form.processingTime1" valueFormat="HH:mm" placeholder="请选择办理时间范围" format="HH:mm" />
                    <a-time-range-picker v-model:value="form.processingTime2" valueFormat="HH:mm" placeholder="请选择办理时间范围" format="HH:mm" />
                </a-form-item>
                <a-form-item label="办事指南" name="guideQuestion">
                    <a-input v-model:value="form.methods.model().guideQuestion" placeholder="请输入办事指南" />
                </a-form-item>
                <a-form-item :wrapper-col="{ offset: 6, span: 18 }">
                    <a-button type="primary" html-type="submit">提交</a-button>
                </a-form-item>
            </a-form>
        </a-drawer>
    </div>
</template>

<style scoped lang='less'>

</style>