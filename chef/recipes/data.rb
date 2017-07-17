#
# Cookbook Name:: chef-lfucg-exactions
# Recipe:: data
#
# Copyright (C) 2017 Kelly Wright
#
# All rights reserved - Do Not Redistribute
#

execute "apt-get update" do
  action :nothing
end.run_action(:run)
include_recipe "postgresql::server"
include_recipe "database::postgresql"

config = node['vagrant']['app']['environment']

postgresql_connection_info = {
  :host => config['DATABASE_HOST'],
  :port => '5432',
  :username => config['DATABASE_USER'],
  :password => config['DATABASE_PASSWORD'],
}

postgresql_database 'exactions' do
  connection postgresql_connection_info
  action :create
end