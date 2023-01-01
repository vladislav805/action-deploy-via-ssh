const { readdirSync } = require('fs');
const { join } = require('path');
const isLocalExists = require('../local/isExists');
const isRemoteExists = require('../remote/isExists');
const fastPut = require('../remote/fastPut');
const mkdir = require('../remote/mkdir');

/**
 * @param {import('ssh2').Client} client
 * @returns {Promise.<import('ssh2').SFTPWrapper>}
 */
function getSftp(client) {
    return new Promise((resolve, reject) => {
        client.sftp((err, sftp) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(sftp);
        })
    });
}

/**
 * @param {import('ssh2').SFTPWrapper} sftp
 * @param {string} localPath
 * @param {string} remotePath
 * @returns {Promise.<void>}
 */
module.exports = async function uploadDirectory(client, localPath, remotePath) {
    const localType = isLocalExists(localPath);

    if (!localType) {
        throw new Error(`Bad path: ${localPath} not exist`);
    }

    if (localType !== 'd') {
        throw new Error(`Bad path: ${localPath}: not a directory`);
    }

    const sftp = await getSftp(client);

    const remoteStatus = await isRemoteExists(sftp, remotePath);

    if (remoteStatus && remoteStatus !== 'd') {
        throw new Error(`Bad path ${remotePath} Not a directory`);
    }

    if (!remoteStatus) {
        await mkdir(sftp, remotePath, true);
    }

    const dirEntries = readdirSync(localPath, {
        encoding: 'utf8',
        withFileTypes: true,
    });

    const fileUploads = [];

    for (const item of dirEntries) {
        const itemLocalPath = join(localPath, item.name);
        const itemRemotePath = `${remotePath}/${item.name}`;

        if (item.isDirectory()) {
            await uploadDirectory(itemLocalPath, itemRemotePath, options);
        } else if (item.isFile()) {
            fileUploads.push(fastPut(sftp, itemLocalPath, itemRemotePath));
        } else {
            console.log(`uploadDirectory: File ignored: ${item.name} not a regular file`);
        }

        await Promise.all(fileUploads);
    }

    return `${localPath} uploaded to ${localPath}`;
}
