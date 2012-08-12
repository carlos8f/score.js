all: build

build:
	./node_modules/.bin/pegjs src/mus.txt.pegjs mus.txt.js

test:
	
	@./node_modules/.bin/mocha --reporter spec test/*.js

.PHONY: test
