all: build

build:
	./node_modules/.bin/pegjs parser.pegjs

test: build
	
	@./node_modules/.bin/mocha --reporter spec test/*.js --timeout 10s

.PHONY: build test
