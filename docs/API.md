# API Reference

## Public Endpoints
| Method | Endpoint | Description |
| POST | /api/contact | Submit contact form |
| GET | /api/projects | Get all projects |
| GET | /api/skills | Get all skills |
| GET | /api/about | Get about info |
| GET | /api/visitor | Get visitor count |

## Admin Endpoints (require token)
| Method | Endpoint | Description |
| POST | /api/admin/projects | Create project |
| PUT | /api/admin/projects/:id | Update project |
| DELETE | /api/admin/projects/:id | Delete project |
