# Node.js API to get the full package dependency tree based on a given package

The API uses https://registry.npmjs.org/ API to get direct dependencies for a package.  
Then dependencies for the package dependencies are fetched and so on... so that nested dependency tree is formed.  
API requests are efficiently cached in graph data structure to avoid recurring requests.  
Errors, warnings and useful information is logged in logs/app.log file.  
The code has some TODO comments in the form: // TODO ...  
These comments represent the next steps of the API development.  

For example, the following API request

	http://localhost:3000/packages/body-parser/1.19.0/dependencies/all
	
would return the following JSON

```json
{
  "body-parser@1.19.0": {
    "bytes@3.1.0": {},
    "content-type@~1.0.4": {},
    "debug@2.6.9": {
      "ms@2.0.0": {}
    },
    "depd@~1.1.2": {},
    "http-errors@1.7.2": {
      "depd@~1.1.2": {},
      "inherits@2.0.3": {},
      "setprototypeof@1.1.1": {},
      "statuses@>= 1.5.0 < 2": {},
      "toidentifier@1.0.0": {}
    },
    "iconv-lite@0.4.24": {
      "safer-buffer@>= 2.1.2 < 3": {}
    },
    "on-finished@~2.3.0": {},
    "qs@6.7.0": {},
    "raw-body@2.4.0": {
      "bytes@3.1.0": {},
      "http-errors@1.7.2": {
        "depd@~1.1.2": {},
        "inherits@2.0.3": {},
        "setprototypeof@1.1.1": {},
        "statuses@>= 1.5.0 < 2": {},
        "toidentifier@1.0.0": {}
      },
      "iconv-lite@0.4.24": {
        "safer-buffer@>= 2.1.2 < 3": {}
      },
      "unpipe@1.0.0": {}
    },
    "type-is@~1.6.17": {}
  }
}
```

## Libraries used

* express
* lodash
* morgan
* winston
* jest

## To install

	cd FOLDER_NAME
    npm install
	
## To run

	npm start
	
## API request template

	http://localhost:3000/packages/:name/:version/dependencies/all
	
## API request example

	http://localhost:3000/packages/body-parser/1.19.0/dependencies/all
	
## To test

	npm test
