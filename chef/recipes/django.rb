#
# Cookbook Name:: chef-lfucg-exactions
# Recipe:: system
#
# Copyright (C) 2017 Kelly Wright
#
# All rights reserved - Do Not Redistribute
#

include_recipe 'poise-python'

if Dir.exists? "/home/vagrant"
  user = "vagrant"
else
  user = "ubuntu"
end

app = node.attribute?('vagrant') ? node['vagrant']['app'] : search('aws_opsworks_app').first
config = app['environment']

virtualenv = "/home/#{user}/env"

directory "/home/#{user}/media" do
  recursive true
  mode 0777
end

template "/home/#{user}/lfucg-exactions/lfucg-exactions/server/server/settings/local.py" do
  source "/home/#{user}/lfucg-exactions/lfucg-exactions/server/server/settings/local-dist.py"
  local true
  mode 0755
  variables( :config => config )
end

pip_requirements "/home/#{user}/lfucg-exactions/lfucg-exactions/server/requirements.txt" do
  python "#{virtualenv}/bin/python"
end

bash "migrate" do
  user "#{user}"
  code "#{virtualenv}/bin/python manage.py migrate --noinput"
  cwd "/home/#{user}/lfucg-exactions/lfucg-exactions/server"
end

# if node.attribute?('vagrant')
#   bash "loaddata" do
#     code "#{virtualenv}/bin/python manage.py loaddata initial_data"
#     cwd "/home/#{user}/lfucg-exactions/lfucg-exactions/server"
#   end
# end
