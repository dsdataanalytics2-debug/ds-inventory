# User Permission System Implementation

## Overview
This document outlines the comprehensive user permission system implemented for the Inventory Automation System. The system enforces role-based access control (RBAC) with fine-grained permissions to ensure data security and proper access management.

## User Roles

### 1. Viewer
- **Permissions**: Read-only access to their own data
- **Can Access**: 
  - Dashboard (own data only)
  - Own activity logs
  - Transaction history (own transactions)
- **Cannot Access**:
  - Add/Edit products
  - User management
  - Other users' data

### 2. Editor
- **Permissions**: Read/Write access to inventory, read-only to their own data
- **Can Access**:
  - All Viewer permissions
  - Add products
  - Sell products
  - Edit inventory items
- **Cannot Access**:
  - User management
  - Other users' activity logs
  - Delete operations

### 3. Admin
- **Permissions**: Full inventory management + limited user management
- **Can Access**:
  - All Editor permissions
  - View all users' activity logs
  - Create new users (Viewer, Editor, Admin roles)
  - Delete users (except Super Admins)
  - Delete inventory records
- **Cannot Access**:
  - Create Super Admin users
  - Delete Super Admin users

### 4. Super Admin
- **Permissions**: Full system access
- **Can Access**:
  - All Admin permissions
  - Create Super Admin users
  - Delete any user (except themselves)
  - Full system configuration

## Implementation Details

### 1. Authentication Utilities (`utils/auth.ts`)

#### Core Functions:
```typescript
// Role checking
hasRole(allowedRoles: string[]): boolean
canAddEdit(): boolean
canDelete(): boolean
canManageUsers(): boolean

// Enhanced permission functions
canCreateUsers(): boolean
canViewAllActivities(): boolean
canViewOwnActivities(): boolean
canAssignRoles(): boolean
canAccessUserData(targetUserId: number): boolean

// Role identification
isViewer(): boolean
isEditor(): boolean
isAdmin(): boolean
isSuperAdmin(): boolean
```

### 2. Protected Routes (`components/ProtectedRoute.tsx`)

Enforces route-level access control:
```typescript
<ProtectedRoute allowedRoles={['admin', 'superadmin']}>
  {/* Protected content */}
</ProtectedRoute>
```

### 3. Permission Guard (`components/PermissionGuard.tsx`)

Fine-grained component-level permissions:
```typescript
// Role-based
<PermissionGuard allowedRoles={['admin', 'superadmin']}>
  <AdminOnlyComponent />
</PermissionGuard>

// Function-based
<PermissionGuard requiredPermission={canCreateUsers}>
  <CreateUserButton />
</PermissionGuard>

// User-specific
<PermissionGuard userId={targetUserId}>
  <UserSpecificData />
</PermissionGuard>
```

## Security Enforcement

### 1. Activity Logs (`pages/activity.tsx`)
- **Viewers/Editors**: Can only see their own activity logs
- **Admins/Super Admins**: Can toggle between own activities and all activities
- **Client-side filtering**: Additional security layer to prevent data leakage
- **Server-side filtering**: URL parameters restrict data at API level

### 2. User Management (`pages/users.tsx`)
- **Access Control**: Only Admins and Super Admins can access
- **Role Creation Restrictions**:
  - Admins can create: Viewer, Editor, Admin
  - Super Admins can create: All roles including Super Admin
- **Deletion Restrictions**:
  - Admins cannot delete Super Admins
  - Users cannot delete themselves
  - Protected users show "Protected" badge

### 3. Navigation (`components/Navbar.tsx`)
- **Dynamic Menu**: Shows/hides links based on permissions
- **Activity Link**: Visible to all authenticated users
- **User Management**: Only visible to Admins and Super Admins
- **Add/Sell Products**: Only visible to Editors and above

## API Integration

### Required Backend Endpoints:
```
GET /activity-logs?user_id={id}  // User-specific activity logs
GET /users                       // User management (Admin+ only)
POST /register                   // Create user (Admin+ only)
DELETE /users/{id}               // Delete user (Admin+ only)
```

### Authentication Headers:
All API calls include JWT token in Authorization header:
```
Authorization: Bearer {jwt_token}
```

## Permission Matrix

| Feature | Viewer | Editor | Admin | Super Admin |
|---------|--------|--------|-------|-------------|
| View Dashboard | Own Data | Own Data | All Data | All Data |
| Add Products | ❌ | ✅ | ✅ | ✅ |
| Sell Products | ❌ | ✅ | ✅ | ✅ |
| Delete Records | ❌ | ❌ | ✅ | ✅ |
| View Own Activities | ✅ | ✅ | ✅ | ✅ |
| View All Activities | ❌ | ❌ | ✅ | ✅ |
| Create Users (V/E) | ❌ | ❌ | ✅ | ✅ |
| Create Admin Users | ❌ | ❌ | ✅ | ✅ |
| Create Super Admins | ❌ | ❌ | ❌ | ✅ |
| Delete Users | ❌ | ❌ | Limited | ✅ |
| Delete Super Admins | ❌ | ❌ | ❌ | ✅ |

## Security Best Practices

### 1. Defense in Depth
- **Route Level**: ProtectedRoute component
- **Component Level**: PermissionGuard component
- **Function Level**: Permission check functions
- **API Level**: Server-side validation (required)

### 2. Client-Side Security
- **Token Validation**: Automatic logout on 401 responses
- **Permission Caching**: User permissions cached in localStorage
- **UI Restrictions**: Hide/disable features based on permissions

### 3. Data Isolation
- **User-Specific Filtering**: Viewers/Editors see only their data
- **Admin Oversight**: Admins can view all data for management
- **Audit Trail**: All actions logged with user attribution

## Usage Examples

### 1. Protecting a Component
```typescript
import PermissionGuard from '../components/PermissionGuard';
import { canCreateUsers } from '../utils/auth';

<PermissionGuard requiredPermission={canCreateUsers}>
  <CreateUserForm />
</PermissionGuard>
```

### 2. Conditional Rendering
```typescript
import { canViewAllActivities } from '../utils/auth';

{canViewAllActivities() && (
  <AdminActivityPanel />
)}
```

### 3. User-Specific Content
```typescript
<PermissionGuard userId={targetUserId} fallback={<AccessDenied />}>
  <UserProfile user={targetUser} />
</PermissionGuard>
```

## Testing Scenarios

### 1. Viewer Account
- ✅ Can view dashboard with own data
- ✅ Can view own activity logs
- ❌ Cannot see Add/Sell Product links
- ❌ Cannot access user management
- ❌ Cannot see other users' activities

### 2. Editor Account
- ✅ All Viewer permissions
- ✅ Can add and sell products
- ✅ Can see Add/Sell Product links
- ❌ Cannot access user management
- ❌ Cannot delete records

### 3. Admin Account
- ✅ All Editor permissions
- ✅ Can access user management
- ✅ Can create Viewer/Editor/Admin users
- ✅ Can view all activity logs
- ❌ Cannot create Super Admin users
- ❌ Cannot delete Super Admin users

### 4. Super Admin Account
- ✅ Full system access
- ✅ Can create any user type
- ✅ Can delete any user (except self)
- ✅ Can perform all operations

## Troubleshooting

### Common Issues:
1. **Permission Denied**: Check user role and required permissions
2. **Missing Navigation**: Verify permission functions in navbar
3. **Data Not Loading**: Check API endpoint permissions
4. **Unauthorized Access**: Verify JWT token validity

### Debug Tools:
```typescript
// Check current user permissions
console.log('User:', getUser());
console.log('Can Create Users:', canCreateUsers());
console.log('Can View All Activities:', canViewAllActivities());
```

This permission system ensures secure, role-based access control while maintaining a smooth user experience for authorized operations.
