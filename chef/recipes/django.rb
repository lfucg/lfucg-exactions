#
# Cookbook Name:: chef-lfucg-exactions
# Recipe:: system
#
# Copyright (C) 2017 Kelly Wright
#
# All rights reserved - Do Not Redistribute
#

include_recipe 'python'
include_recipe "python::pip"

app = node.attribute?('vagrant') ? node['vagrant']['app'] : search('aws_opsworks_app').first
config = app['environment']

virtualenv = "/home/ubuntu/env"

directory "/home/ubuntu/media" do
  recursive true
  mode 0777
end

template "/home/ubuntu/lfucg-exactions/lfucg-exactions/server/settings/local.py" do
  source "/home/ubuntu/lfucg-exactions/lfucg-exactions/server/settings/local-dist.py"
  local true
  mode 0755
  variables( :config => config )
end

python_pip "--exists-action w -r /home/ubuntu/lfucg-exactions/lfucg-exactions/server/requirements.txt" do
    virtualenv "#{virtualenv}"
    user 'ubuntu'
    group 'ubuntu'
end

bash "migrate" do
  user "ubuntu"
  code "#{virtualenv}/bin/python manage.py migrate --noinput"
  cwd "/home/ubuntu/lfucg-exactions/lfucg-exactions/server"
end

if node.attribute?('vagrant')
  bash "loaddata" do
    code "#{virtualenv}/bin/python manage.py loaddata initial_data"
    cwd "/home/ubuntu/lfucg-exactions/lfucg-exactions/server"
  end
end
