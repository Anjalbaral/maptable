/* eslint no-unused-vars: 0 */
import utils from './utils';
import defaultOptions from './defaultOptions';
import MapTable from './maptable';

d3.maptable = function (target) {
  let maptableObject;
  const maptable = {};
  const options = {
    target,
    columns: {},
    data: {},
    map: null,
    filters: null,
    table: null,
  };

  maptable.map = function (mapOptions = {}) {
    if (!topojson) {
      throw new Error('Maptable requires topojson.js');
    }
    if (typeof mapOptions.path !== 'string' && typeof mapOptions.pathData !== 'string') {
      throw new Error('MapTable: map not provided');
    }
    options.map = mapOptions;
    return maptable;
  };

  maptable.data = function (data) {
    options.data.type = 'data';
    options.data.value = data;
    return maptable;
  };

  maptable.json = function (jsonPath, preFilter) {
    options.data.type = 'json';
    options.data.path = jsonPath;
    options.data.preFilter = preFilter;
    return maptable;
  };

  maptable.jsonData = function (jsonData) {
    options.data.type = 'jsonData';
    options.data.value = jsonData;
    return maptable;
  };

  maptable.csv = function (csvPath, preFilter) {
    options.data.type = 'csv';
    options.data.path = csvPath;
    options.data.preFilter = preFilter;
    return maptable;
  };

  maptable.csvData = function (csvData) {
    options.data.type = 'csvData';
    options.data.value = csvData;
    return maptable;
  };

  maptable.tsv = function (tsvPath, preFilter) {
    options.data.type = 'tsv';
    options.data.path = tsvPath;
    options.data.preFilter = preFilter;
    return maptable;
  };

  maptable.tsvData = function (tsvData) {
    options.data.type = 'tsvData';
    options.data.value = tsvData;
    return maptable;
  };

  maptable.filters = function (filtersOptions = {}) {
    options.filters = filtersOptions;
    return maptable;
  };

  maptable.table = function (tableOptions = {}) {
    options.table = tableOptions;
    return maptable;
  };

  maptable.columns = function (columns = {}) {
    options.columns = columns;
    return maptable;
  };

  maptable.render = function (onComplete) {
    if (typeof target !== 'string' || !document.querySelector(target)) {
      throw new Error('MapTable: target not found');
    }

    if (!options.data || !options.data.type) {
      throw new Error('MapTable: Please provide the path for your dataset data|json|jsonData|csv|csvData|tsv|tsvData');
    }

    if (options.map && !options.map.heatmap) options.map.heatmap = null;

    if (options.map && options.map.markers === false) options.map.markers = null;

    if (options.map && options.map.countries === false) options.map.countries = null;

    if (!options.filters) options.filters = null;
    options.onComplete = onComplete;

    const customOptions = utils.extendRecursive(defaultOptions, options);

    if (options.map && !options.map.markers) delete customOptions.map.markers;
    if (options.map && !options.map.heatmap) delete customOptions.map.heatmap;
    if (options.map && !options.map.title) delete customOptions.map.title;
    if (options.map && !options.map.timezones) delete customOptions.map.timezones;
    if (options.map && !options.map.night) delete customOptions.map.night;
    if (!options.filters) delete customOptions.filters;
    if (!options.table) delete customOptions.table;

    maptableObject = new MapTable(target, customOptions);

    // public functions
    return {
      render: () => maptableObject.render(),
      loadState: (stateName, isJson) => maptableObject.loadState(stateName, isJson),
      removeState: (stateName) => maptableObject.removeState(stateName),
      saveState: (stateName, stateData) => maptableObject.saveState(stateName, stateData),
      setTitleContent: (title) => {
        maptableObject.options.map.title.content = () => title;
      },
      setData: (data) => {
        maptableObject.options.data.type = 'data';
        maptableObject.options.data.value = data;
        maptableObject.options.rawData = data;
        maptableObject.rawData = data;
        maptableObject.data = data;
        if (maptableObject.map) {
          maptableObject.map.enrichData();
        }
      },
      setNightDate: (date) => {
        maptableObject.options.map.night.date = date;
      },
      setTimezonesDate: (date) => {
        maptableObject.options.map.timezones.date = date;
      },
      getMapWidth: () => maptableObject.map.getWidth(),
      getMapHeight: () => maptableObject.map.getHeight(),
    };
  };
  return maptable;
};

if (!d3) {
  throw new Error('Maptable requires d3.js');
}

export default d3.maptable;
