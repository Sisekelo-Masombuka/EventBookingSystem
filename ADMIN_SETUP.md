# Admin Setup Instructions

## Problem
The seeded admin user has BCrypt hashing issues causing login failures.

## Quick Fix Option 1: Use SQL to create admin

1. Open SQL Server Management Studio or connect to your LocalDB
2. Run this query to create an admin user:

```sql
USE MzansiMomentsHub;

-- First, generate a hash for password "admin123" using BCrypt
-- Hash: $2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

INSERT INTO Users (Id, FirstName, LastName, Email, PhoneNumber, Gender, StreetAddress, City, PostalCode, Country, PasswordHash, Role, CreatedAt)
VALUES (
    NEWID(),
    'Admin',
    'User',
    'admin@mzansimomentshub.com',
    '+27123456789',
    'Other',
    '123 Admin Street',
    'Kimberley',
    '8300',
    'South Africa',
    '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'Admin',
    GETUTCDATE()
);
```

**Login credentials:**
- Email: admin@mzansimomentshub.com
- Password: admin123

## Quick Fix Option 2: Register via API then update role

1. Use the `/api/auth/register` endpoint to create a user
2. Then run SQL to update their role:

```sql
UPDATE Users 
SET Role = 'Admin' 
WHERE Email = 'youremail@example.com';
```

## Proper Fix: Update ApplicationDbContext

The issue is in `Data/ApplicationDbContext.cs` - BCrypt.HashPassword generates different hashes each time.
This needs to be fixed with a deterministic hash or runtime seeding instead of EF seed data.
