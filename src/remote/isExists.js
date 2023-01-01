const remoteStat = require('./stat');

/**
 * @param {import('ssh2').SFTPWrapper} sftp
 * @param {string} remotePath
 * @returns {Promise.<'d' | 'l' | 'f' | false>}
 */
module.exports = async function isRemoteExists(sftp, remotePath) {
    try {
        const info = await remoteStat(sftp, remotePath);

        if (info.isDirectory) return 'd';
        if (info.isSymbolicLink) return 'l';
        if (info.isFile) return 'f';
    } catch (e) {
        return false;
    }
};
