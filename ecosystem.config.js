module.exports = {
    apps: [
        {
            name: 'bedit',
            script: 'yarn',
            args: 'build && yarn start',
            interpreter: '/bin/bash', // 使用 Bash 解释器来运行命令
            env: {
                NODE_ENV: 'production',
                PORT: 80,
            },
        },
    ],
};