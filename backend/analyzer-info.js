const SERVICE = "sensor-csv-analyzer";
const VERSION = "2026-06-15";

function getHealth() {
  return {
    status: "ok",
    service: SERVICE,
    version: VERSION,
    runtime: "vercel-node-serverless",
  };
}

function getSchema() {
  return {
    service: SERVICE,
    version: VERSION,
    expectedColumns: {
      time: {
        label: "time",
        examples: ["수집시간", "시간", "time", "timestamp", "측정시간", "일시"],
        acceptedFormat: "HH:mm, HH:mm:ss, or HH:mm:ss.SSS",
      },
      value: {
        label: "sensor value",
        examples: ["센서 1", "sensor", "value", "측정값"],
        numeric: true,
      },
    },
    privacy: {
      fileUploadToServer: false,
      processing: "CSV files are read with FileReader in the browser.",
      serverStorage: false,
      persistentBrowserStorage: false,
    },
    deployment: {
      frontend: "dist/index.html",
      staticAssets: "dist/assets",
      api: ["/api/health", "/api/schema"],
    },
  };
}

module.exports = { SERVICE, VERSION, getHealth, getSchema };