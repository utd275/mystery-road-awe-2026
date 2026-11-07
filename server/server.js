import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();

const PORT = 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDirectory = path.join(
  __dirname,
  "..",
  "public",
  "data"
);

async function readJson(filename) {
  const filePath = path.join(
    dataDirectory,
    filename
  );

  const content = await fs.readFile(
    filePath,
    "utf-8"
  );

  return JSON.parse(content);
}

function getDelay(req) {
  const delay = Number(req.query.delay ?? 0);

  return Number.isFinite(delay)
    ? Math.max(0, delay)
    : 0;
}

function shouldFail(req) {
  return req.query.fail === "true";
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function sendData(
  req,
  res,
  filename,
  emptyValue = null
) {
  if (shouldFail(req)) {
    res.status(500).json({
      error: "Simulated server error",
    });

    return;
  }

  const delay = getDelay(req);

  if (delay > 0) {
    await wait(delay);
  }

  if (
    req.query.empty === "true" &&
    emptyValue !== null
  ) {
    res.json(emptyValue);
    return;
  }

  try {
    const data = await readJson(filename);
    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to read data",
    });
  }
}

app.get("/api/case", (req, res) => {
  void sendData(
    req,
    res,
    "case.json"
  );
});

app.get("/api/evidence", (req, res) => {
  void sendData(
    req,
    res,
    "evidence.json",
    []
  );
});

app.get("/api/people", (req, res) => {
  void sendData(
    req,
    res,
    "people.json"
  );
});

app.get("/api/locations", (req, res) => {
  void sendData(
    req,
    res,
    "locations.json"
  );
});

app.get("/api/timeline", (req, res) => {
  void sendData(
    req,
    res,
    "timeline.json"
  );
});

app.listen(PORT, () => {
  console.log(
    `ReMotion API running on http://localhost:${PORT}`
  );
});