require 'sinatra'
require 'pony'

post '/' do 
  configure_pony
  name = params[:name]
  sender_email = params[:email]
  message = params[:message]
  logger.error params.inspect
  begin
    Pony.mail(
      :from => "#{name}<#{sender_email}>",
      :to => 'manev.ru@gmail.com',
      :subject =>"#{name} has contacted you",
      :body => "#{message}",
    )
    redirect '/success'
  rescue
    @exception = $!
    erb :boom
  end
end

def configure_pony
  Pony.options = {
    :via => :smtp,
    :via_options => { 
      :address              => 'smtp.sendgrid.net', 
      :port                 => '587',  
      :user_name            => ENV['app57525483@heroku.com'], 
      :password             => ENV['oouj9jsb5909'], 
      :authentication       => :plain, 
      :enable_starttls_auto => true,
      :domain               => 'heroku.com'
    }    
  }
end



# before do
#     headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
#     headers['Access-Control-Allow-Origin']  = '*'
#     headers['Access-Control-Allow-Headers'] = 'accept, authorization, origin'
# end

# # whitelist should be a space separated list of URLs
# whitelist = ENV['rman.herokuapp.com'].split

# set :protection, :origin_whitelist => whitelist

# Pony.options = {
#   :via => :smtp,
#   :via_options => {
#     :address => 'smtp.sendgrid.net',
#     :port => '587',
#     :domain => 'heroku.com',
#     :user_name => ENV['app57525483@heroku.com'],
#     :password => ENV['oouj9jsb5909'],
#     :authentication => :plain,
#     :enable_starttls_auto => true
#   }
# }

# post '/' do
#   email = ""
#   params.each do |value|
#     email += "#{value[0]}: #{value[1]}\n"
#   end
#   puts email
#   Pony.mail(
#     :to => ENV['manev.ru@gmail.com'],
#     :from => 'noreply@example.com',
#     :subject => 'New Contact Form',
#     :body => email
#   )
# end