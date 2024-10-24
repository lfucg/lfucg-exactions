#
# Cookbook Name:: chef-lfucg-exactions
# Recipe:: system
#
# Copyright (C) 2017 Kelly Wright
#
# All rights reserved - Do Not Redistribute
#

include_recipe "apache2"

package "apache2-dev"

app = node.attribute?('vagrant') ? node['vagrant']['app'] : search('aws_opsworks_app').first
domain = app['domains'][0]
environment = app['environment']

virtualenv = "/home/ubuntu/env"
rewrite_engine = environment['REWRITE_ENGINE']

python_package "mod_wsgi" do
  version "4.5.2"
  virtualenv "#{virtualenv}"
end

bash "install_wsgi" do
  code "#{virtualenv}/bin/mod_wsgi-express install-module"
end

apache_module "wsgi_express" do
  identifier "wsgi_module"
  filename "mod_wsgi-py36.cpython-36m-x86_64-linux-gnu.so"
end

web_app 'lfucg-exactions' do
  template "vhost.conf.erb"
  server_name "#{domain}"
  rewrite_engine "#{rewrite_engine}"
  docroot "/home/ubuntu/lfucg-exactions/lfucg-exactions/backend"
  admin "kelly@apaxsoftware.com"
end

apache_site 'default' do
  enable false
end

service "apache2" do
    action [ :restart ]
end
