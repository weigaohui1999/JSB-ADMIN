import http from "@u/request";
import qs from "qs";

export const POST_LIST = (params) => {
  return http.post("/commossion/selectPage",
    qs.stringify(params),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    }
  })
}

export const GET_LIST_BY_ITEM = (id) => {
  return http.get(`/commossion/listByItemId/${id}`)
}

export const POST_COMMOSSION_BIND = (params) => {
  return http.post("/commossion/bind", qs.stringify(params),{
    headers: {
      "Content-Type": "application/json",
    }
  })
}

export const POST_COMMOSSION_UNBIND = (params) => {
  return http.delete(`/commossion/unbind`, qs.stringify(params),{
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    }
  })
}

export const DELETE_COMMOSSION = (id) => {
  return http.delete(`/commossion/admin/delete/${id}`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    }
  })
}

export const POST_ADD_COMMOSSION = (params) => {
  return http.post('/commossion/admin/add',
      params,
      {
      headers: {
        "Content-Type": "application/json",
      }
  })
}

export const PUT_UPDATA_COMMOSSION = (params) => {
  return http.put('/commossion/admin/update', params,{
    headers: {
      "Content-Type": "application/json",
    }
  })
}

export const GET_COMMOSSION_BY_ID = (commissionId) => {
  return http.get(`/commossion/selectById/${commissionId}`)
}