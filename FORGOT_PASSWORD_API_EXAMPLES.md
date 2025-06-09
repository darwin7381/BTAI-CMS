# 忘記密碼功能 API 使用範例

## 1. 請求重設密碼

當用戶忘記密碼時，可以使用此 API 端點發送重設密碼的電子郵件。

### 端點
```
POST http://localhost:1337/api/auth/forgot-password
```

### 請求範例 (JavaScript/Fetch)
```javascript
const forgotPassword = async (email) => {
  try {
    const response = await fetch('http://localhost:1337/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email
      }),
    });

    if (response.ok) {
      console.log('重設密碼郵件已發送');
      return { success: true, message: '重設密碼郵件已發送到您的信箱' };
    } else {
      const errorData = await response.json();
      console.error('錯誤:', errorData);
      return { success: false, message: errorData.error.message };
    }
  } catch (error) {
    console.error('網路錯誤:', error);
    return { success: false, message: '網路錯誤，請稍後再試' };
  }
};

// 使用範例
forgotPassword('user@example.com');
```

### cURL 範例
```bash
curl -X POST http://localhost:1337/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

### 成功回應
```json
{
  "ok": true
}
```

### 錯誤回應範例
```json
{
  "error": {
    "status": 400,
    "name": "BadRequestError",
    "message": "此電子郵件地址不存在",
    "details": {}
  }
}
```

## 2. 重設密碼

用戶點擊電子郵件中的連結後，會被重定向到重設密碼頁面，該頁面需要使用此 API。

### 端點
```
POST http://localhost:1337/api/auth/reset-password
```

### 請求範例 (JavaScript/Fetch)
```javascript
const resetPassword = async (code, password, passwordConfirmation) => {
  try {
    const response = await fetch('http://localhost:1337/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: code,
        password: password,
        passwordConfirmation: passwordConfirmation
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('密碼重設成功:', data);
      return { success: true, user: data.user, jwt: data.jwt };
    } else {
      const errorData = await response.json();
      console.error('錯誤:', errorData);
      return { success: false, message: errorData.error.message };
    }
  } catch (error) {
    console.error('網路錯誤:', error);
    return { success: false, message: '網路錯誤，請稍後再試' };
  }
};

// 使用範例（從 URL 參數獲取 code）
const urlParams = new URLSearchParams(window.location.search);
const resetCode = urlParams.get('code');
resetPassword(resetCode, 'newPassword123', 'newPassword123');
```

### cURL 範例
```bash
curl -X POST http://localhost:1337/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "code": "從郵件獲取的代碼",
    "password": "newPassword123",
    "passwordConfirmation": "newPassword123"
  }'
```

### 成功回應
```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "user123",
    "email": "user@example.com",
    "provider": "local",
    "confirmed": true,
    "blocked": false,
    "createdAt": "2025-01-10T12:00:00.000Z",
    "updatedAt": "2025-01-10T12:30:00.000Z"
  }
}
```

### 錯誤回應範例
```json
{
  "error": {
    "status": 400,
    "name": "BadRequestError",
    "message": "密碼確認不匹配",
    "details": {}
  }
}
```

## 3. React 組件範例

### 忘記密碼表單組件
```jsx
import React, { useState } from 'react';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:1337/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('重設密碼郵件已發送到您的信箱，請檢查您的電子郵件。');
        setEmail('');
      } else {
        const errorData = await response.json();
        setMessage(`錯誤: ${errorData.error.message}`);
      }
    } catch (error) {
      setMessage('發生錯誤，請稍後再試。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">電子郵件地址:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? '發送中...' : '發送重設密碼郵件'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default ForgotPasswordForm;
```

### 重設密碼表單組件
```jsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // 如果使用 Next.js

const ResetPasswordForm = () => {
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 從 URL 參數獲取重設代碼
    const urlParams = new URLSearchParams(window.location.search);
    const resetCode = urlParams.get('code');
    if (resetCode) {
      setCode(resetCode);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== passwordConfirmation) {
      setMessage('密碼確認不匹配');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:1337/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          password,
          passwordConfirmation,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage('密碼重設成功！正在重定向到登入頁面...');
        
        // 可以選擇自動登入用戶
        localStorage.setItem('jwt', data.jwt);
        
        // 重定向到登入頁面或儀表板
        setTimeout(() => {
          router.push('/login'); // 或 '/dashboard'
        }, 2000);
      } else {
        const errorData = await response.json();
        setMessage(`錯誤: ${errorData.error.message}`);
      }
    } catch (error) {
      setMessage('發生錯誤，請稍後再試。');
    } finally {
      setIsLoading(false);
    }
  };

  if (!code) {
    return <p>無效的重設連結，請重新申請重設密碼。</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="password">新密碼:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div>
        <label htmlFor="passwordConfirmation">確認新密碼:</label>
        <input
          type="password"
          id="passwordConfirmation"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? '重設中...' : '重設密碼'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default ResetPasswordForm;
```

## 4. Next.js 頁面範例

### pages/forgot-password.js
```jsx
import ForgotPasswordForm from '../components/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <div>
      <h1>忘記密碼</h1>
      <ForgotPasswordForm />
    </div>
  );
}
```

### pages/reset-password.js
```jsx
import ResetPasswordForm from '../components/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <div>
      <h1>重設密碼</h1>
      <ResetPasswordForm />
    </div>
  );
}
```

## 5. 錯誤處理

常見的錯誤情況及處理方式：

1. **電子郵件不存在** (400)
   - 顯示友善訊息：「如果該電子郵件地址在我們的系統中，您將收到重設密碼的郵件。」

2. **重設代碼無效或過期** (400)
   - 提示用戶重新申請重設密碼

3. **密碼格式不符** (400)
   - 顯示密碼要求（最少字元數等）

4. **網路錯誤** (500)
   - 顯示通用錯誤訊息並建議重試

## 6. 安全考量

1. **速率限制**: 在生產環境中實施速率限制，防止濫用
2. **驗證**: 始終驗證前端和後端的輸入
3. **HTTPS**: 在生產環境中使用 HTTPS
4. **敏感訊息**: 避免在錯誤訊息中洩露敏感資訊 
