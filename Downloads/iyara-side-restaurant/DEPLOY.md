# ONE-COMMAND DEPLOYMENT

## For Vercel:
1. Push to GitHub
2. Connect repo at vercel.com
3. Add environment variables in dashboard
4. Deploy automatically

## For Netlify:
```bash
npm run build
netlify deploy --prod --dir=dist
```

## Database Setup:
```bash
# Apply migration to Supabase
supabase db push
# Or use dashboard: SQL Editor → paste migration
```

## Health Check:
- [ ] Visit `/` - Should show homepage
- [ ] Visit `/?table=1` - Should auto-assign table 1
- [ ] Add item to cart - Should persist
- [ ] Test menu load - Should show items
