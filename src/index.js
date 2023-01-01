const core = require('@actions/core');
const restartApp = require('./actions/restart-app');
const upload = require('./actions/upload');
const ssh = require('./ssh');

/**
 * @param {ActionOptions} options
 */
async function main(options) {
    /** @type {import('ssh2').Client} */
    let connect;

    try {
        connect = await ssh({
            host: options.remoteAddress,
            port: options.remotePort || 22,
            username: options.sshUser,
            privateKey: options.sshKey,
        });

        await upload(connect, options.distPath, options.remotePath);

        if (options.appName) {
            await restartApp(connect, options.appName);
        }
    } catch (err) {
        if (connect) {
            connect.end();
        }

        throw err;
    }
}

try {
    main({
        distPath: core.getInput('dist-path', { required: true, trimWhitespace: true }),
        sshKey: core.getInput('ssh-key', { required: true, trimWhitespace: true }),
        sshUser: core.getInput('ssh-user', { required: true, trimWhitespace: true }),
        remoteAddress: core.getInput('remote-address', { required: true, trimWhitespace: true }),
        remotePort: Number(core.getInput('remote-port', { trimWhitespace: true, trimWhitespace: true })),
        remotePath: core.getInput('remote-path', { required: true, trimWhitespace: true }),
        appName: core.getInput('app-name', { trimWhitespace: true }),
    });
} catch (error) {
    core.setFailed(error.message);
}

/**
 * @typedef {{
 *     distPath: string,
 *     sshKey: string,
 *     sshUser: string,
 *     remoteAddress: string,
 *     remotePort?: number,
 *     remotePath: string,
 *     appName?: string
 * }} ActionOptions
 */
