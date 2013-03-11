# encoding: utf-8

require 'bundler'
Bundler.require

require 'digest/md5'
require 'rake/clean'
require 'ostruct'

begin
  config_file = File.expand_path('config.yml', File.dirname(__FILE__))
  Config = OpenStruct.new(YAML.load_file(config_file))
end

# =============================================================================
# Lib

class Renderer < Redcarpet::Render::HTML
  def block_code(code, language)
    language ||= 'ruby'

    if language.start_with?('#')
      processor = language.slice(1..-1)
      send(processor, code) if respond_to?(processor)
    else
      Albino.colorize(code, language).gsub("\n", "&#10;")
    end
  end

  def hrule
    "\n<hr />\n"
  end

  protected

  def haml(source)
    Haml::Engine.new(source, HAML_OPTIONS).render
  end
end

MARKDOWN_OPTIONS = {
  autolink: true,
  space_after_headers: true,
  fenced_code_blocks: true
}
Markdown = Redcarpet::Markdown.new(Renderer, MARKDOWN_OPTIONS)

template_file = File.expand_path('template.haml', File.dirname(__FILE__))
HAML_OPTIONS = {
  attr_wrapper: '"'
}
Template = Haml::Engine.new(File.read(template_file), HAML_OPTIONS)

meta_file = File.expand_path('meta.yml', File.dirname(__FILE__))
Meta = YAML.load_file(meta_file) || {}

# =============================================================================
# Files

MKDN = FileList['src/**/*.mkd']
HTML = MKDN.pathmap('%{^src,build}d/%n.html')

MKDN_DIRS = FileList['src/**/*'].select { |fn| File.directory?(fn) }
HTML_DIRS = MKDN_DIRS.pathmap('%{^src,build}p')
MEDIA_DIR = 'build/media'

html_to_mkdn = lambda { |p| p.pathmap('%{^build,src}d/%n.mkd') }

# =============================================================================
# Tasks

CLOBBER.include(HTML)
CLOBBER.include(HTML_DIRS)
CLOBBER.include('build/media')

HTML_DIRS.each { |dir| directory dir }

rule '.html' => [html_to_mkdn, template_file, meta_file, __FILE__] + HTML_DIRS do |task|
  puts "compile #{task.name}"

  source = File.read(task.source)
  html   = Markdown.render(source)
  url    = task.name.sub('build/', '')
  meta   = Meta[url] || {}

  meta.update(url: File.join(Config.domain, url))

  document = Template.render(Object.new, meta: meta) { html }

  File.open(task.name, 'w+') do |io|
    io.write(document)
  end
end

directory MEDIA_DIR

desc "Met à jour le dossier media"
task :update_media => MEDIA_DIR do
  sh "cp -urv media/ #{MEDIA_DIR.pathmap('%d')}"
end

desc "Liste les sources et documents produits"
task :env do
  print_file_list = lambda { |fl| puts fl.map { |p| "  #{p}" }.join("\n") }
  puts "Sources:"
  print_file_list[MKDN]
  puts "Documents:"
  print_file_list[HTML]
end

desc "Deploie sur le serveur"
task :deploy do
  system "rsync -e ssh -avz --delete-after build/ #{Config.deploy_to}"
end

task :default => [:update_media, template_file, meta_file] + HTML
