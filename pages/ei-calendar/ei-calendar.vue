<template>
	<view class="page">
    <button @click="changeCustomData">changeCustomData</button>
    date:
    <view v-for="(item, index) in date" :key="index">{{item}}</view>
    <button @click="show = true">click</button>
		<ei-calendar ref="calendar" :drawer="false" :disabled="false" title="范围弹出层" @date-change="change" :visible.sync="show" type="range" :disabledDate="disabledDate" v-model="date" :custom-date="customDate" format="YYYY-MM-DD">
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
        date: [new Date('2019-05-12')],
        customDate: [
          {
            cellClass: 'custom-cell',
            date: '2019-05-24',
            top: [
              {
                class: 'custom-cell-top-1',
                text: '②'
              },
              {
                class: 'custom-cell-top-2',
                text: '√'
              }
            ]
          }]
			}
		},
		methods: {
      disabledDate(date) {
        const start = new Date('2019/5/10').getTime();
        const end = new Date('2019/7/21').getTime();
        return date.getTime() <= start || date.getTime() >= end;
      },
      changeCustomData() {
        this.customDate = [{
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
        }];
        this.$refs.calendar.refresh();
      },
      change(a, b) {
        debugger;
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
    color: #ccc;
  }
  .custom-cell-top-2 {
    color: red;
  }
</style>
