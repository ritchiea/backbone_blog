require 'sinatra'

enable :sessions

get '/' do

  "Hello world! Is it me you're looking for?"

  session['visitCounter'] ||= 0
  session['visitCounter'] += 1
  "This page has been accessed #{session['visitCounter']} times"
  
end