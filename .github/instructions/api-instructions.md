
---
applyTo: "api/**/*"
---

# Java API Development Guidelines

## Project Information

- **Language**: Java 23+
- **Build Tool**: Maven
- **Framework**: Spring Boot style REST API
- **Port**: 3000
- **Package**: `com.github.av2.api`

## Java Best Practices

### Code Style and Formatting

- **Indentation**: Use 4 spaces (no tabs)
- **Line Length**: Maximum 120 characters per line
- **Braces**: Always use braces for if/else/for/while blocks, even for single-line statements
- **Imports**: Organize imports alphabetically, remove unused imports
- **Naming Conventions**:
  - Classes: `PascalCase` (e.g., `ProductController`, `OrderService`)
  - Methods/Variables: `camelCase` (e.g., `findById`, `productList`)
  - Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_RETRY_COUNT`)
  - Packages: lowercase (e.g., `com.github.av2.api.controller`)

### Class Design

- **Single Responsibility**: Each class should have one clear purpose
- **Immutability**: Prefer immutable objects; use `final` for fields that don't change
- **Encapsulation**: Keep fields private, expose via getters/setters only when needed
- **Constructor Injection**: Use constructor injection for dependencies (not field injection)
- **Builder Pattern**: Use for classes with many optional parameters

```java
// Good: Constructor injection
public class ProductService {
    private final Map<Long, Product> storage;
    
    public ProductService() {
        this.storage = new ConcurrentHashMap<>();
    }
}

// Avoid: Field injection
@Autowired
private ProductService productService; // Don't do this
```

### Method Design

- **Small Methods**: Keep methods focused and under 30 lines when possible
- **Clear Names**: Method names should describe what they do (e.g., `findProductById`, not `get`)
- **Parameter Limit**: Avoid more than 3-4 parameters; use a parameter object instead
- **Return Early**: Use early returns to reduce nesting

```java
// Good: Early return
public Product findById(Long id) {
    if (id == null) {
        throw new IllegalArgumentException("ID cannot be null");
    }
    
    Product product = storage.get(id);
    if (product == null) {
        throw new EntityNotFoundException("Product not found");
    }
    
    return product;
}
```

### Exception Handling

- **Specific Exceptions**: Catch specific exceptions, not generic `Exception`
- **Custom Exceptions**: Create custom exceptions for domain-specific errors
- **Don't Swallow**: Never catch and ignore exceptions silently
- **Meaningful Messages**: Include context in exception messages

```java
// Good: Specific exception with context
if (product == null) {
    throw new EntityNotFoundException("Product with ID " + id + " not found");
}

// Avoid: Generic exception
catch (Exception e) { } // Never do this
```

### Collections and Streams

- **Use Streams**: Leverage Java Streams API for collection operations
- **Avoid Null Collections**: Return empty collections instead of null
- **Immutable Collections**: Use `List.of()`, `Map.of()` for immutable collections
- **ConcurrentHashMap**: Use for thread-safe in-memory storage

```java
// Good: Stream usage
public List<Product> findByCategory(String category) {
    return storage.values().stream()
        .filter(p -> category.equals(p.getCategory()))
        .toList();
}

// Good: Return empty list, not null
public List<Product> getProducts() {
    return new ArrayList<>(storage.values());
}
```

### Null Safety

- **Avoid Null**: Prefer `Optional<T>` for methods that may not return a value
- **Null Checks**: Validate null parameters at method entry points
- **@NonNull/@Nullable**: Use annotations to document nullability (if available)

```java
// Good: Optional usage
public Optional<Product> findByIdOptional(Long id) {
    return Optional.ofNullable(storage.get(id));
}
```

## REST API Best Practices

### Controller Design

- **Thin Controllers**: Controllers should delegate to services
- **HTTP Methods**: Use proper HTTP methods (GET, POST, PUT, DELETE)
- **Status Codes**: Return appropriate HTTP status codes
  - 200 OK: Successful GET/PUT
  - 201 Created: Successful POST
  - 204 No Content: Successful DELETE
  - 400 Bad Request: Invalid input
  - 404 Not Found: Resource doesn't exist
  - 500 Internal Server Error: Server errors

```java
@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;
    
    public ProductController(ProductService productService) {
        this.productService = productService;
    }
    
    @GetMapping
    public ResponseEntity<List<Product>> getAll() {
        return ResponseEntity.ok(productService.findAll());
    }
    
    @PostMapping
    public ResponseEntity<Product> create(@RequestBody Product product) {
        Product created = productService.save(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Product> getById(@PathVariable Long id) {
        return productService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}
```

### URL Patterns

- Use plural nouns: `/api/products`, `/api/orders`
- Use path parameters for IDs: `/api/products/{id}`
- Use query parameters for filtering: `/api/products?category=electronics`
- Use nested routes for relationships: `/api/orders/{orderId}/details`

### Request Validation

- **Validate Input**: Always validate request bodies and parameters
- **Bean Validation**: Use Jakarta validation annotations (`@NotNull`, `@NotBlank`, `@Size`)
- **Custom Validators**: Create custom validators for complex business rules

```java
public class Product {
    @NotNull(message = "Product name is required")
    @NotBlank(message = "Product name cannot be blank")
    private String name;
    
    @Min(value = 0, message = "Price must be positive")
    private Double price;
}
```

## Testing Best Practices

### Unit Testing

- **Test Coverage**: Aim for 80%+ code coverage
- **Test Naming**: Use descriptive names: `shouldReturnProductWhenIdExists`
- **AAA Pattern**: Arrange, Act, Assert
- **Mock External Dependencies**: Use mocks for external services
- **Test Edge Cases**: Test null inputs, empty collections, boundary values

```java
@Test
void shouldReturnProductWhenIdExists() {
    // Arrange
    Long productId = 1L;
    Product expected = new Product(productId, "Test Product", 99.99);
    when(productService.findById(productId)).thenReturn(Optional.of(expected));
    
    // Act
    ResponseEntity<Product> response = controller.getById(productId);
    
    // Assert
    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals(expected, response.getBody());
}

@Test
void shouldReturn404WhenProductNotFound() {
    // Arrange
    when(productService.findById(anyLong())).thenReturn(Optional.empty());
    
    // Act
    ResponseEntity<Product> response = controller.getById(999L);
    
    // Assert
    assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
}
```

### Integration Testing

- Test complete request/response cycles
- Test all HTTP methods for each endpoint
- Verify status codes and response bodies
- Test error scenarios

## Documentation

### JavaDoc

- **Public APIs**: All public classes and methods must have JavaDoc
- **Parameters**: Document all parameters with `@param`
- **Returns**: Document return values with `@return`
- **Exceptions**: Document thrown exceptions with `@throws`

```java
/**
 * Retrieves a product by its unique identifier.
 *
 * @param id the unique identifier of the product
 * @return the product if found, empty Optional otherwise
 * @throws IllegalArgumentException if id is null
 */
public Optional<Product> findById(Long id) {
    if (id == null) {
        throw new IllegalArgumentException("ID cannot be null");
    }
    return Optional.ofNullable(storage.get(id));
}
```

### OpenAPI/Swagger

- Annotate controllers with OpenAPI annotations
- Provide example request/response bodies
- Document all possible status codes
- Keep API documentation up-to-date

## Performance and Concurrency

- **Thread Safety**: Use `ConcurrentHashMap` for shared mutable state
- **Avoid Blocking**: Don't block threads unnecessarily
- **Resource Management**: Use try-with-resources for AutoCloseable resources
- **Lazy Loading**: Load data only when needed

## Security Best Practices

- **Input Validation**: Validate and sanitize all user inputs
- **SQL Injection**: Use parameterized queries (when adding DB layer)
- **CORS**: Configure CORS properly in `WebConfig`
- **Error Messages**: Don't expose sensitive information in error messages

## Build and Run Commands

```bash
# Clean and compile
mvn clean compile

# Run tests
mvn test

# Run with coverage
mvn test jacoco:report

# Run the application
mvn spring-boot:run

# Package as JAR
mvn clean package
```

## Code Review Checklist

Before submitting code:
- [ ] Code follows naming conventions
- [ ] All public methods have JavaDoc
- [ ] Unit tests written and passing
- [ ] No unused imports or variables
- [ ] Exception handling is appropriate
- [ ] Input validation is in place
- [ ] Thread safety considered for shared state
- [ ] HTTP status codes are correct
- [ ] Code is formatted consistently
