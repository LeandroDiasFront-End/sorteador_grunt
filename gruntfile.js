//exportação e configiração do GRUNT:
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            development: {
                files: {
                    'dev/styles/main.css': 'src/styles/main.less'
                }
                //configuração do ambiente de produção:
            },
            production: {
                options: {
                    compress: true,
                },
                files: {
                    'dist/styles/main.min.css': 'src/styles/main.less'
                }
            }
        },

        //oberservação dos arquivos less:
        watch: {
            less: {
                files: ['src/styles/main.less'],
                tasks: ['less:development']
            },
            //Incluindo watch para observar o html ativando o replace:
            html: {
                files: ['src/index.html'],
                tasks: ['replace:dev']
            }
        },

        //Substituindo os  arquivos:
        replace: {
            dev: {
                options: {
                    patterns: [
                        {
                            match: 'ENDERECO_DO_CSS', //<- palavra chave que será substituida. 
                            replacement: './styles/main.css'//<- arquivo que substituirá a palavra chave
                        },

                        {
                            match: 'ENDERECO_DO_JS', //<- palavra chave que será substituida. 
                            replacement: '../src/scripts/main.js'//<- arquivo que substituirá a palavra chave
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['src/index.html'], //<- arquivo raiz (que será executada a substituição).
                        dest: 'dev/' //<- pasta destino que esse arquivo será enviado.
                    }
                ]
            },

            dist: {
                options: {
                    patterns: [
                        {
                            match: 'ENDERECO_DO_CSS', //<- palavra chave que será substituida. 
                            replacement: './styles/main.min.css'//<- arquivo que substituirá a palavra chave
                        },
                        {
                            match: 'ENDERECO_DO_JS', //<- palavra chave que será substituida. 
                            replacement: './scripts/main.min.js'//<- arquivo que substituirá a palavra chave
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['prebuild/index.html'], //<- arquivo raiz (que será executada a substituição).
                        dest: 'dist/' //<- pasta destino que esse arquivo será enviado.
                    }
                ]
            }
        },

        //minificando o html e substituindo o arquivos de produção ( 2 x 1 ):

        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },

                files: {
                    //1-minificação:
                    //2-substituição:
                    'prebuild/index.html': 'src/index.html'
                }
            }
        },

        //Limpando o arquivo temporário "prebuild":
        clean: ['prebuild'],
        //minificando arquivo js:
        uglify: {
            target: {
                files: {
                    'dist/scripts/main.min.js': 'src/scripts/main.js'
                }
            }
        }
    })


    //Carregamento dos plugins:
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    //Carregamento das tarefas:
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['less:production', 'htmlmin:dist', 'replace:dist', 'clean', 'uglify']);
}