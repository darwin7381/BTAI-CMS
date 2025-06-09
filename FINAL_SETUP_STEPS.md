# 🎯 最終設置步驟 - 根據您目前的進度

## ✅ 您已完成的部分：
- 已到達正確的 Advanced settings 頁面
- SendGrid API Key 已設定
- Domain 已成功驗證

## 🚀 現在需要完成的設置：

### 步驟一：在您當前頁面設置 URL

在您目前看到的 "Advanced settings" 頁面中：

1. **Enable email confirmation**：設置為 `TRUE`
2. **Reset password page**：
   ```
   http://localhost:3000/reset-password
   ```
3. **Redirection url**：
   ```
   http://localhost:3000/email-confirmed
   ```

### 步驟二：設置環境變數

在您的專案根目錄創建或編輯 `.env` 檔案：

```bash
# 替換為您實際驗證的域名
SENDGRID_API_KEY=您的實際API金鑰
SENDGRID_DEFAULT_FROM=noreply@您驗證的域名.com
SENDGRID_DEFAULT_REPLY_TO=support@您驗證的域名.com
```

**舉例**：如果您驗證的域名是 `example.com`：
```bash
SENDGRID_DEFAULT_FROM=noreply@example.com
SENDGRID_DEFAULT_REPLY_TO=support@example.com
```

### 步驟三：更新 Email templates

1. **從左側導航欄**，點擊 `Settings`
2. **往下滾動**找到 `USERS & PERMISSIONS PLUGIN` 區塊
3. 點擊 `Email templates`
4. 點擊 **"Reset password"** 模板的編輯按鈕
5. **更新 Shipper email** 欄位：
   - 從：`no-reply@strapi.io`
   - 改為：`noreply@您驗證的域名.com`

### 步驟四：測試功能

1. 重啟您的 Strapi 服務器
2. 回到 Email Configuration 頁面
3. 點擊 "Send test email" 測試

## 🔧 如果遇到 "API key does not start with SG." 錯誤：

檢查您的 SendGrid API Key 格式：
- 正確格式應該是：`SG.xxxxxxxxx...`
- 如果不是，請重新從 SendGrid 複製正確的 API Key

## 📝 重要提醒：

- **域名驗證**：只要您的域名在 SendGrid 中驗證成功，就可以使用該域名下的任何電子郵件地址
- **URL 設置**：這些是您前端應用的頁面，您需要在前端創建對應的頁面來處理重設密碼流程
- **模板更新**：務必將 Shipper email 改為您驗證過的電子郵件地址，否則郵件無法發送 
