# SendGrid 電子郵件系統設置指南

## 1. 環境變數配置

請在您的 `.env` 檔案中添加以下環境變數：

```bash
# SendGrid 電子郵件配置
SENDGRID_API_KEY=YOUR_SENDGRID_API_KEY_HERE
SENDGRID_DEFAULT_FROM=noreply@yourwebsite.com
SENDGRID_DEFAULT_REPLY_TO=support@yourwebsite.com
```

## 2. 獲取 SendGrid API 金鑰

1. 前往 [SendGrid 官網](https://sendgrid.com/) 註冊帳號
2. 登入後前往 Settings > API Keys
3. 點擊 "Create API Key"
4. 選擇 "Full Access" 或自定義權限（至少需要 Mail Send 權限）
5. 複製生成的 API 金鑰到 `.env` 檔案

## 3. 電子郵件地址驗證

**重要**：在 SendGrid 中，您只能從已驗證的電子郵件地址發送郵件。

1. 前往 SendGrid > Settings > Sender Authentication
2. 驗證您的寄件者電子郵件地址
3. 如果您有網域，建議設置 Domain Authentication

## 4. Strapi 管理面板配置

啟動 Strapi 後，請進行以下配置：

### 4.1 啟用電子郵件確認
1. 前往 Settings > Users & Permissions plugin > Advanced Settings
2. 開啟 "Enable email confirmation"
3. 設置確認後重定向 URL（例如：`http://localhost:3000/email-confirmed`）

### 4.2 設置忘記密碼重定向
1. 在同一頁面設置 "Reset password page"
2. 設置為：`http://localhost:3000/reset-password`

### 4.3 更新電子郵件模板
1. 前往 Settings > Users & Permissions plugin > Email templates
2. 編輯 "Email address confirmation" 和 "Reset password" 模板
3. **重要**：將預設的寄件者電子郵件 `no-reply@strapi.io` 改為您在 SendGrid 中驗證的電子郵件地址

## 5. 測試電子郵件功能

1. 重啟 Strapi 開發伺服器
2. 前往 Settings > Email plugin > Configuration
3. 確認提供商顯示為 "sendgrid"
4. 您可以在此頁面測試發送電子郵件（注意：在開發模式下可能無法正常工作）

## 6. 忘記密碼 API 端點

配置完成後，您可以使用以下 API 端點：

```javascript
// 請求重設密碼
POST http://localhost:1337/api/auth/forgot-password
{
  "email": "user@example.com"
}

// 重設密碼
POST http://localhost:1337/api/auth/reset-password
{
  "code": "從電子郵件中獲取的代碼",
  "password": "新密碼",
  "passwordConfirmation": "確認新密碼"
}
```

## 7. 前端整合建議

建議創建以下頁面：
- 忘記密碼請求頁面：讓用戶輸入電子郵件
- 重設密碼頁面：讓用戶輸入新密碼
- 確認頁面：顯示操作成功訊息

## 8. 安全注意事項

1. 確保 `.env` 檔案不會被提交到版本控制系統
2. 在生產環境中使用 HTTPS
3. 設置適當的 CORS 政策
4. 考慮添加速率限制以防止濫用

## 9. 常見問題排除

### 問題：電子郵件沒有發送
- 檢查 SendGrid API 金鑰是否正確
- 確認寄件者電子郵件已在 SendGrid 中驗證
- 檢查電子郵件模板中的寄件者地址

### 問題：收到 400 錯誤
- 檢查請求的 JSON 格式是否正確
- 確認用戶電子郵件存在於資料庫中
- 檢查 Strapi 控制台的錯誤訊息

### 問題：重設密碼連結無效
- 檢查重定向 URL 設置是否正確
- 確認前端路由匹配設置的 URL
- 檢查 code 參數是否正確傳遞 
