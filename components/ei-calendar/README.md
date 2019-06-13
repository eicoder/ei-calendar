# ei-calendar(v1.0.1)

## 组件功能

1. 日历功能
2. 向下滑动
3. 禁用日期
4. 双向绑定
5. 类型
   1. 单选
   2. 多选
   3. 范围
6. 自定义日期
7. 事件
   1. click事件
   2. close
   3. submit

## 组件API设计

### ei-calendar Attributes

| 参数            | 说明                                                         | 类型                                           | 可选值                                     | 默认值     |
| --------------- | ------------------------------------------------------------ | ---------------------------------------------- | ------------------------------------------ | ---------- |
| visible         | 是否显示日历                                                 | boolean                                        | —                                          | false      |
| type            | 日历类型                                                     | string                                         | range（范围）/multiple（多选)/single(单选) | single     |
| value / v-model | 绑定值                                                       | date/string(single)<br />array(range/multiple) | —                                          | —          |
| disabled        | 禁用（不显示确定按钮）                                       | boolean                                        | —                                          | false      |
| disabledDate    | 设置禁用日期<br />参数为当前日期，要求返回 Boolean（function） | array/function                                 | —                                          | —          |
| customDate      | 设置自定义选中的日期，每个选中值的数据可为string（默认样式为右上角红色的点）或object，object方式，可为选中的日期添加自定义的文本跟样式，object属性具体参考下表（function的话只能返回object[]，参数为当前日期） | array/function                                 | —                                          | —          |
| format          | 返回日期格式，如果为空范围date                               | string                                         | YYYY/MM/DD/hh/mm/ss/a组合                  | —          |
| title           | 标题                                                         |                                                | —                                          | 请选择日期 |
| drawer          | 是否弹出层弹出                                               | boolean                                        | —                                          | true       |

### selectedDate

| 参数                      | 说明                    | 类型   | 可选值 | 默认值 |
| ------------------------- | ----------------------- | ------ | ------ | ------ |
| cellClass                 | 自定义cell类名          | string | —      | —      |
| date                      | 自定义日期（YYYY-MM-DD) | string | —      | —      |
| top/center/bottom         | 显示的位置              | []     | —      | —      |
| {top/center/bottom.class} | 自定义类                | string | —      | —      |
| {top /bottom.text}        | 自定义文本              | string | —      | —      |

```js
const customDate = [
    {
        cellClass: 'custom-cell',
        date: '2019-05-19',
        top: [
            {
                class: 'custom-cell-top-1',
                text: 'custom1'
            },
            ...
        ],
        center: [...],
        botoom: [...]
    }
]
```

### ei-calendar Methods

| 方法名  | 说明                                       | 参数 |
| ------- | ------------------------------------------ | ---- |
| refresh | 更新customDate并重新计算当前显示月份的数据 | —    |

> 通过ref调用 `this.$refs.calendar.refresh();`
>
> 需要动态修改customDate的话，`drawer = trure`弹出层模式下，每次打开都会重新计算，所以不需要做什么修改，非弹出层模式下，调用`this.$refs.calendar.refresh();`进行刷新

### ei-calendar Events

| 事件名称    | 说明                           | 回调参数                                                     |
| ----------- | ------------------------------ | ------------------------------------------------------------ |
| change      | 选中值改变时候触发             | 选中的值                                                     |
| close       | 关闭后触发                     | —                                                            |
| submit      | 点确定是触发                   | 选中的值                                                     |
| click       | 单元格点击事件                 | 选中单元格的数据`{ isDisabled: '是否禁用', year, month, day, date, time, format, virtual: '是否是虚拟日期（上下个月的日期)', isToday, customDate: '自定义日期数据'}` |
| date-change | 日历当前显示的年月变化时候触发 | nowDate(当前年月), oldDate(改变之前的年月) 格式为`YYYY/MM`   |

## demo

### 1、单选

```vue
<template>
	<view class="page">
    date: {{date}}
    <button @click="show = true">click</button>
		<ei-calendar :visible.sync="show" :disabledDate="disabledDate" v-model="date" :custom-date="customDate" format="YYYY-MM-DD">
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
                date: '',
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

```

### 2、多选

```vue
<template>
	<view class="page">
    date: 
    <view v-for="(item, index) in date" :key="index">{{item}}</view>
    <button @click="show = true">click</button>
		<ei-calendar :visible.sync="show" type="multiple" :disabledDate="disabledDate" v-model="date" :custom-date="customDate" format="YYYY-MM-DD">
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

```

### 3、范围

```vue
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

```

