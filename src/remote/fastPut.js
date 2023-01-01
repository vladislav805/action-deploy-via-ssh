/**
 *
 * @param {import('ssh2').SFTPWrapper} sftp
 * @param {string} localPath
 * @param {string} remotePath
 * @returns {Promise.<void>}
 */
module.exports = function fastPut(sftp, localPath, remotePath) {
    return new Promise((resolve, reject) => {
        sftp.fastPut(localPath, remotePath, {
            concurrency: 10,
        }, err => {
            if (err) {
                reject(new Error(`${err.message} Local: ${localPath} Remote: ${remotePath}`));
                return;
            }

            console.log(`OK ${localPath} -> ${remotePath}`);
            resolve();
        });
    });
}
