# 🚀 立即完成 SendGrid 設置 - 快速指南

## 第一步：設置 .env 檔案

在您的專案根目錄創建或編輯 `.env` 檔案：

```bash
# 替換 "yourverifieddomain.com" 為您在 SendGrid 中驗證的實際域名
SENDGRID_API_KEY=您的實際API金鑰
SENDGRID_DEFAULT_FROM=noreply@yourverifieddomain.com
SENDGRID_DEFAULT_REPLY_TO=support@yourverifieddomain.com
```

## 第二步：在當前頁面更新電子郵件設置

在您目前看到的 Email Configuration 頁面：

1. **Default sender email** 欄位：
   ```
   改為：您的網站名稱 <noreply@yourverifieddomain.com>
   ```

2. **Default response email** 欄位：
   ```
   設置為：support@yourverifieddomain.com
   ```

## 第三步：導航到 Users & Permissions 設置

### 導航路徑：
```
Settings (左側導航欄) 
└── USERS & PERMISSIONS PLUGIN 區塊
    ├── Advanced settings  ← 設置密碼重設
    └── Email templates   ← 更新模板
```

### 在 Advanced settings 中設置：
- ✅ 勾選 **Enable email confirmation**
- **Email confirmation redirection URL**: 
  ```
  http://localhost:3000/email-confirmed
  ```
- **Reset password page**: 
  ```
  http://localhost:3000/reset-password
  ```

### 在 Email templates 中更新：

#### 編輯 "Reset password" 模板：
- **Shipper name**: `您的網站名稱`
- **Shipper email**: `noreply@yourverifieddomain.com`
- **Response email**: `support@yourverifieddomain.com`

#### 編輯 "Email address confirmation" 模板：
- **Shipper name**: `您的網站名稱`
- **Shipper email**: `noreply@yourverifieddomain.com`
- **Response email**: `support@yourverifieddomain.com`

## 第四步：重啟 Strapi

設置完成後，重啟您的 Strapi 開發伺服器：

```bash
# 在終端中按 Ctrl+C 停止，然後重新啟動
npm run develop
```

## 第五步：測試功能

### 測試忘記密碼 API：
```bash
curl -X POST http://localhost:1337/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "測試用戶的電子郵件地址"}'
```

### 確認配置成功的標誌：
1. Email plugin Configuration 頁面顯示 "sendgrid" 提供商
2. Default sender 和 response email 顯示您設置的地址
3. API 測試返回成功響應
4. 實際收到測試電子郵件

## 🐛 如果遇到問題：

### 問題：找不到 Users & Permissions 設置
- **解決方案**：確保您在 Settings 頁面而不是其他頁面
- 在左側導航欄點擊最下方的 ⚙️ Settings 圖標

### 問題：電子郵件沒有發送
- **檢查**：API 金鑰是否正確設置
- **檢查**：域名是否在 SendGrid 中成功驗證
- **檢查**：電子郵件模板中的寄件者地址是否正確

### 問題：重啟後配置丟失
- **檢查**：.env 檔案是否保存在正確的位置（專案根目錄）
- **檢查**：.env 檔案中的變數名稱是否正確

---

**🎉 完成這些步驟後，您的忘記密碼功能就可以正常工作了！** 
