/*
 * Generated on 2014-12-28
 * generator-assemble v0.5.0
 * https://github.com/assemble/generator-assemble
 *
 * Copyright (c) 2014 Hariadi Hinta
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg : grunt.file.readJSON('package.json'),
    site: grunt.file.readYAML('src/data/site.yml'),
    navigation: grunt.file.readYAML('src/data/navigation.yml'),

    config: {
      src: 'src',
      dist: 'dist',
      temp: 'temp'
    },

    watch: {
      assemble: {
        files: ['<%= config.src %>/**/*.{md,hbs,yml,css}'],
        tasks: [
            'assemble', 
            'copy:assemble', 
            'replace:assemble'
        ]
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= config.dist %>/{,*/}*.html',
          '<%= config.dist %>/assets/{,*/}*.css',
          '<%= config.dist %>/assets/{,*/}*.js',
          '<%= config.dist %>/assets/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    connect: {
      options: {
        port: 9000,
        livereload: 35729,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          open: true,
          base: [
            '<%= config.dist %>'
          ]
        }
      }
    },

    assemble: {
      options: {
          collections: [{
            name: 'root',
          }, {
            name: 'error',
            sortby: 'posted',
            sortorder: 'descending'
          }, {
            name: 'blog',
            sortby: 'posted',
            sortorder: 'descending'
          }, {
            name: 'games',
            sortby: 'posted',
            sortorder: 'descending'
          }],
          assets: '<%= config.dist %>/assets',
          helpers: [
              'node_modules/handlebars-helpers/lib/helpers/*.js',
              '<%= config.src %>/helpers/helper-*.js'
          ],
          layout: 'default.hbs',
          layoutdir: '<%= config.src %>/layouts/',
          data: '<%= config.src %>/data/*.{json,yml}',
          partials: '<%= config.src %>/partials/*.hbs'
      },
      posts: {
        files: [{
          cwd: '<%= config.src %>/root/',
          dest: '<%= config.temp %>/',
          expand: true,
          src: '**/*.hbs'
        }, {
          cwd: '<%= config.src %>/error/',
          dest: '<%= config.temp %>/',
          expand: true,
          src: '**/*.hbs'
        }, {
          cwd: '<%= config.src %>/blog/',
          dest: '<%= config.temp %>/blog',
          expand: true,
          src: '**/*.hbs'
        }, {
          cwd: '<%= config.src %>/games/',
          dest: '<%= config.temp %>/games/',
          expand: true,
          src: '**/*.hbs'
        }]
      },
      blog: {
        options: {
          layout: 'blog.hbs'
        },
        files: [{
          cwd: '<%= config.src %>/blog/',
          dest: '<%= config.temp %>/blog/',
          expand: true,
          src: '**/*.hbs'
        }]
      },
      games: {
        options: {
          layout: 'games.hbs'
        },
        files: [{
          cwd: '<%= config.src %>/games/',
          dest: '<%= config.temp %>/games/',
          expand: true,
          src: '**/*.hbs'
        }]
      }
    },

    copy: {
      assemble: {
        expand: true, 
        cwd: '<%= config.temp %>', 
        src: ['**/*.html'], 
        dest: '<%= config.dist %>', 
        rename: function(dest, src) {
            var filename = src.replace(/^.*[\\\/]/, '');
            var withoutExt = filename.replace(/.html/, '' );
            if ( filename === "index.html" || !isNaN(parseInt(withoutExt)) ) {
                // Homepage and error pages stay in the root.
                return dest + "/" + filename;
            } else {
                // All other files go into a folder (named after the file) as index.html
                return dest + "/" + src.replace(/.html/, "/index.html");
            }
        }
      },
      bootstrap: {
        expand: true,
        cwd: 'bower_components/bootstrap/dist/',
        src: '**',
        dest: '<%= config.dist %>/assets/'
      },
      fontawesome: {
        expand: true,
        cwd: 'bower_components/components-font-awesome/',
        src: '{css,fonts}/**',
        dest: '<%= config.dist %>/assets/'
      },
      srcassets: {
        expand: true,
        cwd: 'src/assets/',
        src: '**',
        dest: '<%= config.dist %>/assets/'
      },
      meta: {
        dot: true,
        expand: true,
        cwd: 'src/meta/',
        src: '**',
        dest: '<%= config.dist %>/'
      }
    },

    replace: {
      assemble: {
        options: {
          patterns: [
            {
              match: /href="\/..*dist/g,
              replacement: 'href="',
            },
            {
              match: /src="\/..*dist/g,
              replacement: 'src="',
            }
          ]
        },
        files: [
          {
            expand: true, 
            cwd: '<%= config.dist %>',
            src: [
                '**/*.html'
            ],
            dest: '<%= config.dist %>'
          }
        ]
        ,
      }
    },

    // Before generating any new files,
    // remove any previously-created files.
    clean: [
      '<%= config.dist %>/**/*.{html,xml}', 
      '<%= config.temp %>/**/*.{html,xml}' 
    ],

    'gh-pages': {
      website: {
        options: {
          base: 'dist/',
          branch: 'master',
          message: 'Grunt deploy <%= grunt.template.today() %>'
        },
        src: ['**']
      }
    }

  });

  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-gh-pages');
  grunt.loadNpmTasks('grunt-replace');

  grunt.registerTask('build', [
    'clean',
    'assemble',
    'copy',
    'replace'
  ]);
  
  grunt.registerTask('server', [
    'build',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);

  grunt.registerTask('deploy', [
    'default',
    'gh-pages'
  ]);


};
