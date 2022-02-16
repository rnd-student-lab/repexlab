import { get, set } from 'lodash';
import moment from 'moment';

export default class RepexlabStageTimer {
  constructor() {
    this.timeEntries = {};
  }

  set(stage, event, date) {
    if (!date) {
      return set(this.timeEntries, [stage, event], moment());
    }
    return set(this.timeEntries, [stage, event], moment(date));
  }

  get(stage, event) {
    return get(this.timeEntries, [stage, event]);
  }
}
