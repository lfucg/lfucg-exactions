#
# Cookbook Name:: chef-lfucg-exactions
# Recipe:: system
#
# Copyright (C) 2017 Kelly Wright
#
# All rights reserved - Do Not Redistribute
#

# Update user depending on environment
if Dir.exists? "/home/vagrant"
  user = "vagrant"
else
  user = "ubuntu"
end

virtualenv = "/home/#{user}/env"

# Install git
package "git"

# Install python related packages
# Docs: https://launchpad.net/~deadsnakes/+archive/ubuntu/ppa
apt_repository 'deadsnakes' do
  uri 'ppa:deadsnakes'
end

include_recipe 'apt'

python_runtime '3.6' do
  options package_name: 'python3.6'
end

python_package "virtualenv" do
  action :install
end

# NOTE: This will fail with SSL errors if owner/group isn't specified
python_virtualenv "#{virtualenv}" do
    python "/usr/bin/python3.6"
    user "#{user}"
    group "#{user}"
    action :create
end
