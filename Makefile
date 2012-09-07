all: build

build:
	./node_modules/.bin/pegjs src/score.pegjs build/score.js

test: build
	
	@./node_modules/.bin/mocha --reporter spec test/*.js --timeout 10s

.PHONY: build test
