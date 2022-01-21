import * as ejs from 'ejs';
import { get, map, mapValues } from 'lodash';
import moment from 'moment';
import template from './template';

export default class ReportHTML {
  constructor(data, charts, start, end) {
    this.template = ejs.compile(template, {});

    this.data = data;
    this.charts = charts;

    this.start = moment(start);
    this.end = moment(end);

    this.plotlyLayout = {
      xaxis: {
        tickformat: '%H:%M:%S',
      },
      yaxis: {
        rangemode: 'nonnegative',
        autorange: true,
      },
    };

    this.plotlyConfig = { responsive: true };
  }

  getChartData(categoryData, chart) {
    const x = [];
    const y = [];

    const start = this.start.unix();
    const end = this.end.unix();

    for (let i = start; i < end; i += 1) {
      x.push(moment.unix(i).format());
      y.push(get(categoryData, [i, chart]));
    }
    return { chart, x, y };
  }

  getCharts() {
    return mapValues(
      this.data,
      (category) => map(
        this.charts,
        (chart) => this.getChartData(category, chart)
      )
    );
  }

  buildReport(title) {
    return this.template({
      title,
      charts: this.getCharts(),
      layout: this.plotlyLayout,
      config: this.plotlyConfig,
    });
  }
}
