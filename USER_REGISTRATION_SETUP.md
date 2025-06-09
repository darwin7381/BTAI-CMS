# 🎯 用戶註冊功能設置指南

## ✅ 恭喜！您的郵件系統已經正常運作

根據終端日誌，您的測試郵件已經成功發送：
```
[2025-06-10 03:18:07.001] http: POST /email/test (641 ms) 200
```

現在讓我們完成註冊功能的設置。

## 📋 註冊功能設置檢查清單

### 1. ✅ 在 Advanced Settings 中啟用註冊功能

在您剛才的 **Advanced settings** 頁面中，確保設置：

- **Enable sign-ups**：設置為 `TRUE`
- **Enable email confirmation**：設置為 `TRUE`
- **Reset password page**：`http://localhost:3000/reset-password`
- **Redirection url**：`http://localhost:3000/email-confirmed`

### 2. ✅ 設置 Email Confirmation Template

1. 前往：`Settings → USERS & PERMISSIONS PLUGIN → Email templates`
2. 點擊 **"Email address confirmation"** 模板的編輯按鈕
3. 更新以下欄位：
   - **Shipper name**：您的網站名稱（例如：BTAI CMS）
   - **Shipper email**：`noreply@您驗證的域名.com`
   - **Response email**：`support@您驗證的域名.com`

### 3. ✅ 設置權限 - 非常重要！

前往：`Settings → Users & Permissions plugin → Roles → Public`

在 **Users-permissions** 區塊中，勾選以下權限：

**Auth 權限**：
- ✅ `register` - 允許用戶註冊
- ✅ `forgotPassword` - 允許忘記密碼
- ✅ `resetPassword` - 允許重設密碼
- ✅ `emailConfirmation` - 允許郵件確認

**User 權限**：
- ✅ `me` - 允許用戶查看自己的資料

## 🚀 完整的註冊流程

### 步驟一：用戶註冊
```javascript
// POST http://localhost:1337/api/auth/local/register
{
  "username": "testuser",
  "email": "testuser@example.com",
  "password": "testpassword123"
}
```

### 步驟二：用戶收到確認郵件
- 郵件包含確認連結
- 用戶點擊連結確認帳號

### 步驟三：帳號啟用
- 確認後用戶可以正常登入
- 如果忘記密碼，可以使用重設功能

## 🧪 測試註冊功能

### 使用 cURL 測試註冊
```bash
curl -X POST http://localhost:1337/api/auth/local/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

### 預期回應
```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "confirmed": false,
    "blocked": false
  }
}
```

## 🎨 前端整合範例

### React 註冊表單
```jsx
import React, { useState } from 'react';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:1337/api/auth/local/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage('註冊成功！請檢查您的電子郵件進行帳號確認。');
        setFormData({ username: '', email: '', password: '' });
      } else {
        const error = await response.json();
        setMessage(`註冊失敗：${error.error.message}`);
      }
    } catch (error) {
      setMessage('網路錯誤，請稍後再試');
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleRegister} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">用戶註冊</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">用戶名</label>
        <input
          type="text"
          value={formData.username}
          onChange={(e) => setFormData({...formData, username: e.target.value})}
          className="w-full p-3 border rounded-lg"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">電子郵件</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="w-full p-3 border rounded-lg"
          required
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">密碼</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          className="w-full p-3 border rounded-lg"
          required
        />
      </div>
      
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-blue-500 text-white p-3 rounded-lg disabled:opacity-50"
      >
        {loading ? '註冊中...' : '註冊'}
      </button>
      
      {message && (
        <div className={`mt-4 p-3 rounded ${message.includes('成功') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}
    </form>
  );
};

export default RegisterForm;
```

## ⚠️ 注意事項

1. **確認郵件必須點擊**：新註冊的用戶 `confirmed` 狀態為 `false`，需要點擊確認郵件才能完全啟用帳號

2. **密碼強度**：建議設置密碼強度要求

3. **速率限制**：生產環境中建議設置註冊速率限制

4. **電子郵件驗證**：確保 SendGrid 配置正確，否則確認郵件無法發送

## 🔧 疑難排解

### 如果註冊失敗：
1. 檢查 Public 角色是否有 `register` 權限
2. 確認郵件配置是否正確
3. 查看 Strapi 日誌錯誤訊息

### 如果確認郵件沒收到：
1. 檢查 Email templates 配置
2. 確認 SendGrid 寄件者郵箱設置
3. 檢查垃圾郵件資料夾

## ✅ 完成後的功能

設置完成後，您的系統將支援：
- ✅ 用戶註冊
- ✅ 郵件確認
- ✅ 忘記密碼
- ✅ 密碼重設
- ✅ 用戶登入

這就是一個完整的用戶認證系統！ 
