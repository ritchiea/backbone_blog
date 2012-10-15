require 'rubygems'
require 'sinatra'
require 'mongo'
require 'json'

DB = Mongo::Connection.new.db("blogdb", :pool_size => 5, :timeout => 5)

get '/' do
  # homepage
end

get '/admin' do
  # cms
  haml :admin, :attr_wrapper => '"', :locals => {:title => 'Backbone.js Blog CMS by Andrew Ritchie'}
end

get '/admin/api/:thing' do
  DB.collection(params[:thing]).find.to_a.map{|t| from_bson_id(t)}.to_json
end

get '/admin/api/:thing/:id' do
  from_bson_id(DB.collection(params[:thing]).find_one(to_bson_id(params[:id]))).to_json
end

post '/admin/api/:thing' do
  json = JSON.parse(request.body.read.to_s)
  oid = DB.collection(params[:thing]).insert(json)
  "{\"_id\": \"#{oid.to_s}\"}"
end

delete '/admin/api/:thing/:id' do
  DB.collection(params[:thing]).remove('_id' => to_bson_id(params[:id]))
end

put '/admin/api/:thing/:id' do
  json = JSON.parse(request.body.read.to_s)
  json.each do |k,v|
    DB.collection(params[:thing]).update({'_id' => to_bson_id(params[:id])},{'$set' =>{k => v}} )
  end
end

def to_bson_id(id) 
  BSON::ObjectId.from_string(id) 
end

def from_bson_id(obj) 
  obj.merge({'_id' => obj['_id'].to_s}) 
end
