# VALBUDDY
## Overview:
Valbuddy is a friend finder app to help users find friends to play with.
Problem: Users when using LFG (looking for group) discords/applications don't give any bio or info to find others with similar interests.
# Architecture:
### Frontend
* Next.js Frontend with Server Actions
* Loading states
* Responsive Design
* ShadCN UI
### Auth:
* Added OAuth from Discord and Twitch for creating and logging in users.
* Added email login with token using AWS SES to send emails.
### Go Backend:
* Go Fiber 
* GORM for type safe queries, and ease of use.
* Add Migrations package for database (TODO)
### Web sockets(TODO):
* Real time chat for messages

# AWS
### Lambda/Gateway
* Due to Go runtime being deprecated, I migrated to al2 runtime.
### S3 File Uploads:
* Users can upload profile images and images are deleted in the bucket before upload, and url is added to account.
* Added img bucket subdomain and images are served from img.valbuddy.com
### AWS SDK/CDK/SST:
* Deployed to AWS using CDK and SST to manage application settings.

### Circle CI pipeline:
* Used CircleCI to make two separate jobs and docker images to build the go binary, next.js build, and deploy to AWS

### Testing:
* Testing using Go's standard testing library
* Mocked OAuth providers
* Implemented Integration tests for entire Auth flow.
