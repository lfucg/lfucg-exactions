#
# Cookbook Name:: chef-lfucg-exactions
# Recipe:: system
#
# Copyright (C) 2017 Kelly Wright
#
# All rights reserved - Do Not Redistribute
#

include_recipe 'apt'
include_recipe 'poise-python'

if Dir.exists? "/home/vagrant"
    user = "vagrant"
else
  user = "ubuntu"
end
virtualenv = "/home/#{user}/env"

package "my packages" do
  package_name [
    # Django
    "git",
    "libpq-dev",
    "libffi-dev",
    "libjpeg-dev",
  ]
  action :install
end

python_runtime '3'

# NOTE: This will fail with SSL errors if owner/group isn't specified
python_virtualenv "#{virtualenv}" do
    python '3'
    user user
    group user
    action :create
end

include_recipe "nodejs::npm"
execute "upgrade_npm" do
  command "sudo npm -g install npm@latest"
  action :run
end

cookbook_file "/home/#{user}/.ssh/config" do
  source 'config'
end