// import resolve from 'rollup-plugin-node-resolve';
// import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'
import postcss from 'rollup-plugin-postcss'

const libraryName = 'calert' // Change with your library's name

function sass() {
  return postcss({
    minimize: true,
    autoModules: true,
  })
}
const banner = `/*!
 * ${pkg.name}
 * ${pkg.description}
 *
 * @version v${pkg.version}
 * @author ${pkg.author}
 * @license ${pkg.license}
 */`

export default (commandLineArgs) => {
  const configs = [
    // UMD Development
    {
      input: 'src/index.js',
      output: {
        banner,
        name: libraryName,
        file: `dist/${libraryName}.umd.js`,
        format: 'umd',
      },
      plugins: [sass()],
    },

    // CommonJS (for Node) build
  ]

  if (commandLineArgs.environment === 'BUILD:production') {
    // UMD Production
    configs.push({
      input: 'src/index.js',
      output: {
        banner,
        name: libraryName,
        file: `dist/${libraryName}.umd.min.js`,
        format: 'umd',
      },
      plugins: [
        // Uncomment the following 2 lines if your library has external dependencies
        // resolve(), // teach Rollup how to find external modules
        // commonjs(), // so Rollup can convert external modules to an ES module
        sass(),

        babel({
          exclude: ['node_modules/**'],
        }),
        terser({
          output: {
            comments: /^!/,
          },
        }),
      ],
    })
    // unbabel version of UMD
    configs.push({
      input: 'src/index.js',
      output: {
        name: libraryName,
        file: `dist/${libraryName}.unbabel.min.js`,
        format: 'umd',
      },
      plugins: [
        sass(),
        terser({
          output: {
            comments: /^!/,
          },
        }),
      ],
    })

    // Common JS
    configs.push({
      input: 'src/index.js',
      output: {
        banner,
        file: pkg.main,
        format: 'cjs',
        exports: 'auto',
      },
      plugins: [
        sass(),
        babel({
          exclude: ['node_modules/**'],
        }),
      ],
    })
    configs.push({
      input: 'src/index.js',
      output: {
        banner,
        file: pkg.module,
        format: 'esm',
        exports: 'auto',
      },
      plugins: [
        sass(),
        babel({
          exclude: ['node_modules/**'],
        }),
      ],
    })
  }

  return configs
}
