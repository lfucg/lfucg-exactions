#
# Cookbook Name:: chef-lfucg-exactions
# Recipe:: system
#
# Copyright (C) 2017 Kelly Wright
#
# All rights reserved - Do Not Redistribute
#

include_recipe "apache2"
include_recipe 'python'
include_recipe "python::pip"

package "apache2-dev"

app = node.attribute?('vagrant') ? node['vagrant']['app'] : search('aws_opsworks_app').first
domain = app['domains'][0]

virtualenv = "/home/ubuntu/env"

python_pip "mod_wsgi" do
  version "4.5.2"
  virtualenv "#{virtualenv}"
end

bash "install_wsgi" do
  code "#{virtualenv}/bin/mod_wsgi-express install-module"
end

apache_module "wsgi_express" do
  identifier "wsgi_module"
  filename "mod_wsgi-py27.so"
end

web_app 'lfucg-exactions' do
  template "vhost.conf.erb"
  server_name "#{domain}"
  user "ubuntu"
  docroot "/home/ubuntu/lfucg-exactions"
  project "lfucg-exactions"
  python "3.5.2"
  admin "kelly@apaxsoftware.com"
end

apache_site 'default' do
  enable false
end

service "apache2" do
    action [ :restart ]
end
