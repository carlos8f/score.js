all: build

build:
	./node_modules/.bin/pegjs src/mus.txt.pegjs build/mus.txt.js

test: build
	
	@./node_modules/.bin/mocha --reporter spec test/*.js --timeout 10s

.PHONY: build test
