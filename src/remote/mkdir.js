const { parse } = require('path');
const isRemoteExists = require('./isExists');

/**
 * @param {import('ssh2').SFTPWrapper} sftp
 * @param {string} remotePath
 * @returns {Promise.<void>}
 */
async function mkdir(sftp, remotePath) {
    return new Promise((resolve, reject) => {
        sftp.mkdir(remotePath, err => {
            if (err) {
                if (err.code === 4) {
                    reject(new Error(`Bad path: ${p} permission denied`));
                    return;
                } else if (err.code === 2) {
                    reject(new Error(`Bad path: ${p} parent not a directory or not exist`));
                    return;
                } else {
                    reject(new Error(`${err.message} ${p}`));
                    return;
                }
            }

            resolve();
        });
    });
}

/**
 *
 * @param {import('ssh2').SFTPWrapper} sftp
 * @param {string} remotePath
 * @param {boolean=} recursive
 * @returns
 */
module.exports = async function remoteMkdir(sftp, remotePath, recursive) {
    const targetExists = await isRemoteExists(sftp, remotePath);

    if (targetExists && targetExists !== 'd') {
        throw new Error(`Bad path: ${remotePath} already exists as a file`);
    } else if (targetExists) {
        return new Error(`${remotePath} already exists`);
    }

    if (!recursive) {
        return mkdir(sftp, remotePath);
    }

    const dir = parse(remotePath).dir;

    if (dir) {
        const dirExists = await isRemoteExists(sftp, dir);

        if (!dirExists) {
            await remoteMkdir(sftp, dir, true);
        } else if (dirExists !== 'd') {
            throw new Error(`Bad path: ${dir} not a directory`);
        }
    }

    return mkdir(sftp, remotePath);
};
