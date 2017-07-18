#
# Cookbook Name:: chef-lfucg-exactions
# Recipe:: system
#
# Copyright (C) 2017 Kelly Wright
#
# All rights reserved - Do Not Redistribute
#

include_recipe 'apt'
include_recipe 'python'
include_recipe "python::pip"

python_pip "virtualenv" do
  action :install
end

virtualenv = "/home/ubuntu/env"

package "my packages" do
  package_name [
    # Django
    "git",
    "python3-dev",
    "libpq-dev",
    "libffi-dev",
    "libjpeg-dev",
  ]
  action :install
end

# python_runtime '3'

# NOTE: This will fail with SSL errors if owner/group isn't specified
python_virtualenv "#{virtualenv}" do
    interpreter '/usr/bin/python3'
    owner 'ubuntu'
    group 'ubuntu'
    action :create
end

include_recipe "nodejs::npm"

# cookbook_file "/home/ubuntu/.ssh/config" do
#   source 'config'
# end