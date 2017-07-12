'use strict';

//basic configuration object used by gulp tasks

module.exports = {
  port: 3001,
  uiPort: 3001,
  tmp: 'client_build/tmp',
  dist: 'client_build/dist',
  base: 'client',
  tpl: ['src/**/*.tpl.html', 'bower_components/ui.bootstrap/template/typeahead/*.tpl.html'],
  less: 'src/less/**/*.less',
  js: [
    'src/**/*.js',
    '!src/vendor/**/*.js',
    '!src/assets/js/**/*.js'
  ],
  index: './src/index.html',
  assets: 'src/assets/**',
  fonts: 'bower_components/bootstrap/fonts/*',
  images: 'src/assets/images/**/*',
  banner: ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''
  ].join('\n')
};
