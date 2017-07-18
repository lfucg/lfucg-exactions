#
# Cookbook Name:: chef-lfucg-exactions
# Recipe:: code
#
# Copyright (C) 2017 Kelly Wright
#
# All rights reserved - Do Not Redistribute
#

app = search("aws_opsworks_app").first
# git_ssh_key = "#{app['app_source']['ssh_key']}"
git_url = "#{app['app_source']['url']}"
git_revision = "#{app['app_source']['revision']}" ? "#{app['app_source']['revision']}" : "master"

# Put the file on the node
# file "/home/ubuntu/.ssh/id_rsa" do
#   owner "ubuntu"
#   mode 0400
#   content "#{git_ssh_key}"
# end

git "/home/ubuntu/lfucg-exactions" do
  repository "#{git_url}"
  reference "#{git_revision}" # branch
  action :sync
  user "ubuntu"
  group "ubuntu"
end

