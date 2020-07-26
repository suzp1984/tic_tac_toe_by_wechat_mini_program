// index.ts
// 获取应用实例
const app = getApp<IAppOption>()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isNextPlayerX: true,
    gameTitle: "Next Player X",
    isResetEnabled: false,
    winner: "",
    squareClasses: [
      "", "", "",
      "", "", "",
      "", "", ""],
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs',
    })
  },
  onLoad() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
          })
        },
      })
    }
  },
  getUserInfo(e: any) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
    })
  },
  onTap(e: any) {
    console.log(e)
    console.log('on tap square ' + e.currentTarget.dataset['index'])
    let _index = e.currentTarget.dataset['index']
    let _squareClass = this.data.squareClasses[_index]

    if (_squareClass != "") {
      console.log('current square already occupied by ' + _squareClass)
      return
    }

    if (this.data.winner != '') {
      console.log('this round already has winner ' + this.data.winner)
      return
    }

    let _isNextPlayerX = this.data.isNextPlayerX

    let _squareClasses = this.data.squareClasses
    _squareClasses[_index] = _isNextPlayerX ? 'player-x' : 'player-o'
    this.setData({
      isNextPlayerX: !_isNextPlayerX,
      gameTitle: !_isNextPlayerX ? "Next Player X" : "Next Player O",
      squareClasses: _squareClasses
    })

    this.calculateWinner()
  },
  reset() {

    this.setData(
      {
        gameTitle: this.data.isNextPlayerX ? "Next Player X" : "Next Player O",
        isResetEnabled: false,
        winner: "",
        squareClasses: [
          "", "", "",
          "", "", "",
          "", "", ""],
      }
    )
  },
  calculateWinner() {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        this.data.squareClasses[a] != "" &&
        this.data.squareClasses[a] === this.data.squareClasses[b] &&
        this.data.squareClasses[b] === this.data.squareClasses[c]
      ) {
        let _winner = this.data.squareClasses[a] === 'player-x' ? 'X' : 'O';
        this.setData({
          isResetEnabled: true,
          winner: _winner,
          gameTitle: _winner === 'X' ? 'Winner is Player X' : 'Winner is Player O'
        })

        wx.showToast({
          title: _winner === 'X' ? 'Player X Win' : 'Player O Win',
          icon: 'none',
          duration: 2000,
        })

        return;
      }
    }

    for (let i = 0; i < this.data.squareClasses.length; i++) {
      if (this.data.squareClasses[i] === "") {
        return;
      }
    }

    this.setData({
      isResetEnabled: true,
      gameTitle: "No Winner",
    })
    wx.showToast({
      title: 'No Winner',
      icon: 'none',
      duration: 2000,
    })
  }
})
