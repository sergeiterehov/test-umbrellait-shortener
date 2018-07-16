# URL Shortener


## Instructions

* This task should be implemented in either PHP, Ruby, Python, or Javascript. 
* You can use frameworks, ORMs, template’s engines, but not ready solutions. 
* Code should be provided as a public GitHub repo. 
* README file with detailed information is required. 
* Host the application somewhere and share a working link to it.
* Use Bootstrap for styles.


## Task

* Application should have form with field where user can put valid url (validation should be done by direct call of the provided url and check HTTP response code).
* Application should generate short url. Example [here](http://domaincom/cedwdsfl).
* It should be possible to enter desired short url (another field).
* Application should validate if requested short url is not in use yet.
* Application should store original and short url pair in DB. User than can share short url with other users and once they try to access short url they should be redirected to original url.


## Extra Credit

* Application should have configuration file. logging system.
* Application should remove origin-short url pair from DB on the 15th day after its creation.
* Application should count amount of short url usage. Application should have API for short url creations.
* GitHub repo should contain a descriptive commits history