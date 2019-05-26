<template>
  <view v-if="visibleSync" class="ei-calendar" :class="{ 'ei-calendar--drawer': drawer, 'is-active': active}">
    <view class="ei-calendar__mask" @tap="close" v-if="drawer"></view>
    <view class="ei-calendar__container">
      <view class="ei-calendar__container__header">
        <view class="ei-calendar__container__header__row">
          <view class="ei-calendar__container__header__cancel" @click="close" v-if="drawer">取消</view>
          <view class="ei-calendar__container__header__title">{{title}}</view>
        </view>
        <view class="ei-calendar__container__header__date">
          <view class="ei-calendar__container__header__date__edge"></view>
          <view class="ei-calendar__container__header__date__btn" hover-class="is-hover" :hover-start-time="20" :hover-stay-time="70" @click="toYear(-1)">
            <view class="ei ei-d-left"></view>
          </view>
          <view class="ei-calendar__container__header__date__show">
            {{currentDateShow}}
          </view>
          <view class="ei-calendar__container__header__date__btn" hover-class="is-hover" :hover-start-time="20" :hover-stay-time="70" @click="toYear(1)">
            <view class="ei ei-d-right"></view>
          </view>
          <view class="ei-calendar__container__header__date__edge today" hover-class="is-hover" :hover-start-time="20" :hover-stay-time="70" @click="toYear(0)">今天</view>
        </view>
        <view class="ei-calendar__container__header__week">
          <view class="ei-calendar__container__header__week__day" v-for="(day,index) in week" :key="index">
            {{day}}
          </view>
        </view>
      </view>
      <swiper class="ei-calendar__container__content" vertical :current="currentIndex" :duration="duration" @animationfinish="animationfinish" skip-hidden-item-layout circular>
        <swiper-item class="ei-calendar__container__content__item" v-for="(item, itemIndex) in showMonthList" :key="itemIndex">
          <view class="ei-calendar__container__content__item__bg">{{item.month}}</view>
          <view v-for="(row, index) in item.days" :key="index" class="ei-calendar__container__content__item__row">
            <view class="ei-calendar__container__content__item__col" :class="{ 'is-range': type === 'range' }" v-for="day in row" :key="day.format">
              <ei-calendar-item :day="day"
                                :cell-class="cellClass"
                                :type="type"
                                :selected-value="selectedValue"
                                :selection="selection"
                                @click="onDayClick">
              </ei-calendar-item>
            </view>
          </view>
        </swiper-item>
      </swiper>
      <view class="ei-calendar__container__footer" v-if="!disabled">
        <button class="ei-calendar__container__footer__btn" type="primary" @click="doSubmit">确定</button>
      </view>
    </view>
  </view>
</template>

<script>
import EiCalendarItem from './ei-calendar-item';
import EDate from './EDate';

const CustomDate = {};

export default {
  name: 'ei-calendar',
  components: {EiCalendarItem},
  props: {
    visible: {
      type: Boolean
    },
    value: {
      type: [Array, String]
    },
    type: {
      validator(value) {
        return ['range', 'multiple', 'single'].indexOf(value) !== -1;
      },
      default: 'single'
    },
    disabled: {
      type: Boolean
    },
    cellClass: {
      type: Object,
      default: () => ({})
    },
    disabledDate: {
      type: [Array, Function],
      default: () => []
    },
    customDate: {
      type: [Array, Function],
      default: () => []
    },
    format: String,
    title: {
      type: String,
      default: '请选择日期'
    },
    drawer: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visibleSync: false,
      active: false,
      closeTimer:null,
      watchTimer:null,
      week: ['日', '一', '二', '三', '四', '五', '六'],
      months: ['1月', '2月', '3月','4月', '5月', '6月','7月', '8月', '9月','10月', '11月', '12月'],
      selectedValue: undefined,
      selection: [],
      currentDate: undefined,
      showMonthList: [],
      currentIndex: 1,
      duration: 200
    };
  },
  computed: {
    currentDateShow() {
      return this.currentDate ? `${this.currentDate.replace('/', '年')}月` : '';
    }
  },
  watch: {
    visible(val) {
      clearTimeout(this.watchTimer);
      setTimeout(() => {
        this.active = val
      }, 100);
      if(this.visibleSync){
        clearTimeout(this.closeTimer)
      }
      if (val) {
        this.visibleSync = val;
        this.initValue();
      } else {
        this.watchTimer = setTimeout(() => {
          this.visibleSync = val
        }, 300)
      }
    }
  },
  created() {
    this.initVisible();
  },
  methods: {
    initVisible() {
      this.visibleSync = this.visible;
      if (this.visible) {
        this.initValue();
      }
      setTimeout(() => {
        this.active = this.visible;
      }, 100);
    },
    initValue() {
      if (Array.isArray(this.customDate)) {
        this.customDate.forEach((item) => {
          const date = typeof item === 'string' ? item : item.date;
          if (date) {
            const format = new EDate([date]).format('YYYY/MM/DD');
            CustomDate[format] = typeof item === 'string' ? {
              date,
              top: [{}]
            } :item;
          }
        });
      }
      if (this.type === 'single') {
        const selectedValue = new EDate([this.value], 'YYYY/MM/DD');
        this.selectedValue = selectedValue.getTime();
        this.currentDate = selectedValue.format('YYYY/MM');
      } else {
        const valueList = this.value || [];
        const selection = [];
        valueList.forEach((item) => {
          selection.push(new EDate([item], 'YYYY/MM/DD').getTime());
        });
        this.selection = selection.sort();
        this.currentDate = EDate.format(this.selection[0], 'YYYY/MM') || new EDate([], 'YYYY/MM').format('YYYY/MM');
      }
      this.setShowMonthList(1);
    },
    setShowMonthList(index) {
      if (!this.currentDate) return;
      const currentDate = this.currentDate;
      const beforeDate = EDate.modify(this.currentDate, { m: -1 }).format('YYYY/MM');
      const afterDate = EDate.modify(this.currentDate, { m: +1 }).format('YYYY/MM');
      if (!this.showMonthList.length) {
        const before = this.getMonthDays(beforeDate);
        const current = this.getMonthDays(currentDate);
        const after = this.getMonthDays(afterDate);
        this.showMonthList = [before, current, after];
      } else {
        this.currentIndex = index;
        const [ beforeIndex, currentIndex, afterIndex ] = [[2, 0, 1], [0, 1, 2], [1, 2, 0]][this.currentIndex];
        const before = this.showMonthList.find(item => item.id === beforeDate) || this.getMonthDays(beforeDate);
        const current = this.showMonthList.find(item => item.id === currentDate) || this.getMonthDays(currentDate);
        const after = this.showMonthList.find(item => item.id === afterDate) || this.getMonthDays(afterDate);
        this.showMonthList[beforeIndex] = before;
        this.showMonthList[currentIndex] = current;
        this.showMonthList[afterIndex] = after;
      }
    },
    close() {
      this.active = false;
      this.$emit('close');
      this.$emit('update:visible', false);
      this.closeTimer = setTimeout(() => {
        this.visibleSync = false
      }, 200)
    },
    animationfinish(e) {
      const index = e.detail.current;
      this.currentIndex = index;
      this.currentDate = this.showMonthList[index].id;
      this.setShowMonthList(index);
    },
    getMonthDays(dateStr) { // 获取该年月的日期信息
      const [year, showMonth] = dateStr.split('/');
      const month = showMonth - 1;
      const firstDayOfMonth = new Date(year, month, 1).getDay();         //当月第一天是周几
      const lastDateOfMonth = new Date(year, month + 1, 0).getDate();    //当月最后一天是几号
      const lastDayOfLastMonth = new Date(year, month, 0).getDate();     //上一月的最后一天是周几
      const days=[];
      let line= 0;
      for(let i= 1; i <= lastDateOfMonth; i++){
        let dow = new Date(year, month, i).getDay();
        let k;
        //第一行
        if (dow === 0) {
          days[line] = [];
        } else if (i === 1) {
          days[line] = [];
          k= lastDayOfLastMonth - firstDayOfMonth + 1;
          for(let j= 0; j <firstDayOfMonth; j++){
            const nowYear = month === 0 ? year - 1 : year;
            const nowMonth = month === 0 ? 12 : month;
            const dayOption = this.getDayOption({
              year:nowYear,
              month:nowMonth-1,
              day:k,
              virtual: true,
              isToday: false
            });
            days[line].push(dayOption);
            k++;
          }
        }
        //普通日期
        // 当天
        const isToday = i === new Date().getDate() && month === new Date().getMonth() && +year === new Date().getFullYear();
        const dayOption = this.getDayOption({
          year: year,
          month: month,
          day: i,
          virtual: false,
          isToday
        });
        days[line].push(dayOption);
        if (dow === 6){
          line++;//一周最后一天加行
        } else if(i === lastDateOfMonth){//最后一行
          let k = 1;
          for (dow; dow < 6; dow++) {
            const nowYear = month + 2 > 11 ? year + 1 : year;
            const nowMonth = month + 2 > 11 ? 1: month + 2;
            const dayOption = this.getDayOption({
              year: nowYear,
              month: nowMonth-1,
              day: k,
              virtual: true,
              isToday: false
            });
            days[line].push(dayOption);
            k++;
          }
        }
      }
      return {
        id: dateStr,
        year,
        month: +showMonth,
        days
      };
    },
    getDayOption({ year, month, day, virtual, isToday }) {
      const date = new EDate([year, month, day], 'YYYY/MM/DD');
      const format = date.format();
      const time = date.getTime();
      let isDisabled = virtual;
      if (!virtual) {
        if (typeof this.disabledDate === 'function') {
          isDisabled = this.disabledDate.call(this.$parent, date);
        } else {
          isDisabled = this.disabledDate.includes(format);
        }
      }
      // 获取自定义日期
      const customDate = this.getCustomDate(format);
      return {
        isDisabled, // 日期禁用
        // isSelected, // 选中日期
        year,
        month: month + 1,
        day,
        date,
        time,
        format,
        virtual, // 虚拟日期
        isToday,
        customDate
      }
    },
    getCustomDate(dateStr) {
      if (typeof this.customDate === 'function') {
        return this.customDate(dateStr);
      }
      return CustomDate[dateStr] || {};
    },
    onDayClick(day, isDisabled, virtual) {
      this.$emit('click', day);
      if (isDisabled || virtual || this.disabled) return;
      if (this.type === 'single') {
        this.selectedValue = day.time;
        this.$emit('change', this.getResultValue());
        return;
      }
      if (this.type === 'multiple') {
        const value = day.time;
        const index = this.selection.findIndex(item => item === value);
        if (index < 0) {
          this.selection.push(value);
        } else {
          this.selection.splice(index, 1);
        }
        this.$emit('change', this.getResultValue());
        return;
      }
      if (!this.selection.length) {
        this.selection.push(day.time);
      } else if (this.selection.length === 1) {
        const firstTime = this.selection[0];
        if (day.time !== firstTime) {
          const method = day.time > firstTime ? 'push' : 'unshift';
          this.selection[method](day.time);
        }
      } else {
        this.selection = [day.time];
      }
      this.$emit('change', this.getResultValue());
    },
    getResultValue() {
      if (this.type === 'single') {
        return this.format && this.selectedValue ? EDate.format(this.selectedValue, this.format) : new Date(this.selectedValue);
      } else {
        return this.format ? this.selection.map(item => EDate.format(item, this.format)) : this.selection.map(item => new Date(item));
      }
    },
    doSubmit() {
      const value = this.getResultValue();
      this.$emit('input', value);
      this.$emit('submit', value);
      this.close();
    },
    toYear(year) {
      if (!this.currentDate) return;
      if (year === 0) {
        const currentDate = new EDate().format('YYYY/MM');
        if (currentDate === this.currentDate) return;
        this.currentDate = currentDate;
        this.setShowMonthList(this.currentIndex);
      } else {
        this.currentDate = EDate.modify(this.currentDate, { y: year }).format('YYYY/MM');
        this.setShowMonthList(this.currentIndex);
      }
    }
  }
};
</script>




<style scoped lang="scss">
  @import "../../uni";
  @import "icon.css";
  .ei-calendar{
    color: $uni-text-color;
    &--drawer {
      position: fixed;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      overflow: hidden;
      z-index: 998;
      visibility: hidden;
      &.is-active {
        visibility: visible;
        .ei-calendar__mask {
          opacity: 1;
        }
        .ei-calendar__container {
          transform: translateY(0);
        }
      }
      .ei-calendar__mask { // 遮罩层
        opacity: 0;
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 100%;
        background: $uni-bg-color-mask;
        transition: opacity 0.3s;
      }
      .ei-calendar__container { // 日历
        position: absolute;
        transform: translateY(100%);
        bottom: 0;
        transition: all 0.3s ease-in;
      }
    }

    &__container { // 日历
      box-sizing: border-box;
      width: 100%;
      background: #fff;
      border-top-left-radius: $uni-border-radius-lg;
      border-top-right-radius: $uni-border-radius-lg;
      &__header { // 头部
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        position: relative;
        box-shadow: 0 2upx 5upx $uni-bg-color-hover;
        line-height: 1.5;
        &__row {
          width: 100%;
        }
        &__title { // 标题
          margin: 20upx 70upx;
          text-align: center;
        }
        &__cancel { // 取消按钮
          float: right;
          font-size: 24upx;
          color: $uni-text-color-grey;
          margin: 20upx 10upx;
        }
        &__date { // 表头日期
          margin-bottom: 20upx;
          font-weight: 700;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          &__show {}
          &__btn {
            font-size: 32upx;
            padding: 0 50upx;
            &.is-hover {
              color: #bbb;
            }
          }
          &__edge {
            width: 84upx;
            &.today {
              border: 1px rgba(253, 46, 50, .5) solid;
              border-right: 0;
              font-size: 24upx;
              border-top-left-radius: 50rpx;
              border-bottom-left-radius: 50rpx;
              color: rgba(253, 46, 50, .7);
              background: rgba(241, 233, 233, .4);
              text-align: center;
              &.is-hover {
                color: rgba(253, 46, 50, .5);
              }
            }
          }
        }
        &__week {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          &__day {
            padding: 10upx;
            width: percentage(100 / 7);
            text-align: center;
          }
        }
      }
      &__content {
        padding: 20upx;
        height: 650upx;
        box-sizing: border-box;
        &__item {
          box-sizing: border-box;
          position: relative;
          &__bg {
            z-index: 1;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0.1;
            position: absolute;
            font-size: 240upx;
            font-weight: bold;
          }
          &__row {
            z-index: 10;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
          }
          &__col {
            width: percentage(100 / 7);
            margin: 1upx;
            &.is-range {
              margin: 1upx 0;
            }
          }
        }
      }
      &__footer {
        padding: 20upx 40upx;
        width: 100%;
        box-sizing: border-box;
        &__btn {
          line-height: 2.5;
          border-radius: 2.5em;
          font-size: 28upx;
        }
      }
    }
  }
</style>
