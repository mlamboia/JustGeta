package main

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
)

type App struct {
	ctx context.Context
}

type Attachment struct {
	Id int
	Name string
	Filename string
	File string
}

type CollectionRequest struct {
	ID      int
	Url     string
	Method  string
	Headers string
	Body    string
	Attachments []Attachment
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) MakeRequest(collectionRequest CollectionRequest) (string, error) {
	client := &http.Client{}

	fmt.Println(collectionRequest)

	if collectionRequest.Body != "" && !json.Valid([]byte(collectionRequest.Body)) {
    return "Error: body is not a valid JSON", nil
	}

	if collectionRequest.Headers != "" && !json.Valid([]byte(collectionRequest.Headers)) {
		return "Error: headers is not a valid JSON", nil
	}

	var headers map[string]interface{}
	if collectionRequest.Headers != "" {
		if err := json.Unmarshal([]byte(collectionRequest.Headers), &headers); err != nil {
			fmt.Println("Error parsing headers:", err)
			return "Error: headers is not a valid JSON", nil
		}
	}

	request, err := http.NewRequest(collectionRequest.Method, collectionRequest.Url, nil)
	if err != nil {
		fmt.Println("Error creating request:", err)
		return "", err
	}

	var requestBody bytes.Buffer
	if len(collectionRequest.Attachments) > 0 {
		writer := multipart.NewWriter(&requestBody)
		defer writer.Close()

		for _, attachment := range collectionRequest.Attachments {
			if attachment.File == "" {
				return "File not found", nil
			}

			filePart, err := writer.CreateFormFile(attachment.Name, attachment.Filename)
			if err != nil {
				fmt.Println("Error creating form file:", err)
				return "Error creating form file:", err
			}

			fileBytes, err := base64.StdEncoding.DecodeString(attachment.File)
			if err != nil {
				fmt.Println("Error decoding binary string:", err)
				return "Error decoding binary string:", err
			}

			_, err = io.Copy(filePart, bytes.NewReader(fileBytes))
			if err != nil {
				fmt.Println("Error copying file to form file:", err)
				return "Error copying file to form file:", err
			}
		}

		var bodyMap map[string]interface{}
		if collectionRequest.Body != "" {
			if err := json.Unmarshal([]byte(collectionRequest.Body), &bodyMap); err != nil {
				fmt.Println("Error parsing body:", err)
				return "Error: body is not a valid JSON", nil
			}
		}

		for key, value := range bodyMap {
			switch v := value.(type) {
			case string, int:
				writer.WriteField(key, fmt.Sprintf("%v", v))
			default:
				fmt.Printf("Unsupported type for key %s: %T\n", key, v)
			}
		}

		writer.Close()
		request.Body = io.NopCloser(&requestBody)
		request.Header.Set("Content-Type", writer.FormDataContentType())
	} else {
		request.Body = io.NopCloser(bytes.NewBufferString(collectionRequest.Body))
	}


	for key, value := range headers {
		switch v := value.(type) {
		case string, int:
			request.Header.Set(key, fmt.Sprintf("%v", v))
		default:
			fmt.Printf("Unsupported type for key %s: %T\n", key, v)
		}
	}

	response, err := client.Do(request)
	if err != nil {
		fmt.Println("Error making request:", err)
		return "", err
	}
	defer response.Body.Close()

	bodyResponse, err := io.ReadAll(response.Body)
	if err != nil {
		fmt.Println("Error reading response body:", err)
		return "", err
	}

	jsonResponse, err := json.Marshal(bodyResponse)
	if err == nil {
		return string(bodyResponse), err
	}

	return string(jsonResponse), err
}
