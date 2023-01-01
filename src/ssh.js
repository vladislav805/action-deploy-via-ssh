const ssh2 = require('ssh2');

/**
 * @param {ssh2.ConnectConfig} config
 * @returns {Promise.<ssh2.Client>}
 */
function ssh(config) {
    return new Promise((resolve, reject) => {
        const connect = new ssh2.Client()
            .on('error', err => {
                console.error(err);
                reject(err);
            })
            .on('ready', () => resolve(connect))
            .on('connect', () => console.log('connected'))
            .on('banner', () => console.log('banner'))
            .on('greeting', gr => console.log('greeting', gr))
            .connect(config);
    });
}

module.exports = ssh;
