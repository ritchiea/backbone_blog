require 'mongo'

db = Connection.new.db('learning-mongo')
notes = db.collection('notes')

our_note = {
  :text => 'remember the milk',
  :remindInterval => 'weekly'}

note_id = notes.insert(our_note)