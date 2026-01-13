# API Testing Guide - Finding Demo Credentials

## What Does "Hit Those Endpoints" Mean?

**"Hitting endpoints"** means making HTTP requests (GET, POST, etc.) to your backend API server to retrieve data. In your case, you need to:

1. **Connect to the API server** at `https://server-kl7c.onrender.com`
2. **Test various endpoint paths** to find which one returns the demo credentials
3. **Extract the demo username and password** from the API response
4. **Fill in the missing fields** in your product information list

## Your Task

You need to find the following missing information:
- ✅ Product Name: **Golden Age Club** (already have)
- ❓ Server IP: (might be in API response)
- ✅ Domain: **https://server-kl7c.onrender.com** (already have)
- ❓ API Callback URL: (might be in API response)
- ✅ Demo Site Address: **https://pghome.co** (already have)
- ❓ **Demo User Name:** (NEED TO FIND)
- ❓ **Demo Password:** (NEED TO FIND)
- ✅ Currency: **USDT** (already have)

## How to Find the Demo Credentials

### Method 1: Use the Browser Tester (Recommended)

1. Open `test-api.html` in your browser
2. Click **"🚀 Test All Endpoints"** button
3. Look through the results for any responses containing:
   - `"demo"`
   - `"username"`
   - `"password"`
   - `"credentials"`
   - `"test"`
   - `"account"`

### Method 2: Use Browser DevTools

1. Open the demo site: https://pghome.co
2. Open Browser DevTools (F12)
3. Go to the **Network** tab
4. Look for API calls - they might show you:
   - Which endpoints are being called
   - What responses contain demo credentials
   - Authentication endpoints

### Method 3: Try Common API Patterns

Try these URLs directly in your browser or with a tool like Postman:

```
GET https://server-kl7c.onrender.com/api/demo
GET https://server-kl7c.onrender.com/api/config
GET https://server-kl7c.onrender.com/api/product/config
GET https://server-kl7c.onrender.com/api/demo-credentials
GET https://server-kl7c.onrender.com/demo
GET https://server-kl7c.onrender.com/config
```

### Method 4: Check the Demo Site

1. Visit https://pghome.co
2. Look for:
   - Login page (might have demo credentials displayed)
   - Documentation section
   - Footer links to API docs
   - View page source (Ctrl+U) - sometimes credentials are in comments or config

### Method 5: Contact Backend Team

If the endpoints don't reveal the info, ask your backend team:
- "What endpoint returns demo account credentials?"
- "How do I retrieve the demo username and password for Golden Age Club?"
- "Can you provide API documentation for the product config endpoints?"

## What to Look For

When testing endpoints, look for responses like:

```json
{
  "demo": {
    "username": "demo_user",
    "password": "demo_pass"
  }
}
```

Or:

```json
{
  "product": "Golden Age Club",
  "demoUsername": "test123",
  "demoPassword": "test456",
  "callbackUrl": "https://..."
}
```

Or:

```json
{
  "config": {
    "demoAccount": {
      "username": "...",
      "password": "..."
    }
  }
}
```

## Next Steps

1. **Test the endpoints** using the HTML file I created
2. **Document what you find** - note which endpoint returns what
3. **Fill in the missing fields** in your product list
4. **Provide the completed list** to whoever requested it

## If You Can't Find It

If none of the endpoints reveal the demo credentials:

1. Check if there's API documentation (Swagger/OpenAPI docs)
2. Ask the backend developer or team lead
3. Check internal documentation or Confluence/Wiki
4. Try logging into the demo site with common demo credentials:
   - username: `demo`, password: `demo`
   - username: `test`, password: `test`
   - username: `admin`, password: `admin`

Good luck! 🚀
