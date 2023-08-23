<template>
  <div>
    <div class="custom-carousel">
      <el-carousel :interval="5000" type="card">
        <el-carousel-item>
          <a
            :href="'https://doc.weixin.qq.com/sheet/e3_ABIAfQb-API1MV2HcpYTcqwvNhw0l?scode=AOcAdQdtAA4GXXq7UyABIAfQb-API&version=4.1.0.6011&platform=win'"
            target="_blank"
            style="text-decoration: none"
          >
            <img src="../../assets/team9.jpg" alt="Image 1">
            <div class="carousel-text">点击跳转平台优化文档✨</div>
          </a>
        </el-carousel-item>
        <el-carousel-item>
          <a
            :href="'https://doc.weixin.qq.com/sheet/e3_ABIAfQb-API1MV2HcpYTcqwvNhw0l?scode=AOcAdQdtAA4GXXq7UyABIAfQb-API&version=4.1.0.6011&platform=win'"
            target="_blank"
            style="text-decoration: none"
          >
            <img src="../../assets/team18.jpg" alt="Image 2">
            <div class="carousel-text">点击跳转平台优化文档✨</div>
          </a>
        </el-carousel-item>
        <el-carousel-item>
          <a
            :href="'https://doc.weixin.qq.com/sheet/e3_ABIAfQb-API1MV2HcpYTcqwvNhw0l?scode=AOcAdQdtAA4GXXq7UyABIAfQb-API&version=4.1.0.6011&platform=win'"
            target="_blank"
            style="text-decoration: none"
          >
            <img src="../../assets/team8.png" alt="Image 2">
            <div class="carousel-text">点击跳转平台优化文档✨</div>
          </a>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="dashboard-container" style="display: flex">
      <div style="width: 50%; overflow-y: scroll; height: 500px">
        <el-timeline>
          <template v-for="item in timelineItems">
            <el-timeline-item :key="item.key" placement="top">
              <el-card>
                <h4>[{{ item.event_type }}] {{ item.task }}</h4>
                <p>
                  {{ item.operator }}
                  {{ item.timestamp | msgDateFormat('yyyy-mm-dd hh:mi:ss') }}
                </p>
              </el-card>
            </el-timeline-item>
          </template>
        </el-timeline>
      </div>
      <div id="chart" class="chart-container" style="width: 50%;" />
    </div>
  </div>
</template>

<script>
import { activity, visual } from '@/api/task'
import { mapGetters } from 'vuex'
import * as echarts from 'echarts'

export default {
  name: 'Dashboard',
  data() {
    return {
      timelineItems: []
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  mounted() {
    this.getActivity()
    this.createChart()
  },
  methods: {
    getActivity() {
      activity().then((respone) => {
        this.timelineItems = respone.data
      })
    },
    createChart() {
      visual().then((respone) => {
        var title = respone.data.title
        var number = respone.data.number

        var chartContainer = document.getElementById('chart')
        var myChart = echarts.init(chartContainer)
        var formattedTitles = title.map(function(title) {
          if (title.length > 6) {
            return { value: title.substring(0, 6) + '...', rotate: 45 }
          }
          return { value: title, rotate: 0 }
        })
        var options = {
          xAxis: {
            type: 'category',
            data: formattedTitles,
            axisLabel: {
              rotate: 45
            }
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: number,
              type: 'bar',
              showBackground: true,
              backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.2)'
              }
            }
          ]
        }
        myChart.setOption(options)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
    width: 100%;
    display: flex;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.custom-carousel img {
  width: 100%;
  height: auto;
}

.carousel-text {
  position: absolute;
  bottom: 20px;
  right: 20px;
  color: black;
  font-size: 16px;
  font-weight: bold;
}
</style>
