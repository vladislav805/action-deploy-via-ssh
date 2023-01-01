/**
 * @param {import('ssh2').SFTPWrapper} sftp
 * @param {string} remotePath
 */
module.exports = async function remoteStat(sftp, remotePath) {
    return new Promise((resolve, reject) => {
        sftp.stat(remotePath, (err, stats) => {
            if (err) {
                if (err.code === 2 || err.code === 4) {
                    reject(new Error(`No such file: ${remotePath}`));
                    return;
                } else {
                    reject(new Error(`${err.message} ${remotePath}`));
                    return;
                }
            }

            resolve({
                mode: stats.mode,
                uid: stats.uid,
                gid: stats.gid,
                size: stats.size,
                accessTime: stats.atime * 1000,
                modifyTime: stats.mtime * 1000,
                isDirectory: stats.isDirectory(),
                isFile: stats.isFile(),
                isBlockDevice: stats.isBlockDevice(),
                isCharacterDevice: stats.isCharacterDevice(),
                isSymbolicLink: stats.isSymbolicLink(),
                isFIFO: stats.isFIFO(),
                isSocket: stats.isSocket(),
            });
        });
    });
};
