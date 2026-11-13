// GITHUB_REPOSITORY makes edit/feedback links follow the repository used by CI.
export const repository = process.env.GITHUB_REPOSITORY || '78/xiaozhi-docs'
export const branch = 'main'
export const hostname = 'https://docs.xiaozhi.me'
export const repositoryUrl = `https://github.com/${repository}`
