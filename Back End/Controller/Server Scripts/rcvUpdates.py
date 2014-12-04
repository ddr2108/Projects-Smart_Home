import urllib2
import urllib
query_args = { 'RPI':'a' }
url = 'http://api.learn2crack.com/rpi/rpi_post.php'
data = urllib.urlencode(query_args)
request = urllib2.Request(url, data)
response = urllib2.urlopen(request).read()
print response