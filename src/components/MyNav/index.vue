
<script setup>
// import vue api

// import my
import MyIcon from "@c/MyIcon/index.vue"
// import ui
import { createFromIconfontCN, BellOutlined } from '@ant-design/icons-vue';

// import api

// import other

//if error; please run npm install unplugin-vue-define-options -D
//设置vue组件名称
defineOptions({
    name: 'MyNav',
})

// vue api
const router = useRouter()

// my config
const IconFont = createFromIconfontCN({
    scriptUrl: import.meta.env.VITE_ALICDN_URL
});
// refs


const data = reactive({
    keys: '',
    headPicture: window.sessionStorage.getItem('headPicture') || '',
    method: {
      logout() {
        window.sessionStorage.clear()
        window.location.href = "/login";
      }
    }
})


</script>

<template>
    <div class="nav">

        <div class="search">
            <a-input v-model:value="data.keys" placeholder="请输入搜索关键字!" class="input">
                <template #suffix>
                    <icon-font type="icon-sousuo" />
                </template>
            </a-input>
        </div>

        <div class="group">
            <MyIcon :size="24">
                <bell-outlined style="font-size: 18px;color:#1890ff" />
            </MyIcon>
            <a-dropdown>
              <a class="ant-dropdown-link" @click.prevent>
                <a-avatar :src="data.headPicture" :size="32" class="head" />
              </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a href="javascript:;" @click="data.method.logout()">退出登录</a>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
        </div>
    </div>
</template>

<style scoped lang='less'>
.nav {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .search {
        .input {
            border-radius: @radio;
            border: none;
        }
    }

    .group {
        display: flex;
        align-items: center;

        .head {
            margin-left: 18px;
            cursor: pointer;
        }
    }
}
</style>