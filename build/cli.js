#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var minimist_1 = __importDefault(require("minimist"));
var index_1 = require("./index");
var argv = minimist_1.default(process.argv.slice(2));
if (!argv.input) {
    throw new Error('please pass --input to your rrweb events file');
}
var config = {};
if (argv.config) {
    var configPath = path.isAbsolute(argv.config)
        ? argv.config
        : path.resolve(process.cwd(), argv.config);
    config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
}
index_1.transformToVideo({
    input: argv.input,
    output: argv.output,
    rrwebPlayer: config
})
    .then(function (file) {
    console.log("Successfully transformed into \"" + file + "\".");
})
    .catch(function (error) {
    console.log('Failed to transform this session.');
    console.error(error);
    process.exit(1);
});
