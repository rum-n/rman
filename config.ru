require 'middleman-core/load_paths'
::Middleman.setup_load_paths

require 'middleman-core'
require 'middleman-core/rack'

require 'fileutils'
FileUtils.mkdir('log') unless File.exist?('log')
::Middleman::Logger.singleton("log/#{ENV['RACK_ENV']}.log")

app = ::Middleman::Application.new

run ::Middleman::Rack.new(app).to_app

# require 'sendgrid-ruby'
# include SendGrid

# from = Email.new(email: 'test@example.com')
# subject = 'Hello World from the SendGrid Ruby Library!'
# to = Email.new(email: 'test@example.com')
# content = Content.new(type: 'text/plain', value: 'Hello, Email!')
# mail = Mail.new(from, subject, to, content)

# sg = SendGrid::API.new(api_key: ENV['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'])
# response = sg.client.mail._('send').post(request_body: mail.to_json)
# puts response.status_code
# puts response.body
# puts response.headers

# ActionMailer::Base.smtp_settings = {
#   :user_name => ENV['app57525483@heroku.com'],
#   :password => ENV['oouj9jsb5909'],
#   :domain => 'www.rmanev.com',
#   :address => 'smtp.sendgrid.net',
#   :port => 587,
#   :authentication => :plain,
#   :enable_starttls_auto => true

# require './mailer'
# run Sinatra::Application