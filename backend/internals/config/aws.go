package config

import (
	"context"
	"fmt"
	"io"
	"strings"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/s3/manager"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"
	"github.com/lucsky/cuid"
)

type AWS struct {
	client   *s3.Client
	uploader *manager.Uploader
}

func NewAWS() (*AWS, error) {
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		return &AWS{}, fmt.Errorf("error loading aws config: %w", err)
	}
	client := s3.NewFromConfig(cfg)

	uploader := manager.NewUploader(client)
	return &AWS{
		client:   client,
		uploader: uploader,
	}, nil
}

func (a AWS) ListObjects(folder string) (*s3.ListObjectsV2Output, error) {
	return a.client.ListObjectsV2(context.TODO(), &s3.ListObjectsV2Input{
		Bucket: aws.String("img.valbuddy.com"),
		Prefix: aws.String(folder),
	})
}

func (a AWS) UploadFile(file io.Reader, fileName string, folder string) (string, error) {
	// Add user folder + cuid + extension
	name := folder + cuid.New()[:6] + "." + strings.SplitN(fileName, ".", 2)[1] // user/d4s454.jpg
	err := a.DeleteFolder(folder)
	if err != nil {
		return "", fmt.Errorf("error uploading file: %w", err)
	}
	_, err = a.uploader.Upload(context.TODO(), &s3.PutObjectInput{
		Bucket:      aws.String("img.valbuddy.com"),
		Key:         aws.String(name),
		Body:        file,
		ContentType: aws.String("image/jpeg;image/jpg;image/png"),
		ACL:         types.ObjectCannedACLPublicRead,
	})
	if err != nil {
		return "", fmt.Errorf("error uploading file: %w", err)
	}

	return fmt.Sprintf("https://img.valbuddy.com/%s", name), nil
}

func (a AWS) DeleteFolder(folder string) error {

	// List all objects in the folder
	listObjects, err := a.client.ListObjectsV2(context.TODO(), &s3.ListObjectsV2Input{
		Bucket: aws.String("img.valbuddy.com"),
		Prefix: aws.String(folder),
	})
	if err != nil {
		return fmt.Errorf("failed to list objects in folder %s, %v", folder, err)
	}

	// Loop through objects and delete each one
	for _, object := range listObjects.Contents {
		_, err := a.client.DeleteObject(context.TODO(), &s3.DeleteObjectInput{
			Bucket: aws.String("img.valbuddy.com"),
			Key:    object.Key,
		})
		if err != nil {
			return fmt.Errorf("failed to delete object %s, %v", *object.Key, err)
		}
	}

	return nil
}
