#
# Cookbook Name:: chef-lfucg-exactions
# Recipe:: data
#
# Copyright (C) 2017 Kelly Wright
#
# All rights reserved - Do Not Redistribute
#

package "postgresql"
package "postgresql-contrib"

config = node['vagrant']['app']['environment']

bash 'set postgres password' do
  code "sudo -u #{config['DATABASE_USER']} psql -U #{config['DATABASE_USER']} -d template1 -c \"ALTER USER #{config['DATABASE_USER']} WITH PASSWORD '#{config['DATABASE_PASSWORD']}';\""
end

bash 'createdb' do
  code "PGPASSWORD=#{config['DATABASE_PASSWORD']} psql -h #{config['DATABASE_HOST']} -U #{config['DATABASE_USER']} -p #{config['DATABASE_PORT']} -c 'CREATE DATABASE exactions'"
  ignore_failure true
end