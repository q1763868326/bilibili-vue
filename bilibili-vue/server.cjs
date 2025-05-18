const express = require('express')
const axios = require('axios')
const path = require('path')
const app = express()

// 静态托管前端dist目录
app.use(express.static(path.join(__dirname, 'dist')))

app.get('/api/bili-rcmd', async (req, res) => {
  try {
    const { data } = await axios.get('https://api.live.bilibili.com/xlive/web-interface/v1/webMain/getMoreRecList?platform=web&web_location=333.1007', {
      headers: {
        'accept': '*/*',
        'accept-language': 'zh-CN,zh;q=0.9',
        'cache-control': 'no-cache',
        'cookie': 'buvid_fp_plain=undefined; DedeUserID=9049632; DedeUserID__ckMd5=a4384745f0162305; buvid4=8DD249E7-5E93-573D-68DA-70B3D212260A12623-022102423-Nawn1QS9yktINaT0tfE5%2BQ%3D%3D; CURRENT_BLACKGAP=0; header_theme_version=CLOSE; enable_web_push=DISABLE; go-back-dyn=0; _uuid=B92BB4C7-27B5-AF1C-1139-951DC216882436674infoc; LIVE_BUVID=AUTO8117322058684386; PVID=2; buvid3=6D878524-8B54-5F68-697F-1849F846E34E98309infoc; b_nut=1735389698; hit-dyn-v2=1; SESSDATA=fa66373f%2C1752818698%2Cd7e65%2A11CjCFDAYiNf18ko1cTnyqDn3hJmKmJDG-X-dbNEsudWCKCwzdyXx-QsUSPjXE4NPb8i8SVkJHeVZBRUpwMUtmTTF2aExzNjRNNVdpcGZVMjR0bUZYZURGSlRqMVJXYlp0Ukg0QV9NR2RfcXc3V0RJdmFWRl9wRlRxbnRyM1VSRjlVOXprVHZlTVZBIIEC; bili_jct=cc0ab0023871e2d19fc279b52d700b01; enable_feed_channel=ENABLE; rpdid=|(um|ul)Ymuu0J\'u~RRlR)YuY; CURRENT_QUALITY=80; fingerprint=c38a7c36373683e7225fdbcc995ee717; buvid_fp=5861b101dded449bb5de14ad10385452; bp_t_offset_9049632=1060134448483270656; CURRENT_FNVAL=2000; b_lsid=68F26BFD_1968815C846; bili_ticket=eyJhbGciOiJIUzI1NiIsImtpZCI6InMwMyIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDYyOTkwNTIsImlhdCI6MTc0NjAzOTc5MiwicGx0IjotMX0.6OEj1kneOaK6vwF7qWYFxbem4LV5BB6bEyDDa7_xfWI; bili_ticket_expires=1746298992; home_feed_column=4; browser_resolution=918-693',
        'origin': 'https://www.bilibili.com',
        'pragma': 'no-cache',
        'priority': 'u=1, i',
        'referer': 'https://www.bilibili.com/?spm_id_from=333.788.0.0',
        'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36'
      }
    })
    res.json(data)
  } catch (e) {
    console.error('[B站接口] 发生异常:', e)
    res.status(500).json({ error: e.message })
  }
})

// 新增图片代理接口，解决B站图片403防盗链
app.get('/api/proxy-img', async (req, res) => {
  const url = req.query.url
  if (!url) return res.status(400).send('Missing url param')
  const headers = {
    'Referer': 'https://www.bilibili.com/',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36'
  }
  // console.log('[图片代理] 请求url:', url)
  // console.log('[图片代理] 请求headers:', headers)
  try {
    const response = await axios.get(url, {
      responseType: 'stream',
      headers,
      timeout: 5000
    })
    console.log('[图片代理] 已拿到响应:', response.status)
    res.setHeader('Content-Type', response.headers['content-type'])
    response.data.pipe(res)
  } catch (e) {
    // console.error('[图片代理] 发生异常:', e)
    res.status(500).send('图片代理失败: ' + e.message)
  }
})

// history路由支持（前端路由刷新不404）
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`服务已启动: http://localhost:${port}`)
}) 