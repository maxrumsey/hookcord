When creating and/or running unit tests create a file named auth.json with the following contents:
```JSON
{
  "hook_id": "WEBHOOK_ID",
  "hook_secret": "WEBHOOK_SECRET",
  "fullLink":"https://discordapp.com/api/webhooks/WEBHOOK_ID/WEBHOOK_SECRET"
}
```
or assign these process.env vars:
```javascript
hook_id = process.env.HOOK_ID
hook_secret = process.env.HOOK_SECRET
fullLink = process.env.FULLLINK // Yes, triple 'L'
```
