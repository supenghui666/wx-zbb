// pages/mine/mine.js
Page({
  data: {
  
  },
  onLoad: function (options) {
    
  },
  onReady: function () {
  
  },
  onShow: function () {
    this.setData({
      isOne: wx.getStorageSync('userInfo').higherOrgID
    });
    this.getUserinfo();
  },
  onHide: function () {
  
  },
  onUnload: function () {
  
  },
  onPullDownRefresh: function () {
  
  },
  //获取个人信息
  getUserinfo() {
    getApp().$ajax({
      isShowLoading:false,
      httpUrl: getApp().api.userInfoUrl,
      data: {
        orgID: wx.getStorageSync('userInfo').orgID,
        higherOrgID: wx.getStorageSync('userInfo').higherOrgID
      }
    }).then(({ data }) => {
      this.setData({
        userinfo: data
      })
    })
  },
  //拨打电话
  calling: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phonenub,
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  // 设置
  goSet(){
    wx.navigateTo({
      url: '/pages/mine/set/set'
    })
  },
  goMembers(e){
    if (this.data.isOne != -1){
      let member = e.currentTarget.dataset.member;
      member != 0 && wx.navigateTo({ url: "/pages/mine/member/member" });
    }
  },
  //上传头像
  changeAvatar (e) {
    let ctx = this;
    wx.chooseImage({
      success: (res) => {
        let tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: getApp().api.changeAvatarUrl,
          header: { "Content-Type": "multipart/form-data" },
          filePath: tempFilePaths[0],
          name: 'headThumb',
          formData: {
            orgID: wx.getStorageSync('userInfo').orgID
          },
          success: ({ data }) => {
            let datas = JSON.parse(data);
            if (datas.state == 1) {
              let userinfo = wx.getStorageSync('userInfo');
              userinfo.headThumb = datas.data.headThumb;
              wx.setStorageSync('userInfo', userinfo);
              ctx.getUserinfo();
              wx.showToast({
                title: '头像修改成功',
                icon: 'none',
                duration:2000
              });
            }
          }
        })
      }
    })
  }
})