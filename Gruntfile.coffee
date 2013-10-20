module.exports = (grunt)->
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')

    uglify:
      dest:
        files: 'zflick.min.js': ['zflick.js']

    concat:
      qflipper:
        src: ['license.min.js', 'zflick.min.js']
        dest: 'zflick.min.js'

    compass:
      dist:
        options:
          config: 'config.rb'

    watch:
      css:
        files: ['sass/**/*.scss']
        tasks: ['compass', 'uglify', 'concat']
        options:
          atBegin: true

  })

  grunt.loadNpmTasks('grunt-contrib-compass')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-watch')

  grunt.registerTask('default', ['compass', 'uglify', 'concat'])
