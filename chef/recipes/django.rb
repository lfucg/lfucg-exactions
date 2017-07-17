#
# Cookbook Name:: chef-lfucg-exactions

include_recipe 'python'
include_recipe "python::pip"
include_recipe 'poise-python'

app = node.attribute?('vagrant') ? node['vagrant']['app'] : search('aws_opsworks_app').first
config = app['environment']

virtualenv = "/home/ubuntu/env"

directory "/home/ubuntu/media" do
  recursive true
  mode 0777
end

if Dir.exists? "/home/vagrant"
  cookbook_file "/home/ubuntu/.ssh/id_rsa" do
    source 'id_rsa'
  end
end

template "/home/ubuntu/lfucg-exactions/lfucg-exactions/server/server/settings/local.py" do
  source "/home/ubuntu/lfucg-exactions/lfucg-exactions/server/server/settings/local-dist.py"
  local true
  mode 0755
  variables( :config => config )
end

pip_requirements "--exists-action w -r /home/ubuntu/lfucg-exactions/lfucg-exactions/server/requirements.txt" do
    virtualenv "#{virtualenv}"
end

python_execute "/home/ubuntu/lfucg-exactions/lfucg-exactions/server/manage.py migrate" do
  virtualenv "#{virtualenv}"
end

service "apache2" do
  ignore_failure true
  action [ :restart ]
  notifies :run, 'bash[collectstatic]', :immediately
end

bash "collectstatic" do
  code "echo 'yes' | #{virtualenv}/bin/python manage.py collectstatic"
  cwd "/home/ubuntu/lfucg-exactions/lfucg-exactions/server/manage.py"
  only_if { ::Dir.exists?("/home/ubuntu/lfucg-exactions/lfucg-exactions/server/manage.py") }
  action :nothing
end

