function clockUpdateTime(info, city) {
  let currentColor = '#000'
  switch (info.now.icon) {
    case '100':
      currentColor = '#fdcc45'
      break
    case '101':
      currentColor = '#fe6976'
      break
    case '102':
    case '103':
      currentColor = '#fe7f5b'
      break
    case '104':
    case '150':
    case '151':
    case '152':
    case '153':
    case '154':
    case '800':
    case '801':
    case '802':
    case '803':
    case '804':
    case '805':
    case '806':
    case '807':
      currentColor = '#2152d1'
      break
    case '300':
    case '301':
    case '305':
    case '306':
    case '307':
    case '308':
    case '309':
    case '310':
    case '311':
    case '312':
    case '313':
    case '314':
    case '315':
    case '316':
    case '317':
    case '318':
    case '350':
    case '351':
    case '399':
      currentColor = '#49b1f5'
      break
    case '302':
    case '303':
    case '304':
      currentColor = '#fdcc46'
      break
    case '400':
    case '401':
    case '402':
    case '403':
    case '404':
    case '405':
    case '406':
    case '407':
    case '408':
    case '409':
    case '410':
    case '456':
    case '457':
    case '499':
      currentColor = '#a3c2dc'
      break
    case '500':
    case '501':
    case '502':
    case '503':
    case '504':
    case '507':
    case '508':
    case '509':
    case '510':
    case '511':
    case '512':
    case '513':
    case '514':
    case '515':
      currentColor = '#97acba'
      break
    case '900':
    case '999':
      currentColor = 'red'
      break
    case '901':
      currentColor = '#179fff;'
      break
    default:
      break
  }
  var clock_box = document.getElementById('hexo_electric_clock')

  var clock_box_html = `
  <div class="clock-row">
    <span id="card-clock-clockdate" class="card-clock-clockdate"></span>
    <span class="card-clock-weather"><i class="qi-${info.now.icon}-fill" style="color: ${currentColor}"></i> ${info.now.text} <span>${info.now.temp}</span> ℃</span>
    <span class="card-clock-humidity">💧 ${info.now.humidity}%</span>
  </div>
  <div class="clock-row">
    <span id="card-clock-time" class="card-clock-time"></span>
  </div>
  <div class="clock-row">
    <span class="card-clock-windDir"> <i class="qi-gale"></i> ${info.now.windDir}</span>
    <span class="card-clock-location">${city}</span>
    <span id="card-clock-dackorlight" class="card-clock-dackorlight"></span>
  </div>
  `
  var week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  var card_clock_loading_dom = document.getElementById('card-clock-loading')
  if (card_clock_loading_dom) {
    card_clock_loading_dom.innerHTML = ''
  }
  clock_box.innerHTML = clock_box_html
  function updateTime() {
    var cd = new Date()
    var card_clock_time =
      zeroPadding(cd.getHours(), 2) +
      ':' +
      zeroPadding(cd.getMinutes(), 2) +
      ':' +
      zeroPadding(cd.getSeconds(), 2)
    var card_clock_date =
      zeroPadding(cd.getFullYear(), 4) +
      '-' +
      zeroPadding(cd.getMonth() + 1, 2) +
      '-' +
      zeroPadding(cd.getDate(), 2) +
      ' ' +
      week[cd.getDay()]
    var card_clock_dackorlight = cd.getHours()
    var card_clock_dackorlight_str
    if (card_clock_dackorlight > 12) {
      card_clock_dackorlight = card_clock_dackorlight - 12
      card_clock_dackorlight_str = ' P M'
    } else {
      card_clock_dackorlight_str = ' A M'
    }
    if (document.getElementById('card-clock-time')) {
      var card_clock_time_dom = document.getElementById('card-clock-time')
      var card_clock_date_dom = document.getElementById('card-clock-clockdate')
      var card_clock_dackorlight_dom = document.getElementById('card-clock-dackorlight')
      card_clock_time_dom.innerHTML = card_clock_time
      card_clock_date_dom.innerHTML = card_clock_date
      card_clock_dackorlight_dom.innerHTML = card_clock_dackorlight_str
    }
  }
  function zeroPadding(num, digit) {
    var zero = ''
    for (var i = 0; i < digit; i++) {
      zero += '0'
    }
    return (zero + num).slice(-digit)
  }
  setInterval(updateTime, 1000)
  updateTime()
}

/**
 * 使用高德 + 和风获取天气信息（IP / rectangle 逻辑）
 * 保持原有行为，用作浏览器定位失败时的兜底
 */
function getIpInfo() {
  let defaultInfo = {
    city: '长沙市',
    qweather_url: ''
  }

  // 优先使用配置里的固定 rectangle（如果开启）
  if (clock_default_rectangle_enable === 'true' && defaultInfo) {
    fetch(`https://restapi.amap.com/v3/geocode/regeo?key=${gaud_map_key}&location=${clock_rectangle}`)
      .then(regeo_res => regeo_res.json())
      .then(regeo_data => {
        if (regeo_data.status === '1') {
          const addressComponent = regeo_data.regeocode.addressComponent
          return Array.isArray(addressComponent.city) ? addressComponent.province : addressComponent.city
        }
      })
      .then(rectangleCity => {
        return fetch(
          `https://devapi.qweather.com/v7/weather/now?location=${clock_rectangle}&key=${qweather_key}`
        )
          .then(res => res.json())
          .then(data => {
            if (document.getElementById('hexo_electric_clock')) {
              let city = Array.isArray(rectangleCity) ? defaultInfo.city : rectangleCity
              clockUpdateTime(data, city)
            }
          })
      })
      .catch(() => {
        // 高德/和风请求失败时，至少让时间正常显示
        if (document.getElementById('hexo_electric_clock')) {
          clockUpdateTime({ now: { icon: '999', text: 'N/A', temp: '-', humidity: '-', windDir: '-' } }, defaultInfo.city)
        }
      })
  } else {
    // 使用高德 IP + 和风的原有逻辑
    fetch(`https://restapi.amap.com/v3/ip?key=${gaud_map_key}`)
      .then(res => res.json())
      .then(data => {
        // ip未获取到 使用默认地理位置
        let qweather_url_location = Array.isArray(data.rectangle)
          ? clock_rectangle
          : data.rectangle.split(';')[0]

        defaultInfo.qweather_url = `https://devapi.qweather.com/v7/weather/now?location=${qweather_url_location}&key=${qweather_key}`

        if (Array.isArray(data.rectangle)) {
          return fetch(
            `https://restapi.amap.com/v3/geocode/regeo?key=${gaud_map_key}&location=${clock_rectangle}`
          )
            .then(regeo_res => regeo_res.json())
            .then(regeo_data => {
              if (regeo_data.status === '1') {
                const addressComponent = regeo_data.regeocode.addressComponent
                defaultInfo.city = Array.isArray(addressComponent.city)
                  ? addressComponent.province
                  : addressComponent.city
              }
              return data
            })
            .then(data3 => {
              // 同步获取天气数据，否则城市获取将会异常
              return fetch(defaultInfo.qweather_url)
                .then(r => r.json())
                .then(resNotfindByIp => {
                  if (document.getElementById('hexo_electric_clock')) {
                    let city = Array.isArray(data3.city) ? defaultInfo.city : data3.city
                    clockUpdateTime(resNotfindByIp, city)
                  }
                })
            })
        } else {
          return fetch(defaultInfo.qweather_url)
            .then(res2 => res2.json())
            .then(data2 => {
              if (document.getElementById('hexo_electric_clock')) {
                // 通过请求ip 获取到位置
                let city = Array.isArray(data.city) ? defaultInfo.city : data.city
                clockUpdateTime(data2, city)
              }
            })
        }
      })
      .catch(() => {
        // IP 接口失败时，时间照常走，城市显示默认
        if (document.getElementById('hexo_electric_clock')) {
          clockUpdateTime({ now: { icon: '999', text: 'N/A', temp: '-', humidity: '-', windDir: '-' } }, defaultInfo.city)
        }
      })
  }
}

/**
 * 新增：优先使用浏览器 Geolocation，再回退到 getIpInfo（高德 IP）
 * 这样：
 *  - 大部分正常用户 → 浏览器直接定位 + 和风天气
 *  - 禁用定位 / 定位失败 / 被代理影响高德时 → 自动回退到原来的 getIpInfo 逻辑
 *  - 完全失败时 → 至少时间正常显示，不会整块卡片消失
 */
function initElectricClock() {
  // 如果开启了 default_rectangle，就尊重配置，直接走原 getIpInfo
  if (clock_default_rectangle_enable === 'true') {
    getIpInfo()
    return
  }

  if (!navigator.geolocation) {
    // 浏览器不支持定位，回退到 IP 方案
    getIpInfo()
    return
  }

  navigator.geolocation.getCurrentPosition(
    function (position) {
      var lng = position.coords.longitude.toFixed(3)
      var lat = position.coords.latitude.toFixed(3)
      var location = lng + ',' + lat

      // 先用和风拿天气
      fetch(`https://devapi.qweather.com/v7/weather/now?location=${location}&key=${qweather_key}`)
        .then(function (res) {
          return res.json()
        })
        .then(function (weatherData) {
          if (!document.getElementById('hexo_electric_clock')) return

          // 再用高德做一次逆地理，取城市名
          return fetch(
            `https://restapi.amap.com/v3/geocode/regeo?key=${gaud_map_key}&location=${location}`
          )
            .then(function (regeo_res) {
              return regeo_res.json()
            })
            .then(function (regeo_data) {
              var city = '未知'
              if (regeo_data && regeo_data.status === '1' && regeo_data.regeocode) {
                var addressComponent = regeo_data.regeocode.addressComponent || {}
                city = Array.isArray(addressComponent.city)
                  ? addressComponent.province
                  : addressComponent.city || city
              }
              clockUpdateTime(weatherData, city)
            })
            .catch(function () {
              // 高德逆地理失败就不显示城市名，但天气/时间正常
              clockUpdateTime(weatherData, '')
            })
        })
        .catch(function () {
          // 和风访问失败，回退到 IP 逻辑
          getIpInfo()
        })
    },
    function () {
      // 用户拒绝定位 / 超时 / 其他错误，走 IP 逻辑
      getIpInfo()
    },
    {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 300000
    }
  )
}

// 启动电子钟
initElectricClock()


