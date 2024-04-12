/**
 * 执行 hexo s
 */
export const IS_DEV = !!~['s', 'server'].indexOf(hexo.env.cmd)

/**
 * 执行 hexo g
 */
export const IS_GENERATE = !!~['g', 'generate'].indexOf(hexo.env.cmd)
