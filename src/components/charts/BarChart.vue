<template>
  <div class="chart-container">
    <canvas ref="barChart"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  chartData: Object
})

const barChart = ref(null)
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
  const ctx = barChart.value.getContext('2d')
  chart = new Chart(ctx, {
    type: 'bar',
    data: props.chartData,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  })
}
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}
</style> 