# Build stage
FROM golang:1.27-alpine AS build
WORKDIR /app
COPY go.mod ./
COPY main.go ./
RUN go build -o portfolio-api .

# Runtime stage
FROM alpine:latest
WORKDIR /app
COPY --from=build /app/portfolio-api .
EXPOSE 8080
ENV PORT=8080
ENTRYPOINT ["./portfolio-api"]
