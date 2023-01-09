import http from "@u/request";
import qs from "qs";

export const GET_LIST = () => {
    return http.get("/guide/getList")
}

export const DEL_LIST = (id) => {
    return http.delete(`/guide/delete/${id}`, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }}
    )
}

export const GET_DETAIL = (id) => {
    return http.get(`/guide/getDetail/${id}`, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }}
    )
}

export const POST_GUDIE = (param) => {
    return http.post(`/guide/add`, qs.stringify(param), {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }}
    )
}
export const PUT_GUDIE = (param) => {
    return http.put(`/guide/update`, qs.stringify(param), {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }}
    )
}

