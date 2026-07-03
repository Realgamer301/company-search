# Troubleshooting Guide

## Common Issues and Solutions

### 1. **POST 500 Internal Server Error on Login**

**Problem:** Getting 500 error when trying to login
- POST `https://...../api/auth/login` 500

**Solutions:**

**A. Database Connection Error**
- Check if MySQL is running
- Verify `.env` file has correct database credentials:
  ```
  DB_HOST=localhost
  DB_USER=root
  DB_PASSWORD=root
  DB_NAME=company_search
  ```
- Make sure database `company_search` exists
- Check MySQL user has proper permissions

**B. Missing Database Tables**
- Connect to MySQL and run the SQL setup:
  ```sql
  CREATE DATABASE company_search;
  USE company_search;
  
  CREATE TABLE users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin', 'editor', 'viewer') DEFAULT 'viewer',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE links (
      id INT PRIMARY KEY AUTO_INCREMENT,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      url VARCHAR(500) NOT NULL,
      type VARCHAR(100),
      thumbnail VARCHAR(500),
      tags TEXT,
      created_by INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id)
  );
  
  CREATE TABLE logs (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL,
      action_type VARCHAR(100),
      target_id INT,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
  );
  ```

**C. Create a test user**
```sql
INSERT INTO users (username, password, role) 
VALUES ('admin', '$2b$10$...', 'admin');
```
(Use bcrypt hashed password)

**D. Check server logs**
```bash
npm run dev
# Look for error messages in console
```

---

### 2. **GET 404 favicon.ico Error**

**Problem:** Console shows 404 error for favicon.ico

**Solution:** This is normal and harmless. The server handles it automatically now. If you want to add a favicon:

Create a `client/favicon.ico` file or add to `client/index.html`:
```html
<link rel="icon" type="image/x-icon" href="/favicon.ico">
```

---

### 3. **CORS Error**

**Problem:** 
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
- Check if frontend URL matches `origin` in `server.js`
- For local development: `http://localhost:3000`
- For production: use `APP_URL` from your environment variables
- Update `.env` if needed

---

### 4. **Database Connection Refused**

**Problem:**
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Solutions:**
- Ensure MySQL server is running:
  ```bash
  # Windows
  net start MySQL80
  
  # Mac
  brew services start mysql
  
  # Linux
  sudo systemctl start mysql
  ```
- Check MySQL is on port 3306: `DB_HOST=localhost`
- Verify credentials in `.env`

---

### 5. **Cannot Read Property 'token' of Undefined**

**Problem:** Login fails silently or token not saved

**Solution:**
- Check browser console for detailed error
- Make sure login credentials are correct
- Verify database has users table
- Check if username exists: `SELECT * FROM users WHERE username='admin';`

---

### 6. **Upload Folder Permission Error**

**Problem:** Cannot upload images/files

**Solution:**
- Ensure `client/uploads` directory exists
- Check folder permissions are writable
- Create manually if needed: `mkdir -p client/uploads`

---

### 7. **Port Already in Use**

**Problem:**
```
listen EADDRINUSE: address already in use :::3000
```

**Solution:**
- Change port in `.env`: `PORT=3001`
- Or kill existing process on port 3000:
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  
  # Mac/Linux
  lsof -i :3000
  kill -9 <PID>
  ```

---

### 8. **Token Expired Error**

**Problem:** 
```
Invalid Token
```

**Solution:**
- Clear localStorage: Open DevTools → Application → Clear Storage
- Login again
- Token expires in 7 days by default

---

### 9. **Development vs Production**

**Local Development:**
```bash
npm run dev
# Runs on http://localhost:3000
```

**Production (Railway):**
- Environment variables must be set in Railway dashboard
- Database must be accessible from Railway servers
- Use production domain in CORS

---

## Debug Mode

Enable detailed logging by setting:
```
NODE_ENV=development
```

This will show full error messages in responses.

---

## Check Server Status

Test if server is running:
```bash
curl http://localhost:3000/
# Should show HTML of login page
```

Test API endpoint:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

---

## Still Having Issues?

1. Check server console logs
2. Check browser console (F12)
3. Check network tab for API responses
4. Verify all dependencies are installed: `npm install`
5. Restart server: `npm run dev`
6. Clear browser cache: Ctrl+Shift+Delete
