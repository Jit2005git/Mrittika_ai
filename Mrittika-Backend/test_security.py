from app.utils.security import (
    hash_password,
    verify_password
)


password = "hello123"


hashed = hash_password(password)

print("Original password:")
print(password)

print("\nHashed password:")
print(hashed)

print("\nCorrect password:")
print(
    verify_password(
        password,
        hashed
    )
)

print("\nWrong password:")
print(
    verify_password(
        "wrong123",
        hashed
    )
)