require 'net/http'
require 'uri'

require 'bundler/setup'
Bundler.require(*[:default, ENV['RACK_ENV']].compact)

def response_with_md_at_path(path)
  begin
    conn = Faraday.new(url: 'https://qiita.com') do |f|
      f.use FaradayMiddleware::FollowRedirects
      f.adapter Faraday.default_adapter
    end
    res = conn.get(path)
  rescue
    return 500
  end
  if res.success?
    content_type 'text/plain'
    return res.body
  elsif res.status.to_s =~ /^[45]\d\d$/
    return res.status
  else
   return 500
  end
end

# GET / => index
get '/' do
  send_file('public/index.html')
end

# GET (/user)?/items/item_id    => slideshow
# GET (/user)?/items/item_id.md => raw Markdown file
get %r{
  (\A
  (?:/[0-9A-Za-z@._-]+)? # username can be omitted
  /items
  /[0-9a-z]{20}
  (\.md)?
  \z)
}x do |path, has_ext|
  if has_ext
    response_with_md_at_path(path)
  else
    send_file('public/index.html')
  end
end
