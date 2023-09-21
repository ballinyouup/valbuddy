# VALBUDDY
## Architechture:
### Auth:
* Added OAuth from Discord and Twitch for creating and logging in users.
* Added email login with token using AWS SES to send emails.
### Go Backend:
* Used Go Fiber for my framework as well as GORM for type safe queries, and ease of use.
* Add Migrations package for database (TODO)
### Websockets(TODO):
* Real time chat for messages
## AWS:
### Lambda/Gateway
* Due to Go runtime being deprecated, I migrated to al2 runtime.
### - S3 File Uploads:
* Users can upload profile images and images are deleted in the bucket before upload, and url is added to account.
* Added img bucket subdomain and images are served from img.valbuddy.com
### - AWS SDK/CDK/SST:
* Deployed to AWS using CDK and SST to manage application settings.
### - Circle CI pipeline:
* Used CircleCI to make two separate jobs and docker images to build the go binary, next.js build, and deploy to AWS
