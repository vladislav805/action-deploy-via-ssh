const { statSync } = require('fs');

/**
 * @param {string} filePath
 * @returns {'d' | 'f' | false}
 */
module.exports = function isLocalExists(filePath) {
    const stats = statSync(filePath, { throwIfNoEntry: false });

    if (!stats) {
        return false;
    }

    if (stats.isDirectory()) {
        return 'd';
    }

    if (stats.isFile()) {
        return 'f';
    }

    throw new Error(`Bad path: ${filePath}: target must be a file or directory`);
};
