<template>
	<view class="page">
    date:
    <view v-for="(item, index) in date" :key="index">{{item}}</view>
    <button @click="show = true">click</button>
		<ei-calendar :disabled="false" title="我是一个很长很长很长灰常长的名字，我还不够长我继续很长很长很长" :visible.sync="show" type="multiple" :disabledDate="disabledDate" v-model="date" :custom-date="customDate" format="YYYY-MM-DD">
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
        const end = new Date('2019/7/21').getTime();
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
    color: #ccc;
  }
  .custom-cell-top-2 {
    color: red;
  }
</style>
