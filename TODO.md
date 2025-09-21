# Authentication Fix - Separate Login and Signup

## Problem
Current login endpoint creates new users instead of authenticating existing ones, causing "admin with same email exists" error.

## Plan Implementation Steps

### Backend Changes
- [ ] Fix `/api/admin/login` endpoint to authenticate existing users
- [ ] Create `/api/admin/signup` endpoint for new user registration
- [ ] Add proper error handling for both endpoints

### Frontend Changes
- [ ] Update LoginForm.tsx to support both login and signup modes
- [ ] Add toggle between login and signup functionality
- [ ] Update form submission logic for both modes

### Testing
- [ ] Test login with existing user
- [ ] Test signup with new user
- [ ] Test error scenarios
