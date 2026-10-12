all: build

preview:
	npm start

build:
	rm -rf _site
	npm run build
