require 'bundler/inline'

gemfile do
  source 'https://rubygems.org'
  gem 'highline'
end

require 'highline'
require 'yaml'

@story = YAML.load_file("adventure_story.yaml")
@cli = HighLine.new

def prompt_from_location(location)
  this_story = @story[location].dup
  prompt = this_story.delete("t")
  if this_story.empty?
    @cli.say "\n#{prompt}"
    return
  end

  menu = ""
  locations_by_option = {}
  this_story.each_with_index do |option, index|
    index += 1
    location, message = option
    locations_by_option[index] = location
    menu << "#{index}: #{message}\n"
  end
  choice = @cli.ask("\n#{prompt}\n\n#{menu}\n> ", Integer) { |q| q.in = locations_by_option.keys }
  location = locations_by_option[choice]
  # @cli.say("You chose #{choice}, which goes to location #{location}.")
  location
end

location = 0
loop do
  location = prompt_from_location location
  break unless location
end
