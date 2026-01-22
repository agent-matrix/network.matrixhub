from fastapi import APIRouter

from app.api.routes import admin_entities, auth, catalog_export, entities

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(entities.router)
api_router.include_router(catalog_export.router)
api_router.include_router(admin_entities.router)
