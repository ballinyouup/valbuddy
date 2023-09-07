package config

import (
	"context"
	"fmt"
	"mime/multipart"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/s3/manager"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

var cfg aws.Config
var client *s3.Client
var uploader *manager.Uploader

func AWSInit() error {
	var err error
	cfg, err = config.LoadDefaultConfig(context.TODO())
	if err != nil {
		return fmt.Errorf("error loading aws config: %w", err)
	}
	client = s3.NewFromConfig(cfg)

	uploader = manager.NewUploader(client)
	return nil
}

func UploadFile(file multipart.File, fileName string) (string, error) {
	result, err := uploader.Upload(context.TODO(), &s3.PutObjectInput{
		Bucket: aws.String("valbuddy-images"),
		Key:    aws.String(fileName),
		Body:   file,
		ACL:    "public-read",
	})
	if err != nil {
		return "", fmt.Errorf("error uploading file: %w", err)
	}
	return result.Location, nil
}
