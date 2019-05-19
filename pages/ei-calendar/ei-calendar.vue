<template>
	<view class="page">
    date:
    <view v-for="(item, index) in date" :key="index">{{item}}</view>
    <button @click="show = true">click</button>
		<ei-calendar :visible.sync="show" type="range" :disabledDate="disabledDate" v-model="date" :custom-date="customDate" format="YYYY-MM-DD">
    </ei-calendar>
	</view>
</template>

<script>
	import EiCalendar from '@/components/ei-calendar/ei-calendar';

	export default {
    components: {EiCalendar},
    data() {
			return {
			  show: true,
        date: ['2019-05-12'],
        customDate: [{
          cellClass: 'custom-cell',
          date: '2019-05-23',
          top: [
            {
              class: 'custom-cell-top-1',
              text: '①'
            },
            {
              class: 'custom-cell-top-2',
              text: '×'
            }
          ]
        }]
			}
		},
		methods: {
      disabledDate(date) {
        const start = new Date('2019/5/10').getTime();
        const end = new Date('2019/6/21').getTime();
        return date.getTime() <= start || date.getTime() >= end;
      }
		}
	}
</script>

<style lang="scss">
  .page {
    background: #f8f8f8;
    height: 100vh;
    font-size: 28upx;
  }
  .custom-cell {
    color: #4cd964;
  }
  .custom-cell-top-1 {
    color: #007aff;
  }
  .custom-cell-top-2 {
    color: red;
  }
</style>
