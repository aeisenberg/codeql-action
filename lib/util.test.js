"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const testing_utils_1 = require("./testing-utils");
const util = __importStar(require("./util"));
testing_utils_1.setupTests(ava_1.default);
ava_1.default('getToolNames', t => {
    const input = fs.readFileSync(__dirname + '/../src/testdata/tool-names.sarif', 'utf8');
    const toolNames = util.getToolNames(input);
    t.deepEqual(toolNames, ["CodeQL command-line toolchain", "ESLint"]);
});
ava_1.default('getMemoryFlag() should return the correct --ram flag', t => {
    const totalMem = Math.floor(os.totalmem() / (1024 * 1024));
    const tests = {
        "": `--ram=${totalMem - 256}`,
        "512": "--ram=512",
    };
    for (const [input, expectedFlag] of Object.entries(tests)) {
        process.env['INPUT_RAM'] = input;
        const flag = util.getMemoryFlag();
        t.deepEqual(flag, expectedFlag);
    }
});
ava_1.default('getMemoryFlag() throws if the ram input is < 0 or NaN', t => {
    for (const input of ["-1", "hello!"]) {
        process.env['INPUT_RAM'] = input;
        t.throws(util.getMemoryFlag);
    }
});
ava_1.default('getThreadsFlag() should return the correct --threads flag', t => {
    const numCpus = os.cpus().length;
    const tests = {
        "0": "--threads=0",
        "1": "--threads=1",
        [`${numCpus + 1}`]: `--threads=${numCpus}`,
        [`${-numCpus - 1}`]: `--threads=${-numCpus}`
    };
    for (const [input, expectedFlag] of Object.entries(tests)) {
        process.env['INPUT_THREADS'] = input;
        const flag = util.getThreadsFlag();
        t.deepEqual(flag, expectedFlag);
    }
});
ava_1.default('getThreadsFlag() throws if the threads input is not an integer', t => {
    process.env['INPUT_THREADS'] = "hello!";
    t.throws(util.getThreadsFlag);
});
ava_1.default('getRef() throws on the empty string', t => {
    process.env["GITHUB_REF"] = "";
    t.throws(util.getRef);
});
ava_1.default('isLocalRun() runs correctly', t => {
    const origLocalRun = process.env.CODEQL_LOCAL_RUN;
    process.env.CODEQL_LOCAL_RUN = '';
    t.assert(!util.isLocalRun());
    process.env.CODEQL_LOCAL_RUN = 'false';
    t.assert(!util.isLocalRun());
    process.env.CODEQL_LOCAL_RUN = '0';
    t.assert(!util.isLocalRun());
    process.env.CODEQL_LOCAL_RUN = 'true';
    t.assert(util.isLocalRun());
    process.env.CODEQL_LOCAL_RUN = 'hucairz';
    t.assert(util.isLocalRun());
    process.env.CODEQL_LOCAL_RUN = origLocalRun;
});
ava_1.default('prepareEnvironment() when a local run', t => {
    const origLocalRun = process.env.CODEQL_LOCAL_RUN;
    process.env.CODEQL_LOCAL_RUN = 'false';
    process.env.GITHUB_JOB = 'YYY';
    util.prepareLocalRunEnvironment();
    // unchanged
    t.deepEqual(process.env.GITHUB_JOB, 'YYY');
    process.env.CODEQL_LOCAL_RUN = 'true';
    util.prepareLocalRunEnvironment();
    // unchanged
    t.deepEqual(process.env.GITHUB_JOB, 'YYY');
    process.env.GITHUB_JOB = '';
    util.prepareLocalRunEnvironment();
    // updated
    t.deepEqual(process.env.GITHUB_JOB, 'UNKNOWN-JOB');
    process.env.CODEQL_LOCAL_RUN = origLocalRun;
});
//# sourceMappingURL=util.test.js.map