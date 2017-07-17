#
# Cookbook Name:: chef-lfucg-exactions

include_recipe 'python'
include_recipe "python::pip"
include_recipe 'poise-python'

if Dir.exists? "/home/vagrant"
    user = "vagrant"
else
  user = "ubuntu"
end
virtualenv = "/home/#{user}/env"

directory "/home/#{user}/media" do
  recursive true
  mode 0777
end

if Dir.exists? "/home/vagrant"
  cookbook_file "/home/#{user}/.ssh/id_rsa" do
    source 'id_rsa'
  end
end

python_virtualenv "#{virtualenv}"

pip_requirements "--exists-action w -r /home/#{user}/chef-lfucg-exactions/lfucg-exactions/lfucg-exactions/server/requirements.txt" do
    virtualenv "#{virtualenv}"
end

python_execute "/home/#{user}/chef-lfucg-exactions/lfucg-exactions/lfucg-exactions/server/manage.py migrate" do
  virtualenv "#{virtualenv}"
end

service "apache2" do
  ignore_failure true
  action [ :restart ]
  notifies :run, 'bash[collectstatic]', :immediately
end

bash "collectstatic" do
  code "echo 'yes' | #{virtualenv}/bin/python manage.py collectstatic"
  cwd "/home/#{user}/chef-lfucg-exactions/lfucg-exactions/lfucg-exactions/server/manage.py"
  only_if { ::Dir.exists?("/home/#{user}/chef-lfucg-exactions/lfucg-exactions/lfucg-exactions/server/manage.py") }
  action :nothing
end