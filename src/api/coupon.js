import request from '@/utils/request'

const url = '/coupon'

export function getCoupon(data) {
  return request({
    url,
    baseURL: process.env.VUE_APP_BASE_COUPON_API,
    method: 'post',
    data: {
      action: 'query',
      ...data
    }
  })
}
export function getCouponInfo(data) {
  return request({
    url,
    baseURL: process.env.VUE_APP_BASE_COUPON_API,
    method: 'post',
    data: {
      action: 'queryRow',
      ...data
    }
  })
}

export function addCoupon(data) {
  return request({
    url,
    baseURL: process.env.VUE_APP_BASE_COUPON_API,
    method: 'post',
    data: {
      action: 'add',
      ...data
    }
  })
}
export function updateCoupon(data) {
  return request({
    url,
    baseURL: process.env.VUE_APP_BASE_COUPON_API,
    method: 'post',
    data: {
      action: 'update',
      ...data
    }
  })
}

export function upload(data) {
  return request({
    baseURL: process.env.VUE_APP_BASE_COUPON_API,
    url: '/upload',
    method: 'post',
    data
  })
}

export function removeCoupon(data) {
  return request({
    url,
    baseURL: process.env.VUE_APP_BASE_COUPON_API,
    method: 'post',
    data: {
      action: 'remove',
      ...data
    }
  })
}

export function getInfo(data) {
  return request({
    url,
    baseURL: process.env.VUE_APP_BASE_COUPON_API,
    method: 'post',
    data: {
      action: 'getUserInfo',
      uid: sessionStorage.getItem('uid')
    }
  })
}

export function logout(data) {
  return request({
    url,
    baseURL: process.env.VUE_APP_BASE_COUPON_API,
    method: 'post',
    data
  })
}
