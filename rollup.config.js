const fs = require('fs')
const path = require('path')
const ts = require('rollup-plugin-typescript2')
const replace = require('@rollup/plugin-replace')
const alias = require('@rollup/plugin-alias')
const postcss = require('rollup-plugin-postcss');

if (!process.env.TARGET) {
    throw new Error('TARGET package must be specified via --environment flag.')
}

//packages目录
const packagesDir = path.resolve(__dirname, 'packages')
//哪个是输出的库文件
const packageDir = path.resolve(packagesDir, process.env.TARGET)
//获取库文件的完整路径
const name = path.basename(packageDir)
//计算库文件下的路径
const resolve = p => path.resolve(packageDir, p)
// 库文件下的package.json
const pkg = require(resolve(`package.json`))
// 库文件下的编译参数
const packageOptions = pkg.buildOptions || {}

// 动态构建别名,读取库文件下的所有库的别名
const aliasOptions = { resolve: ['.ts'] }
fs.readdirSync(packagesDir).forEach(dir => {
    if (fs.statSync(path.resolve(packagesDir, dir)).isDirectory()) {
        aliasOptions[`@noderun/${dir}`] = path.resolve(packagesDir, `${dir}/src/index`)
    }
})

//用于别名重建的rollup插件
const aliasPlugin = alias(aliasOptions)

// 确保ts检查每次构建时只检查一次
let hasTSChecked = false

//配置，库包下的输出路径
const configs = {
    esm: {
        file: resolve(`dist/${name}.esm.js`),
        format: `es`
    },
    cjs: {
        file: resolve(`dist/${name}.cjs.js`),
        format: `cjs`
    },
    umd: {
        file: resolve(`dist/${name}.umd.js`),
        format: `umd`
    },
    'esm-browser': {
        file: resolve(`dist/${name}.esm-browser.js`),
        format: `es`
    }
}

//默认格式
const defaultFormats = ['esm', 'cjs']
//内联格式
const inlineFromats = process.env.FORMATS && process.env.FORMATS.split(',')
//库文件格式
const packageFormats = inlineFromats || packageOptions.formats || defaultFormats
//库的配置文件创造
const packageConfigs = packageFormats.map(format => createConfig(configs[format]))

if (process.env.NODE_ENV === 'production') {
    packageFormats.forEach(format => {
        if (format === 'cjs') {
            packageConfigs.push(createProductionConfig(format))
        }
        if (format === 'umd' || format === 'esm-browser') {
            packageConfigs.push(createMinifiedConfig(format))
        }
    })
}

module.exports = packageConfigs

function createConfig(output, plugins = []) {
    const isProductionBuild = /\.prod\.js$/.test(output.file)
    const isUMDBuild = /\.umd(\.prod)?\.js$/.test(output.file)
    const isBunlderESMBuild = /\.esm\.js$/.test(output.file)
    const isBrowserESMBuild = /esm-browser(\.prod)?\.js$/.test(output.file)

    if (isUMDBuild) {
        output.name = packageOptions.name
    }

    const tsPlugin = ts({
        check: process.env.NODE_ENV === 'production' && !hasTSChecked,
        tsconfig: path.resolve(__dirname, 'tsconfig.json'),
        cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache'),
        tsconfigOverride: {
            compilerOptions: {
                declaration: process.env.NODE_ENV === 'production' && !hasTSChecked
            }
        }
    })
    // we only need to check TS and generate declarations once for each build.
    // it also seems to run into weird issues when checking multiple times
    // during a single build.
    hasTSChecked = true

    return {
        input: resolve(`src/index.ts`),
        // UMD and Browser ESM builds inlines everything so that they can be
        // used alone.
        external: isUMDBuild || isBrowserESMBuild
            ? []
            : Object.keys(aliasOptions),
        plugins: [
            postcss({
                plugins: [],
                extract: 'style.css',
                extensions: [ '.css', '.scss'],
              }),
            tsPlugin,
            aliasPlugin,
            createReplacePlugin(isProductionBuild, isBunlderESMBuild),
            ...plugins
        ],
        output,
        onwarn: (msg, warn) => {
            if (!/Circular/.test(msg)) {
                warn(msg)
            }
        }
    }
}

function createReplacePlugin(isProduction, isBunlderESMBuild) {
    return replace({
        __DEV__: isBunlderESMBuild
            // preserve to be handled by bundlers
            ? `process.env.NODE_ENV !== 'production'`
            // hard coded dev/prod builds
            : !isProduction
    })
}

function createProductionConfig(format) {
    return createConfig({
        file: resolve(`dist/${name}.${format}.prod.js`),
        format: /^esm/.test(format) ? 'es' : format
    })
}

function createMinifiedConfig(format) {
    const { terser } = require('rollup-plugin-terser')
    const isESM = /^esm/.test(format)
    return createConfig(
        {
            file: resolve(`dist/${name}.${format}.prod.js`),
            format: isESM ? 'es' : format
        },
        [
            terser({
                module: isESM
            })
        ]
    )
}
