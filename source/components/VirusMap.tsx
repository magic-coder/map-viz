/**
 * WebCell疫情地图组件
 * 基于EchartsMap组件构建的疫情地图组件，传入地图url及各区域的具体信息后自动生成疫情地图。
 * @author: shadowingszy
 * 
 * 传入props说明:
 * mapUrl: 地图json文件地址。
 * data: echarts中的数据。
 * chartOnClickCallBack: 点击地图后的回调函数。
 */

import { observer } from 'mobx-web-cell';
import { component, mixin, createCell, attribute, watch } from 'web-cell';
import { EchartsMap } from "../components/EchartsMap";

interface VirusMapProps {
  mapUrl?: string;
  data?: Array<any>;
  chartOnClickCallBack?: Function;
}

@observer
@component({
  tagName: 'virus-map',
  renderTarget: 'children'
})
export class VirusMap extends mixin<VirusMapProps, {}>() {
  @attribute
  @watch
  mapUrl = '';

  @attribute
  @watch
  data = [];

  @attribute
  @watch
  chartOnClickCallBack = (param) => { console.log(param) };

  public render() {
    const {mapUrl, data, chartOnClickCallBack} = this.props;
    const chartOptions = {
      title: {
        text: "疫情地图"
      },
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          const suspectStr = data[params.dataIndex].suspect === undefined ? '' : '<br/>疑似：' + data[params.dataIndex].suspect
          const output = '确诊：' + data[params.dataIndex].confirmed
            + suspectStr
              + '<br/>治愈：' + data[params.dataIndex].cured
                + '<br/>死亡：' + data[params.dataIndex].death
          return output;
        }
      },
      dataRange: {
        x: 'left',
        y: 'bottom',
        splitList: [
          { start: 0, end: 0, color: '#EEEEEE' },
          { start: 1, end: 10, color: '#FFEBCD' },
          { start: 10, end: 50, color: '#FFAF50' },
          { start: 50, end: 100, color: '#FF4500' },
          { start: 100, end: 500, color: '#CD5C5C' },
          { start: 500, end: 1000, color: '#800000' },
          { start: 1000, color: '#600000' },
        ]
      },
      series: [
        {
          name: '疫情数据',
          type: 'map',
          mapType: 'map',
          data: data.map((item) => { return { name: item.name, value: item.confirmed } })
        }
      ]
    };

    return (
      <EchartsMap
        mapUrl={mapUrl}
        chartOptions={chartOptions}
        chartOnClickCallBack={chartOnClickCallBack}
      />);
  }
}