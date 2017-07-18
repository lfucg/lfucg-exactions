#
# Cookbook Name:: chef-lfucg-exactions
# Recipe:: system
#
# Copyright (C) 2017 Kelly Wright
#
# All rights reserved - Do Not Redistribute
#

include_recipe "nodejs::npm"

nodejs_npm "npm-install" do
  path "/home/ubuntu/educator-certifications/client"
  user "ubuntu"
  json true
end

execute "gulp-webapp" do
  cwd "/home/ubuntu/educator-certifications/client"
  command "npm run build"
  environment "HOME" => "/home/ubuntu"
  user 'ubuntu'
  group 'ubuntu'
  action :run
end