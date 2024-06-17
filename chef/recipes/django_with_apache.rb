#
# Cookbook Name:: chef-lfucg-exactions
# Recipe:: django_with_apache
#
# Copyright (C) 2017 Kelly Wright
#
# All rights reserved - Do Not Redistribute
#

virtualenv = "/home/ubuntu/env"

service "apache2" do
  action [ :restart ]
end

bash "collectstatic" do
  code "echo 'yes' | #{virtualenv}/bin/python manage.py collectstatic"
  cwd "/home/ubuntu/lfucg-exactions/lfucg-exactions/backend"
end

