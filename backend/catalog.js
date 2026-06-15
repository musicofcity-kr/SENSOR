"use strict";

const substances = require("../shared/substances.json");

const STATES = ["solid", "liquid", "gas"];
const VERSION = "2026-06-15";

function getCatalog() {
  return {
    service: "mole-mass-comparator",
    version: VERSION,
    states: STATES,
    count: Object.keys(substances).length,
    substances,
  };
}

function getSubstancesByState(state) {
  if (!STATES.includes(state)) {
    return [];
  }

  return Object.entries(substances)
    .filter(([, item]) => item.state === state)
    .map(([key, item]) => ({ key, ...item }));
}

module.exports = {
  STATES,
  VERSION,
  getCatalog,
  getSubstancesByState,
};
