#
# Cookbook Name:: chef-lfucg-exactions
# Recipe:: system
#
# Copyright (C) 2017 Kelly Wright
#
# All rights reserved - Do Not Redistribute
#

include_recipe "nodejs::npm"

# if Dir.exists? "/home/ubuntu"
#     directory "/home/ubuntu/lfucg-exactions/lfucg-exactions/client/node_modules" do
#       owner 'ubuntu'
#       group 'ubuntu'
#       only_if { node['symlink_npm'] }
#     end

#     link "/home/ubuntu/lfucg-exactions/lfucg-exactions/client/node_modules" do
#       owner 'ubuntu'
#       group 'ubuntu'
#       to "/home/ubuntu/lfucg-exactions/lfucg-exactions/client/node_modules"
#       only_if { node['symlink_npm'] }
#     end
# end

nodejs_npm "npm-install" do
  path "/home/ubuntu/lfucg-exactions/lfucg-exactions/client"
  user 'ubuntu'
  json true
end

execute "gulp-build" do
  cwd "/home/ubuntu/lfucg-exactions/lfucg-exactions/client"
  command "npm build"
  environment "HOME" => "/home/ubuntu"
  user 'ubuntu'
  group 'ubuntu'
  action :run
end
