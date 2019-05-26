<template>
  <view class="ei-calendar-item"
        :class="[
          { 'ei-calendar-item--disabled': day.isDisabled },
          { 'ei-calendar-item--virtual': day.virtual },
          { 'ei-calendar-item--today': day.isToday },
          { 'ei-calendar-item--single-selected': selected === 'single' },
          { 'ei-calendar-item--range-selected': selected === 'range' },
          { 'ei-calendar-item--first-selected': selected === 'first' },
          { 'ei-calendar-item--last-selected': selected === 'last' },
          customDate.cellClass
        ]"
        @click="onDayClick">
    <view class="ei-calendar-item__top">
      <view v-for="(item, index) in topList" :class="[item.class || 'ei-calendar-item__top__item']" :key="index">{{item.text}}</view>
    </view>
    <view class="ei-calendar-item__center">
      <view class="ei-calendar-item__center__day">{{day.day}}</view>
    </view>
    <view class="ei-calendar-item__bottom">
      <view v-if="day.isToday" class="ei-calendar-item__bottom__today">今天</view>
    </view>
  </view>
</template>

<script>
import EDate from './EDate';

export default {
  name: 'ei-calendar-item',
  props: {
    day: {
      type: Object,
      required: true
    },
    cellClass: {
      type: Object,
      default: () => ({})
    },
    type: String,
    selectedValue: [String, Number],
    selection: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    selected() {
      const time = this.day.time;
      if ('single' === this.type) {
        return time === this.selectedValue ? 'single' : false;
      }
      const index = this.selection.findIndex(item => item === time);
      if (this.type === 'multiple') {
        return index < 0 ? false : 'single';
      }
      const lastIndex = (this.selection.length || 1) -1;
      if (index === 0) {
        return 'first';
      }
      if (index === lastIndex ) {
        return 'last';
      }
      return time >= this.selection[0] && time <= this.selection[lastIndex] ? 'range' : false;
    },
    customDate() {
      return this.day.customDate || {};
    },
    topList() {
      return this.customDate.top || [];
    },
    centerList() {
      return this.customDate.center || [];
    },
    bottomList() {
      return this.customDate.bottom || [];
    }
  },
  methods: {
    onDayClick() {
      const day = this.day;
      this.$emit('click', day, day.isDisabled, day.virtual);
    }
  },
};
</script>

<style scoped lang="scss">
  @import "../../uni";
  $color-primary: #1890ff;
  .ei-calendar-item{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    line-height: 1.2 * $uni-font-size-base;
    box-sizing: border-box;
    width: 100%;
    padding: 1upx;
    color: $uni-text-color;
    &--disabled {
      opacity: 0.3;
    }
    &--today {
      color: rgba(253, 46, 50, .7);
    }
    &--single-selected {
      background: $color-primary;
      color: #fff;
      border-radius: $uni-border-radius-base;
    }
    &--range-selected {
      background: mix(#fff, $color-primary, 80%);
      color: #fff;
      opacity: 0.8;
      &.ei-calendar-item--virtual {
        opacity: .3;
      }
    }
    &--first-selected {
      background: $color-primary;
      color: #fff;
      border-top-left-radius: $uni-border-radius-base;
      border-bottom-left-radius: $uni-border-radius-base;
      opacity: 0.8;
      &.ei-calendar-item--virtual {
        opacity: .5;
      }
    }
    &--last-selected {
      background: $color-primary;
      color: #fff;
      border-top-right-radius: $uni-border-radius-base;
      border-bottom-right-radius: $uni-border-radius-base;
      opacity: 0.8;
      &.ei-calendar-item--virtual {
        opacity: .5;
      }
    }
    &--virtual {
      opacity: 0.1;
    }
    &__top {
      height: 1.2 * $uni-font-size-base;
      font-size: 24upx;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      &__item {
        width: 10upx;
        height: 10upx;
        border-radius: $uni-border-radius-circle;
        background: rgba(253, 46, 50, .7);
      }
    }
    &__center {
      font-weight: bold;
      height: 1.2 * $uni-font-size-base;
      text-align: center;
    }
    &__bottom {
      height: 1.2 * $uni-font-size-base;
      text-align: center;
      font-size: 24upx;
    }
  }
</style>
