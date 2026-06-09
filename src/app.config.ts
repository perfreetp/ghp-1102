export default defineAppConfig({
  pages: [
    'pages/project/index',
    'pages/arrival/index',
    'pages/sampling/index',
    'pages/trace/index',
    'pages/inspection/index',
    'pages/install-location/index',
    'pages/rectification/index',
    'pages/arrival-detail/index',
    'pages/batch-detail/index',
    'pages/arrival-create/index',
    'pages/sampling-create/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#1E6FFF',
    navigationBarTitleText: '建材追溯助手',
    navigationBarTextStyle: 'white',
    backgroundColor: '#F4F6FA'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#1E6FFF',
    backgroundColor: '#FFFFFF',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/project/index',
        text: '项目'
      },
      {
        pagePath: 'pages/arrival/index',
        text: '到货'
      },
      {
        pagePath: 'pages/sampling/index',
        text: '取样'
      },
      {
        pagePath: 'pages/trace/index',
        text: '追溯'
      }
    ]
  }
})
