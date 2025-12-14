# Production Deployment Checklist

Use this checklist to ensure your Network MatrixHub deployment is production-ready.

## 🔐 Security

- [ ] All environment variables are set in Vercel dashboard (not in code)
- [ ] `SECRET_KEY` is a strong, random value (minimum 32 characters)
- [ ] `API_KEY` is set for external API access
- [ ] `APP_DEBUG` is set to `false` in production
- [ ] CORS origins are restricted to your domains only
- [ ] Database credentials are secure and not exposed
- [ ] SSL/TLS certificates are provisioned (automatic with Vercel)
- [ ] Security headers are enabled (configured in `vercel.json` and `next.config.mjs`)
- [ ] Content Security Policy (CSP) is reviewed
- [ ] No secrets or API keys are committed to git
- [ ] `.env` files are in `.gitignore`

## 🗄️ Database

- [ ] Production database is provisioned (Vercel Postgres or external)
- [ ] Database migrations are run: `uv run alembic upgrade head`
- [ ] Database connection string is set: `DATABASE_URL` or `POSTGRES_URL`
- [ ] Database has proper indexes for performance
- [ ] Database backups are configured
- [ ] Connection pooling is enabled (default with Vercel Postgres)
- [ ] Read-only access for frontend queries (recommended)

## 🌐 Domain & DNS

- [ ] Custom domain is added to Vercel project
- [ ] DNS records are configured:
  - A record: `76.76.21.21`
  - CNAME: `cname.vercel-dns.com`
- [ ] SSL certificate is issued and active
- [ ] `NEXT_PUBLIC_API_BASE_URL` matches your production domain
- [ ] `CORS_ORIGINS` includes your production domain(s)
- [ ] Domain redirects are configured (www → non-www or vice versa)

## 🚀 Deployment

- [ ] Frontend builds successfully: `cd frontend && npm run build`
- [ ] Backend requirements are up to date: `api/requirements.txt`
- [ ] `vercel.json` configuration is reviewed
- [ ] Preview deployment tested successfully
- [ ] Production deployment completed
- [ ] All routes are accessible (test `/`, `/api/health`, `/directory`)
- [ ] API endpoints return expected responses

## 📊 Monitoring & Analytics

- [ ] Google Analytics configured (optional): `NEXT_PUBLIC_GA_ID`
- [ ] Sentry error tracking configured (optional):
  - Frontend: `NEXT_PUBLIC_SENTRY_DSN`
  - Backend: `SENTRY_DSN`
- [ ] Vercel Analytics enabled (Settings → Analytics)
- [ ] Log monitoring is set up (Vercel Logs or external service)
- [ ] Uptime monitoring configured (UptimeRobot, Pingdom, etc.)
- [ ] Performance monitoring baseline established

## 🔄 CI/CD

- [ ] GitHub repository is connected to Vercel
- [ ] GitHub Actions workflows are configured (`.github/workflows/`)
- [ ] GitHub secrets are set:
  - `VERCEL_TOKEN`
  - `VERCEL_ORG_ID`
  - `VERCEL_PROJECT_ID`
- [ ] Automatic deployments are enabled:
  - Preview deployments for PRs
  - Production deployments for main branch
- [ ] Deployment notifications are configured (Slack, email, etc.)

## ⚡ Performance

- [ ] Images are optimized (Next.js Image component used)
- [ ] Static assets are cached properly
- [ ] Gzip compression is enabled (automatic with Vercel)
- [ ] Database queries are optimized (indexed, pooled)
- [ ] API response times are acceptable (<500ms)
- [ ] Lighthouse score reviewed (aim for 90+ on all metrics)
- [ ] Bundle size is optimized (check with `npm run build`)
- [ ] Code splitting is implemented (automatic with Next.js)

## 🧪 Testing

- [ ] All frontend pages load without errors
- [ ] All API endpoints return correct responses
- [ ] Form submissions work correctly
- [ ] Authentication works (if implemented)
- [ ] Database operations succeed
- [ ] Error pages (404, 500) are tested
- [ ] Mobile responsiveness verified
- [ ] Cross-browser testing completed (Chrome, Firefox, Safari, Edge)
- [ ] Load testing performed (if expecting high traffic)

## 📝 Documentation

- [ ] `README.md` is up to date
- [ ] `VERCEL_DEPLOYMENT.md` deployment guide is reviewed
- [ ] Environment variables are documented in `.env.example`
- [ ] API documentation is accessible (if enabled)
- [ ] Runbook for common issues is created
- [ ] Team members know how to access logs and metrics

## 🔔 Post-Deployment

- [ ] Test all critical user flows
- [ ] Verify analytics tracking is working
- [ ] Check error tracking is capturing issues
- [ ] Monitor performance metrics for 24 hours
- [ ] Review logs for any unexpected errors
- [ ] Announce deployment to team/users
- [ ] Document any deployment issues for next time

## 🆘 Emergency Procedures

- [ ] Rollback procedure documented
- [ ] Emergency contacts listed
- [ ] On-call schedule established (if applicable)
- [ ] Incident response plan in place
- [ ] Database backup restoration tested

## 📈 Scaling Preparation

- [ ] Current Vercel plan limits understood
- [ ] Traffic projections estimated
- [ ] Scaling strategy defined (vertical vs horizontal)
- [ ] Database scaling plan in place
- [ ] CDN strategy reviewed
- [ ] Rate limiting configured (if needed)

## ✅ Final Review

- [ ] All items above are checked and completed
- [ ] Stakeholders have reviewed and approved
- [ ] Deployment scheduled for low-traffic period
- [ ] Team members are available for monitoring
- [ ] Celebration planned for successful deployment! 🎉

---

## Notes

Use this space to document any deployment-specific notes, issues encountered, or decisions made:

```
Date: ___________
Deployed by: ___________
Version/Commit: ___________

Notes:
-
-
-

Issues encountered:
-
-

Resolutions:
-
-
```

---

## Sign-off

- [ ] Technical Lead: ___________
- [ ] DevOps Engineer: ___________
- [ ] Product Owner: ___________
- [ ] QA Lead: ___________

**Deployment Date**: ___________

**Status**: ⬜ Ready | ⬜ In Progress | ⬜ Completed | ⬜ Rolled Back
