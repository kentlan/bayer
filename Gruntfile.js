module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            my_target: {
                files: {
                    'code/main.min.js': ['code/main.js']
                }
            }
        },
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: [

                    'code/js/script.js',
                    '_framework/lib/agnitio.js',
                    'viewer/js/monitor.js',
                    'viewer/js/pdf.js',
                    'viewer/js/sendmail.js',
                    '_framework/lib/touchy.js',
                    '_framework/lib/draggy.js',
                    '_framework/lib/util.js',
                    '_framework/core.js',
                    'code/js/expandnative.js',
                    'code/js/point.js',
                    'modules/analytics/analytics.js',
                    'modules/resize/resize.js',
                    'modules/data/Data.js',
                    'modules/menu/menu.js',
                    'modules/loader/loader.js',
                    'modules/slide-popup/slide-popup.js',
                    'modules/localisation/localisation.js',
                    'modules/slideinmenu/slideinmenu.js',
                    'modules/glossary/glossary.js',
                    'code/js/app.slide.s0.js',
                    'code/js/app.slide.s1_1.js',
                    'code/js/app.slide.s1_2.js',
                    'code/js/app.slide.s1_3.js',
                    'code/js/app.slide.s1_4.js',
                    'code/js/app.slide.s1_5.js',
                    'code/js/app.slide.s1_6.js',
                    'code/js/app.slide.s1_7.js',
                    'code/js/app.slide.s2_1.js',
                    'code/js/app.slide.s2_2.js',
                    'code/js/app.slide.s2_3.js',
                    'code/js/app.slide.s2_4.js',
                    'code/js/app.slide.s2_5.js',
                    'code/js/app.slide.s2_6.js',
                    'code/js/app.slide.s2_7.js',
                    'code/js/app.slide.s3_1.js',
                    'code/js/app.slide.s3_2.js',
                    'code/js/app.slide.s3_3.js',
                    'code/js/app.slide.s3_4.js',
                    'code/js/app.slide.s3_5.js',
                    'code/js/app.slide.s4_1.js',
                    'code/js/app.slide.s4_2.js',
                    'code/js/app.slide.s4_3.js',
                    'code/js/app.slide.s4_4.js',
                    'code/js/app.slide.s4_5.js',
                    'code/js/app.slide.s4_6.js',
                    'code/js/app.slide.s4_7.js',
                    'code/js/app.slide.s5_1.js',
                    'code/js/app.slide.s5_2.js',
                    'code/js/app.slide.s5_3.js',
                    'code/js/app.slide.s5_4.js',
                    'code/js/app.slide.s5_5.js',
                    'code/js/app.slide.s5_6.js',
                    'code/js/app.slide.s5_7.js',
                    'code/js/app.slide.s6_1.js',
                    'code/js/app.slide.s6_2.js',
                    'code/js/app.slide.s6_3.js',
                    'code/js/app.slide.s6_4.js',
                    'code/js/app.slide.s6_5.js',
                    'code/js/app.slide.s8_1.js',
                    'code/js/app.slide.s8_2.js',
                    'code/js/app.slide.s9_1.js',
                    'setup.js'
                ],
                dest: 'code/main.js'
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Default task(s).
    grunt.registerTask('default', ['concat', 'uglify']);

};

/**
 * Created by Станислав on 14.08.2016.
 */
