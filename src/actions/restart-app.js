/**
 * @param {import('ssh2').Client} connect SSH client
 * @param {string} appName App name
 * @returns {Promise.<void>}
 */
async function restartApp(connect, appName) {
    return new Promise((resolve, reject) => {
        connect.exec(`pm2 restart ${appName} -s`, {}, (err, stream) => {
            if (err) {
                reject(err);
                return;
            }

            stream.on('close', (code, signal) => {
                if (Number(code) !== 0) {
                    reject();
                }
                resolve();
            }).on('data', data => {
                console.log(data);
            });
        });
    });
}

module.exports = restartApp;
