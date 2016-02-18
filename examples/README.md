# Finger Server Examples

This folder contains a bunch of finger server examples.

## Prerequisites

In order to run them do the following first:

1. Clone the repo `git clone https://github.com/spoike/fingerer.git`
2. Install dependencies `cd fingerer && npm install`

## Running the Finger Server Examples

You can run the scripts with Node, do note however that you will need to
do so with elevated permissions:

```
$ sudo node examples/simple.js
```

Depending on your installation, such as nvm on Ubuntu, Node might not be
in the superuser's PATH. Hence you need to put the path in when envoking the
script:

```
$ sudo env PATH=$PATH:$NVM_BIN node examples/simple.js
```

`fingerer` uses `debug` and is namespaced accordingly. In order to get debug
output, use DEBUG environment variable:

```
$ sudo DEBUG=fingerer* node examples/simple.js
```

## Using the Finger Server

You can use a finger server in two ways: either with a finger or telnet client.

### Using finger client

The finger client is straight-forward. Invoke with the `command@host` syntax.

```
$ finger dude@127.0.0.1
[127.0.0.1]
I'm on path dude!
```

### Using telnet client

According to [section 2.3 in RFC for the finger protocol](http://tools.ietf.org/html/rfc1288#section-2.3)
finger servers takes one query as command (in ASCII) until there is a new line
(`<CRLF>`).

So open up telnet with the specific host and port and type in a command as usual.

```
$ telnet 127.0.0.1 79
Trying 127.0.0.1...
Connected to 127.0.0.1.
Escape character is '^]'.
dude
I'm on path dude!Connection closed by foreign host.
```
