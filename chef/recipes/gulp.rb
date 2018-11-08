#
# Cookbook Name:: chef-lfucg-exactions
# Recipe:: system
#
# Copyright (C) 2017 Kelly Wright
#
# All rights reserved - Do Not Redistribute
#

include_recipe "nodejs::npm"

if Dir.exists? "/home/vagrant"
  user = "vagrant"
else
  user = "ubuntu"
end

# Some host OSs don't let npm create symlinks in the shared directory. This
# stores our node_modules on the VM and simply creates a mystery symlink file
# in the shared directory which is gitignored
# directory "/home/ubuntu/node_modules" do
#   owner "ubuntu"
#   group "ubuntu"
#   recursive true
# end
# link "/home/ubuntu/lfucg-exactions/lfucg-exactions/client/node_modules" do
#   owner "ubuntu"
#   group "ubuntu"
#   to "/home/ubuntu/node_modules"
# end

# Install package.json dependencies
nodejs_npm "npm-install" do
  path "/home/#{user}/lfucg-exactions/lfucg-exactions/client"
  user "#{user}"
  json true
end

# Build JS and CSS dependencies
execute "gulp-build" do
  cwd "/home/#{user}/lfucg-exactions/lfucg-exactions/client"
  command "npm run build"
  environment "HOME" => "/home/#{user}"
  user "#{user}"
  group "#{user}"
  action :run
end
