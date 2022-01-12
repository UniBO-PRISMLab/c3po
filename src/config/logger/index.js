const pinoMultiStream = require("pino-multi-stream");
const childProcess = require("child_process");
const stream = require("stream");

const gConfig = require("../conf.json");
const cwd = process.cwd();
const { env } = process;

const levels = {
  debug: 20,
  network: 45,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
};

const logThrough = new stream.PassThrough();
const prettyStream = pinoMultiStream.prettyStream({
  //customLevels: customLevels, // our defined levels
  prettyPrint: {
    levelFirst: true,
    colorize: true,
    translateTime: true,
    ignore: "pid,hostname",
  },
});

const streams = [
  { stream: logThrough },
  { stream: prettyStream },
];
const log = pinoMultiStream(
  {
    customLevels: levels,
    useOnlyCustomLevels: true,
    level: "info",
  },
  pinoMultiStream.multistream(streams)
);

const child = childProcess.spawn(
  process.execPath,
  [
    require.resolve("pino-tee"),
    "warn",
    `${__dirname}/network.log`,
    "error",
    `${__dirname}/error.log`,
    "fatal",
    `${__dirname}/fatal.log`,
  ],
  { cwd, env }
);

logThrough.pipe(child.stdin);

module.exports = log;
