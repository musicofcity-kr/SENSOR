(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.SensorCsvAnalyzerCore = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function parseCSV(text) {
    if (typeof text !== "string") return [];
    if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
    const rows = [];
    const lines = text.split(/\r\n|\n|\r/);
    for (const line of lines) {
      if (line.trim() === "") continue;
      const cells = [];
      let cur = "";
      let inQuote = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
          if (inQuote && line[i + 1] === '"') {
            cur += '"';
            i++;
          } else {
            inQuote = !inQuote;
          }
        } else if (ch === "," && !inQuote) {
          cells.push(cur.trim());
          cur = "";
        } else {
          cur += ch;
        }
      }
      cells.push(cur.trim());
      rows.push(cells);
    }
    return rows;
  }

  function detectColumns(rows) {
    if (!rows || rows.length < 2) return { timeIdx: -1, valueIdx: -1 };
    const headers = rows[0];
    const timeNames = ["수집시간", "시간", "time", "timestamp", "측정시간", "일시"];
    let timeIdx = -1;
    let valueIdx = -1;

    for (let i = 0; i < headers.length; i++) {
      const h = String(headers[i]).toLowerCase().replace(/\s/g, "");
      if (timeNames.some((n) => h.includes(n.toLowerCase()))) {
        timeIdx = i;
        break;
      }
    }

    if (timeIdx === -1) {
      const sample = rows.slice(1, Math.min(rows.length, 11));
      for (let i = 0; i < headers.length; i++) {
        const ok = sample.filter((r) => r[i] && /^\d{1,2}:\d{2}(:\d{2})?(\.\d+)?$/.test(r[i].trim())).length;
        if (ok >= Math.max(1, Math.floor(sample.length * 0.7))) {
          timeIdx = i;
          break;
        }
      }
    }

    const sample = rows.slice(1, Math.min(rows.length, 21));
    for (let i = 0; i < headers.length; i++) {
      if (i === timeIdx) continue;
      const ok = sample.filter((r) => r[i] !== undefined && r[i] !== "" && Number.isFinite(parseFloat(r[i]))).length;
      if (sample.length > 0 && ok >= Math.max(1, Math.floor(sample.length * 0.7))) {
        valueIdx = i;
        break;
      }
    }
    return { timeIdx, valueIdx };
  }

  function parseTimeToSeconds(timeString) {
    if (typeof timeString !== "string") return null;
    const m = timeString.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?$/);
    if (!m) return null;
    const h = parseInt(m[1], 10);
    const min = parseInt(m[2], 10);
    const s = m[3] !== undefined ? parseInt(m[3], 10) : 0;
    const ms = m[4] !== undefined ? parseInt(m[4].padEnd(3, "0"), 10) : 0;
    if (h > 23 || min > 59 || s > 59) return null;
    return h * 3600 + min * 60 + s + ms / 1000;
  }

  function cleanRows(rows, timeIdx, valueIdx) {
    const data = [];
    let excluded = 0;
    let baseSec = null;
    let prevAbs = null;
    let dayOffset = 0;

    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      if (!row || row.length === 0) {
        excluded++;
        continue;
      }
      const tSec = parseTimeToSeconds(row[timeIdx]);
      const v = parseFloat(row[valueIdx]);
      if (tSec === null || !Number.isFinite(v)) {
        excluded++;
        continue;
      }

      let abs = tSec + dayOffset;
      if (prevAbs !== null && abs < prevAbs - 1) {
        dayOffset += 86400;
        abs = tSec + dayOffset;
      }
      prevAbs = abs;
      if (baseSec === null) baseSec = abs;
      data.push({ t: abs - baseSec, v, timeStr: row[timeIdx].trim() });
    }
    return { data, excluded };
  }

  function fmt(n, digits = 2) {
    if (!Number.isFinite(n)) return "-";
    const r = Math.round(n * Math.pow(10, digits)) / Math.pow(10, digits);
    return r.toLocaleString("ko-KR", { maximumFractionDigits: digits });
  }

  function fmtDuration(sec) {
    if (!Number.isFinite(sec)) return "-";
    if (sec < 60) return fmt(sec, 1) + "초";
    const m = Math.floor(sec / 60);
    const s = sec - m * 60;
    return m + "분 " + fmt(s, 0) + "초";
  }

  function calculateStats(data) {
    if (!data || data.length === 0) return null;
    const vals = data.map((d) => d.v);
    const n = vals.length;
    const first = data[0];
    const last = data[n - 1];
    const sum = vals.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    const sorted = vals.slice().sort((a, b) => a - b);
    const median = n % 2 === 1 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;

    let minIdx = 0;
    let maxIdx = 0;
    for (let i = 1; i < n; i++) {
      if (vals[i] < vals[minIdx]) minIdx = i;
      if (vals[i] > vals[maxIdx]) maxIdx = i;
    }

    const variance = n > 0 ? vals.reduce((a, b) => a + (b - mean) ** 2, 0) / n : 0;
    const stddev = Math.sqrt(variance);
    const totalTime = last.t - first.t;
    const avgInterval = n > 1 ? totalTime / (n - 1) : 0;
    const totalChange = last.v - first.v;
    const ratePerSec = totalTime > 0 ? totalChange / totalTime : 0;

    let bigIdx = -1;
    let bigDiff = 0;
    for (let i = 1; i < n; i++) {
      const diff = Math.abs(vals[i] - vals[i - 1]);
      if (diff > bigDiff) {
        bigDiff = diff;
        bigIdx = i;
      }
    }

    return {
      count: n,
      totalTime,
      avgInterval,
      first: first.v,
      last: last.v,
      min: vals[minIdx],
      max: vals[maxIdx],
      minT: data[minIdx].t,
      maxT: data[maxIdx].t,
      minTimeStr: data[minIdx].timeStr,
      maxTimeStr: data[maxIdx].timeStr,
      sum,
      mean,
      median,
      variance,
      stddev,
      range: vals[maxIdx] - vals[minIdx],
      totalChange,
      ratePerSec,
      bigChange: bigIdx > 0 ? { from: data[bigIdx - 1], to: data[bigIdx], diff: vals[bigIdx] - vals[bigIdx - 1] } : null,
    };
  }

  return {
    parseCSV,
    detectColumns,
    parseTimeToSeconds,
    cleanRows,
    calculateStats,
    fmt,
    fmtDuration,
  };
});