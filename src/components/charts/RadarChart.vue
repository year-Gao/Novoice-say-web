<template>
  <div class="chart-container">
    <canvas ref="radarChart"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  chartData: Object
})

const radarChart = ref(null)
let chart = null

onMounted(() => {
  if (props.chartData) {
    createChart()
  }
})

watch(() => props.chartData, (newData) => {
  if (chart) {
    chart.destroy()
  }
  if (newData) {
    createChart()
  }
}, { deep: true })

const createChart = () => {
  const ctx = radarChart.value.getContext('2d')
  chart = new Chart(ctx, {
    type: 'radar',
    data: props.chartData,
    options: {
      responsive: true,
      scales: {
        r: {
          min: 0,
          max: 100,
          beginAtZero: true
        }
      }
    }
  })
}
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 600px;
  width: 100%;
}
</style> 