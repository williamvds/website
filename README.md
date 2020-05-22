# williamvds.me

Source files for my website, [williamvds.me](https://williamvds.me).

This is a static site generated with [Zola](https://getzola.org).

## Building

`$ zola build`

## Server setup

Adjust the provided `nginx.conf` with to use your own domain and root path, then
add it to the enabled sites:  
`$ ln -s $(readlink -f nginx.conf) /etc/nginx/sites-enabled/<website>`

The provided `post-receive` command will rebuild the site when changes are
pushed, which is useful when using Git to deploy changes to a live server.
Install this hook by creating a link to it within the `.git` directory:  
`$ ln -s ../../post-receive .git/hooks`
