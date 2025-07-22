package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"

	"json-response-generator/internal/models"
)

// ErrorHandler middleware for handling errors
func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		// Handle any errors that occurred during request processing
		if len(c.Errors) > 0 {
			err := c.Errors.Last()
			
			logrus.WithFields(logrus.Fields{
				"method": c.Request.Method,
				"path":   c.Request.URL.Path,
				"error":  err.Error(),
			}).Error("Request error")

			// Determine status code
			statusCode := http.StatusInternalServerError
			if c.Writer.Status() != http.StatusOK {
				statusCode = c.Writer.Status()
			}

			// Return error response
			c.JSON(statusCode, models.ApiResponse{
				Success: false,
				Error:   err.Error(),
			})
		}
	}
}

// HandleError is a helper function to handle errors in handlers
func HandleError(c *gin.Context, statusCode int, message string, err error) {
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"method": c.Request.Method,
			"path":   c.Request.URL.Path,
			"error":  err.Error(),
		}).Error(message)
	}

	c.JSON(statusCode, models.ApiResponse{
		Success: false,
		Error:   message,
	})
}

// HandleSuccess is a helper function to handle successful responses
func HandleSuccess(c *gin.Context, data interface{}, message ...string) {
	response := models.ApiResponse{
		Success: true,
		Data:    data,
	}

	if len(message) > 0 {
		response.Message = message[0]
	}

	c.JSON(http.StatusOK, response)
}
