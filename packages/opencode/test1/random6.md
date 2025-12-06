# Lập Trình TypeScript

TypeScript làm cho JavaScript mạnh mẽ hơn.

## Tại sao dùng TypeScript?

- Kiểm tra kiểu tĩnh
- IntelliSense tốt hơn
- Dễ bảo trì code lớn
- Hỗ trợ OOP

## Cú pháp cơ bản

```typescript
interface User {
  name: string
  age: number
}

function greet(user: User): string {
  return `Hello ${user.name}`
}
```

## Best Practices

- Luôn định nghĩa interface
- Sử dụng enum thay cho magic strings
- Tránh dùng any type
- Enable strict mode

Happy coding! 🚀
