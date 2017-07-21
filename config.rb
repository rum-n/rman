###
# Page options, layouts, aliases and proxies
###

# Per-page layout changes:
#
# With no layout
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false

# With alternative layout
page "/race_results/*", :layout => "race_results"
page "/sofia_marathon_2016"
page "/pirin_skyrun_2017"
page "/spokes_and_spikes_2017"
page "/plovdiv_marathon_2017"
page "/sofia_marathon_2015"

# Proxy pages (http://middlemanapp.com/basics/dynamic-pages/)
#proxy "/race_results.html", "/race_results.html"
#  which_fake_page: "Rendering a fake page with a local variable" }
activate :relative_assets
# General configuration
activate :sprockets

# Reload the browser automatically whenever files change
configure :development do
  activate :livereload
end

###
# Helpers
###
set :js_dir, 'javascripts'

set :css_dir, 'stylesheets'
# Methods defined in the helpers block are available in templates
# helpers do
#   def some_helper
#     "Helping"
#   end
# end

# Build-specific configuration
configure :build do
  # Minify CSS on build
  # activate :minify_css

  # Minify Javascript on build
  # activate :minify_javascript
end

