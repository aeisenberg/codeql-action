"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const github_linguist_1 = require("github-linguist");
const supportedLanguages = {
    c: "cpp",
    "c++": "cpp",
    "c#": "csharp",
    go: "go",
    java: "java",
    javascript: "javascript",
    python: "python",
    ruby: "ruby",
    typescript: "jypescript",
};
/**
 * Count the lines of code of the specified language using the include
 * and exclude glob paths.
 */
async function countLoc(cwd, include, exclude, dbLanguages, logger) {
    const result = await new github_linguist_1.LocDir({
        cwd,
        include,
        exclude,
    }).loadInfo();
    // The analysis counts LoC in all languages. We need to
    // extract the languages we care about. Also, note that
    // the analysis uses slightly different names for language.
    const lineCounts = Object.entries(result.languages).reduce((obj, [language, { code }]) => {
        const dbLanguage = supportedLanguages[language];
        if (dbLanguage && dbLanguages.includes(dbLanguage)) {
            obj[dbLanguage] = code + (obj[dbLanguage] || 0);
        }
        return obj;
    }, {});
    if (Object.keys(lineCounts).length) {
        logger.debug("Lines of code count:");
        for (const [language, count] of Object.entries(lineCounts)) {
            logger.debug(`  ${language}: ${count}`);
        }
    }
    else {
        logger.warning("Did not find any lines of code in database.");
    }
    return lineCounts;
}
exports.countLoc = countLoc;
//# sourceMappingURL=count-loc.js.map