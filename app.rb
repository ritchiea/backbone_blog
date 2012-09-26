require 'rubygems'
require 'sinatra'
require 'mongo'
require 'json'

DB = Mongo::Connection.new.db("blogdb", :pool_size => 5, :timeout => 5)

get '/' do
  # homepage
end

get '/posts/:id' do
  # single post
end

get '/admin' do
  # cms
end

post '/admin' do
  # save post
end

get '/api/:thing' do
  DB.collection(params[:thing]).find.to_a.map{|t| from_bson_id(t)}.to_json
end

get '/api/:thing/:id' do
  from_bson_id(DB.collection(params[:thing]).find_one(to_bson_id(params[:id]))).to_json
end

def to_bson_id(id) 
  BSON::ObjectId.from_string(id) 
end

def from_bson_id(obj) 
  obj.merge({'_id' => obj['_id'].to_s}) 
end