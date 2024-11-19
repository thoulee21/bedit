module.exports = {
    apps: [
        {
            name: 'bedit',
            script: 'yarn',
            args: 'start',
            pre_start: 'yarn build',
            interpreter: '/bin/bash',
            env: {
                NODE_ENV: 'production',
                PORT: 80,
            },
        },
    ],
};