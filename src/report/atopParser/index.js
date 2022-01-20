import _, {
  map, zip, zipObject, each, compact, split, setWith, get
} from 'lodash';

import { CPU_TOTAL, CPU_TOTAL_FIELDS } from './labels/system/CPU_TOTAL';
import { CPU_CORE, CPU_CORE_FIELDS } from './labels/system/CPU_CORE';
import { CPU_LOAD, CPU_LOAD_FIELDS } from './labels/system/CPU_LOAD';
import { MEMORY_OCCUPATION, MEMORY_OCCUPATION_FIELDS } from './labels/system/MEMORY_OCCUPATION';
import { SWAP, SWAP_FIELDS } from './labels/system/SWAP';
import { PAGING_FREQUENCY, PAGING_FREQUENCY_FIELDS } from './labels/system/PAGING_FREQUENCY';
import { DISK_UTILIZATION, DISK_UTILIZATION_FIELDS } from './labels/system/DISK_UTILIZATION_FIELDS';
import { LOGICAL_VOLUME_UTILIZATION, LOGICAL_VOLUME_UTILIZATION_FIELDS } from './labels/system/LOGICAL_VOLUME_UTILIZATION';
import { MULTIPLE_DEVICE_UTILIZATION, MULTIPLE_DEVICE_UTILIZATION_FIELDS } from './labels/system/MULTIPLE_DEVICE_UTILIZATION';
import { NETWORK_UTILIZATION, NETWORK_UTILIZATION_FIELDS, NETWORK_UTILIZATION_UPPER_FIELDS } from './labels/system/NETWORK_UTILIZATION';

import { PROCESS_GENERAL, PROCESS_GENERAL_FIELDS } from './labels/process/PROCESS_GENERAL';
import { PROCESS_CPU, PROCESS_CPU_FIELDS } from './labels/process/PROCESS_CPU';
import { PROCESS_MEMORY, PROCESS_MEMORY_FIELDS } from './labels/process/PROCESS_MEMORY';
import { PROCESS_DISK, PROCESS_DISK_FIELDS } from './labels/process/PROCESS_DISK';
import { PROCESS_NETWORK, PROCESS_NETWORK_FIELDS } from './labels/process/PROCESS_NETWORK';

export const BOOT = 'RESET';
export const SEPARATOR = 'SEP';

export const DEFAULT_SUBCATEGORY = 'default';

// System Level
export * from './labels/system/CPU_TOTAL';
export * from './labels/system/CPU_CORE';
export * from './labels/system/CPU_LOAD';
export * from './labels/system/MEMORY_OCCUPATION';
export * from './labels/system/SWAP';
export * from './labels/system/PAGING_FREQUENCY';
export * from './labels/system/DISK_UTILIZATION_FIELDS';
export * from './labels/system/LOGICAL_VOLUME_UTILIZATION';
export * from './labels/system/MULTIPLE_DEVICE_UTILIZATION';
export * from './labels/system/NETWORK_UTILIZATION';

// Process Level
export * from './labels/process/PROCESS_GENERAL';
export * from './labels/process/PROCESS_CPU';
export * from './labels/process/PROCESS_MEMORY';
export * from './labels/process/PROCESS_DISK';
export * from './labels/process/PROCESS_NETWORK';

export default class AtopParser {
  constructor(atopLog) {
    this.atopLog = null;
    if (atopLog) {
      this.import(atopLog);
    }

    this.regExp = /\([^\)]*}|[^\( \)]+/ig;

    this.fields = zipObject(
      [
        CPU_TOTAL,
        CPU_CORE,
        CPU_LOAD,
        MEMORY_OCCUPATION,
        SWAP,
        PAGING_FREQUENCY,
        LOGICAL_VOLUME_UTILIZATION,
        MULTIPLE_DEVICE_UTILIZATION,
        DISK_UTILIZATION,
        NETWORK_UTILIZATION,

        PROCESS_GENERAL,
        PROCESS_CPU,
        PROCESS_MEMORY,
        PROCESS_DISK,
        PROCESS_NETWORK,
      ],
      [
        CPU_TOTAL_FIELDS,
        CPU_CORE_FIELDS,
        CPU_LOAD_FIELDS,
        MEMORY_OCCUPATION_FIELDS,
        SWAP_FIELDS,
        PAGING_FREQUENCY_FIELDS,
        LOGICAL_VOLUME_UTILIZATION_FIELDS,
        MULTIPLE_DEVICE_UTILIZATION_FIELDS,
        DISK_UTILIZATION_FIELDS,
        NETWORK_UTILIZATION_FIELDS,

        PROCESS_GENERAL_FIELDS,
        PROCESS_CPU_FIELDS,
        PROCESS_MEMORY_FIELDS,
        PROCESS_DISK_FIELDS,
        PROCESS_NETWORK_FIELDS,
      ]
    );
  }

  getFieldsByLabel(label) {
    return this.fields[label];
  }

  import(atopLog) {
    this.atopLog = atopLog;
    return this;
  }

  getDSV() {
    const rows = _(this.atopLog)
      .split(SEPARATOR)
      .join('')
      .split(BOOT)
      .join('')
      .split('\n');

    return compact(rows).join('\n');
  }

  getLines() {
    return split(this.getDSV(), '\n');
  }

  getLineArrays() {
    const parse = (line) => map([...line.matchAll(this.regExp)], '0');
    return map(this.getLines(), line => parse(line));
  }

  getMonitoringData() {
    const result = {};
    const entries = this.getLineArrays();

    const applyFields = (obj, entry, category, subcategory, fields) => {
      const tuples = map(fields, (field, index) => [field, entry[index + 6]]);
      const timestamp = entry[2];

      setWith(obj, [category, subcategory, timestamp], zipObject(...zip(...tuples)), Object);
    };

    each(entries, (entry) => {
      switch (entry[0]) {
        case CPU_TOTAL:
          applyFields(result, entry, CPU_TOTAL, DEFAULT_SUBCATEGORY, CPU_TOTAL_FIELDS);
          break;
        case CPU_CORE:
          applyFields(result, entry, CPU_CORE, entry[7], CPU_CORE_FIELDS);
          break;
        case CPU_LOAD:
          applyFields(result, entry, CPU_LOAD, DEFAULT_SUBCATEGORY, CPU_LOAD_FIELDS);
          break;
        case MEMORY_OCCUPATION:
          applyFields(result, entry, MEMORY_OCCUPATION, DEFAULT_SUBCATEGORY, MEMORY_OCCUPATION_FIELDS);
          break;
        case SWAP:
          applyFields(result, entry, SWAP, DEFAULT_SUBCATEGORY, SWAP_FIELDS);
          break;
        case PAGING_FREQUENCY:
          applyFields(result, entry, PAGING_FREQUENCY, DEFAULT_SUBCATEGORY, PAGING_FREQUENCY_FIELDS);
          break;
        case DISK_UTILIZATION:
          applyFields(result, entry, DISK_UTILIZATION, entry[6], DISK_UTILIZATION_FIELDS);
          break;
        case LOGICAL_VOLUME_UTILIZATION:
          applyFields(result, entry, LOGICAL_VOLUME_UTILIZATION, entry[6], LOGICAL_VOLUME_UTILIZATION_FIELDS);
          break;
        case MULTIPLE_DEVICE_UTILIZATION:
          applyFields(result, entry, MULTIPLE_DEVICE_UTILIZATION, entry[6], MULTIPLE_DEVICE_UTILIZATION_FIELDS);
          break;
        case NETWORK_UTILIZATION:
          if (entry[6] === 'upper') {
            applyFields(result, entry, NETWORK_UTILIZATION, entry[6], NETWORK_UTILIZATION_UPPER_FIELDS);
          } else {
            applyFields(result, entry, NETWORK_UTILIZATION, entry[6], NETWORK_UTILIZATION_FIELDS);
          }
          break;
        case PROCESS_GENERAL:
          applyFields(result, entry, PROCESS_GENERAL, entry[6], PROCESS_GENERAL_FIELDS);
          break;
        case PROCESS_CPU:
          applyFields(result, entry, PROCESS_CPU, entry[6], PROCESS_CPU_FIELDS);
          break;
        case PROCESS_MEMORY:
          applyFields(result, entry, PROCESS_MEMORY, entry[6], PROCESS_MEMORY_FIELDS);
          break;
        case PROCESS_DISK:
          applyFields(result, entry, PROCESS_DISK, entry[6], PROCESS_DISK_FIELDS);
          break;
        case PROCESS_NETWORK:
          applyFields(result, entry, PROCESS_NETWORK, entry[6], PROCESS_NETWORK_FIELDS);
          break;
        default:
          break;
      }
    });

    return result;
  }

  getMonitoringDataByLabel(label) {
    return get(this.getMonitoringData(), label);
  }
}
