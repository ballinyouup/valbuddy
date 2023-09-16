FROM golang:1.20 as build
WORKDIR /app
RUN go env -w GOPROXY=direct
# Build with optional lambda.norpc tag
ADD . .
RUN GOARCH=arm64 GOOS=linux CGO_ENABLED=0 go build -tags lambda.norpc -o bootstrap main.go

# Copy artifacts to a clean image
FROM public.ecr.aws/lambda/provided:al2 as runtime
COPY --from=build /app/bootstrap /var/task/bootstrap
ENTRYPOINT [ "/var/task/bootstrap" ]
