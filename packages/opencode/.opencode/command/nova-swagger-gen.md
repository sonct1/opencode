---
description: Generate Swagger/OpenAPI documentation
agent: build
---

Generate Swagger/OpenAPI documentation for the microservice API.

## Steps to Follow

1. **Check Swagger Setup**
   - Verify swaggo is installed: `which swag`
   - If not installed: `go install github.com/swaggo/swag/cmd/swag@latest`

2. **Verify Annotations**
   - Check that handlers have Swagger annotations
   - Verify main.go has API info comments
   - Ensure all DTOs are properly documented

3. **Generate Documentation**
   ```bash
   make swagger
   ```
   Or directly:
   ```bash
   swag init -g cmd/server/main.go -o api --parseDependency --parseInternal
   ```

4. **Verify Generated Files**
   - Check `api/docs.go` was created/updated
   - Check `api/swagger.json` exists
   - Check `api/swagger.yaml` exists

5. **Validate Documentation**
   - Parse swagger.json for errors
   - Check all endpoints are documented
   - Verify schemas are complete
   - Validate endpoint descriptions and parameters

6. **Document All Endpoints**
   - Ensure every handler has complete Swagger annotations
   - Document all request/response models
   - Add proper tags for grouping
   - Include example values where applicable

7. **Show Documentation Summary**
   - List all documented endpoints
   - Show number of schemas
   - Display API version and description

## Required Main.go Annotations

```go
// @title           {Service Name} API
// @version         1.0
// @description     {Service Description}
// @termsOfService  http://swagger.io/terms/

// @contact.name   API Support
// @contact.url    http://www.swagger.io/support
// @contact.email  support@swagger.io

// @license.name  Apache 2.0
// @license.url   http://www.apache.org/licenses/LICENSE-2.0.html

// @host      localhost:8080
// @BasePath  /api

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
// @description Type "Bearer" followed by a space and JWT token.
```

## Handler Annotation Example

```go
// Public API Example (no authentication)
// @Summary      Get public data
// @Description  Get publicly available data
// @Tags         public
// @Accept       json
// @Produce      json
// @Param        limit query int false "Limit results" default(10)
// @Success      200 {object} DataResponse
// @Failure      400 {object} ErrorResponse
// @Router       /public/v1/data [get]

// Tenant API Example (requires authentication)
// @Summary      Create user
// @Description  Create a new user account
// @Tags         users
// @Accept       json
// @Produce      json
// @Param        request body CreateUserRequest true "User info"
// @Success      201 {object} UserResponse
// @Failure      400 {object} ErrorResponse
// @Failure      401 {object} ErrorResponse
// @Router       /v1/users [post]
// @Security     BearerAuth

// Admin API Example (admin only)
// @Summary      Update system settings
// @Description  Update system configuration
// @Tags         admin
// @Accept       json
// @Produce      json
// @Param        request body ConfigRequest true "Config data"
// @Success      200 {object} ConfigResponse
// @Failure      401 {object} ErrorResponse
// @Failure      403 {object} ErrorResponse
// @Router       /admin/v1/settings [put]
// @Security     BearerAuth

// Internal API Example (service-to-service)
// @Summary      Health check
// @Description  Service health status
// @Tags         internal
// @Produce      json
// @Success      200 {object} HealthResponse
// @Router       /internal/v1/health [get]
```

## API Route Patterns

Based on your StandardAPIRoutes configuration, use these base paths:

- **Public API**: `/api/public/v1/*` - Publicly accessible endpoints
- **Tenant API**: `/api/v1/*` - Tenant-scoped endpoints (main business logic)
- **Admin API**: `/api/admin/v1/*` - Administrative endpoints
- **Internal API**: `/api/internal/v1/*` - Internal service communication

## Endpoint Documentation Checklist

For each endpoint, ensure you include:

### Required Annotations:
- **@Summary**: Brief description (1 line)
- **@Description**: Detailed explanation of functionality
- **@Tags**: Group endpoints logically
- **@Accept**: Content-Type for request (usually `json`)
- **@Produce**: Content-Type for response (usually `json`)
- **@Router**: Full path and HTTP method

### Parameters:
- **@Param**: Document all parameters (path, query, body, header)
  - Include parameter type, required/optional status
  - Add examples and validation rules
  - Use proper formats (uuid, date-time, etc.)

### Responses:
- **@Success**: All successful response codes with models
- **@Failure**: All possible error codes with error models
- Include meaningful descriptions for each response

### Security:
- **@Security**: Specify authentication requirements
- Use consistent security scheme names

### Best Practices:
- Use descriptive error messages
- Include validation rules in parameter descriptions
- Add examples for complex request/response models
- Group related endpoints with consistent tags
- Document pagination parameters for list endpoints
- Include proper HTTP status codes

## Success Criteria

✅ Swagger files generated successfully
✅ No parsing errors
✅ All endpoints documented
✅ DTOs properly referenced
✅ Security schemes defined

## Access Documentation

After generation, provide URLs:
- Swagger UI: `http://localhost:8080/swagger/index.html`
- JSON spec: `http://localhost:8080/swagger/doc.json`
- YAML spec: `http://localhost:8080/swagger/doc.yaml`

**Available API Groups:**
- Public API: `http://localhost:8080/api/public/v1/`
- Tenant API: `http://localhost:8080/api/v1/`
- Admin API: `http://localhost:8080/api/admin/v1/`
- Internal API: `http://localhost:8080/api/internal/v1/`

## Common Issues

### Import Not Found
```
Fix: Use --parseDependency flag
```

### DTO Not Recognized
```
Fix: Use --parseInternal flag and ensure proper godoc comments
```

### Circular Reference
```
Fix: Review DTO structure and use pointers where appropriate
```
