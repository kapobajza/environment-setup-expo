source 'https://rubygems.org'

rootDir = `git rev-parse --show-toplevel`.strip
rubyVersion = File.read("#{rootDir}/.ruby-version").strip

# You may use http://rbenv.org/ or https://rvm.io/ to install and use this version
ruby rubyVersion

gem 'cocoapods', '1.13.0'
gem 'fastlane'

plugins_path = File.join(File.dirname(__FILE__), 'fastlane', 'Pluginfile')
eval_gemfile(plugins_path) if File.exist?(plugins_path)