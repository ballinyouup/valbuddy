package config

import (
	"context"
	"fmt"
	"io"

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

func UploadFile(file io.Reader, fileName string) (string, error) {
	_, err := uploader.Upload(context.TODO(), &s3.PutObjectInput{
		Bucket:      aws.String("img.valbuddy.com"),
		Key:         aws.String(fileName),
		Body:        file,
		ContentType: aws.String("image/jpeg"),
		ACL:         "public-read",
	})
	if err != nil {
		return "", fmt.Errorf("error uploading file: %w", err)
	}

	return fmt.Sprintf("https://img.valbuddy.com/%s", fileName), nil
}

func DeleteFile(fileName string) error {
	_, err := client.DeleteObject(context.TODO(), &s3.DeleteObjectInput{
		Bucket: aws.String("img.valbuddy.com"),
		Key:    aws.String(fileName),
	})

	if err != nil {
		return fmt.Errorf("failed to delete file %s, %v", fileName, err)
	}

	return nil
}
