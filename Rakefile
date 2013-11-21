# encoding: utf-8

require 'bundler'
Bundler.require

require 'digest/md5'
require 'rake/clean'
require 'ostruct'
require 'yaml'

require 'rouge/plugins/redcarpet'

begin
  config_file = File.expand_path('config.yml', File.dirname(__FILE__))
  Config = OpenStruct.new(YAML.load_file(config_file))
end

# =============================================================================
# Lib

class Renderer < Redcarpet::Render::HTML
  include Rouge::Plugins::Redcarpet

  def hrule
    "\n<hr />\n"
  end
end

MARKDOWN_OPTIONS = {
  autolink: true,
  space_after_headers: true,
  fenced_code_blocks: true
}
Markdown = Redcarpet::Markdown.new(Renderer, MARKDOWN_OPTIONS)

template_file = File.expand_path('templates/template.haml', File.dirname(__FILE__))
HAML_OPTIONS = {
  attr_wrapper: '"'
}
Template = Haml::Engine.new(File.read(template_file), HAML_OPTIONS)

# =============================================================================
# Files

MKDN = FileList['src/**/*.md']
HTML = MKDN.pathmap('%{^src,build}d/%n.html')

MKDN_DIRS = FileList['src/**/*'].select { |fn| File.directory?(fn) }
HTML_DIRS = MKDN_DIRS.pathmap('%{^src,build}p')

BUILD_DIR     = 'build/'
ASSETS_DIR    = 'static/'
ASSETS_SOURCE = FileList['static/**/*']
ASSETS_OUTPUT = ASSETS_SOURCE.pathmap('%{^static,build}p')

html_to_mkdn = lambda { |p| p.pathmap('%{^build,src}d/%n.md') }

# =============================================================================
# Tasks

CLOBBER.include(HTML)
CLOBBER.include(HTML_DIRS)
CLOBBER.include(ASSETS_OUTPUT)

HTML_DIRS.each { |dir| directory dir }

directory BUILD_DIR

rule '.html' => [html_to_mkdn, template_file, __FILE__] + HTML_DIRS do |task|
  puts "compile #{task.name}"

  content = File.read(task.source)
  header, source = content.split(/^---$/, 2)
  html   = Markdown.render(source)
  meta = OpenStruct.new(YAML.load(header))

  document = Template.render(Object.new, meta: meta) { html }

  File.open(task.name, 'w+') do |io|
    io.write(document)
  end
end

desc "Update the media folder"
task :update_media => [ASSETS_DIR, BUILD_DIR] do
  sh "cp -urv static/* build/"
end

desc "List sources and outputs"
task :env do
  print_file_list = lambda { |fl| fl.each { |p| puts "  #{p}" } }
  puts "Sources:"
  print_file_list[MKDN]
  puts "Documents:"
  print_file_list[HTML]
  puts "Assets:"
  print_file_list[ASSETS_OUTPUT]
end

desc "Deploy using rsync"
task :deploy do
  system "rsync -e ssh -avz --delete-after build/ #{Config.deploy_to}"
end

task :default => [:update_media, 'templates'] + HTML
