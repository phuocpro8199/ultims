use actix_web::{web, HttpResponse, Responder};
use bson::oid::ObjectId;
use mongodb::Database;
use crate::{
    base::response::ApiResponse,
    models::product::{Product, ProductInput}
};
use utoipa::IntoParams;

use crate::{base::response::ApiResponse, models::product::{Product, ProductInput}, utils::db};

#[derive(IntoParams)]
struct ProductPath {
    id: String
}

#[utoipa::path(
    post,
    path = "/products",
    request_body = ProductInput,
    responses(
        (status = 200, description = "Product created successfully", body = ApiResponse),
        (status = 401, description = "Unauthorized"),
        (status = 500, description = "Internal server error")
    ),
    tag = "products"
)]
pub async fn create_product(
    product_input: web::Json<ProductInput>,
    db: web::Data<db::Database>,
    req: actix_web::HttpRequest,
) -> impl Responder {
    let user_id = match crate::auth::get_user_id_from_token(&req) {
        Ok(id) => id,
        Err(e) => return HttpResponse::Unauthorized().json(ApiResponse {
            success: false,
            message: e.to_string(),
            data: None,
        }),
    };

    let product = Product {
        id: None,
        name: product_input.name.clone(),
        description: product_input.description.clone(),
        price: product_input.price,
        created_by: user_id,
        created_at: chrono::Utc::now(),
        updated_at: chrono::Utc::now(),
    };

    match db.create_product(&product).await {
        Ok(inserted_id) => HttpResponse::Ok().json(ApiResponse {
            status: "success".to_string(),
            message: "Product created successfully".to_string(),
            data: None
        })
    }
}

#[utoipa::path(
    get,
    path = "/products",
    responses(
        (status = 200, description = "List of products", body = ApiResponse),
        (status = 500, description = "Internal server error")
    ),
    tag = "products"
)]
pub async fn get_products(db: web::Data<Database>) -> impl Responder {
    match db.get_products().await {
        Ok(products) => HttpResponse::Ok().json(ApiResponse<Product> {
            status: "success".to_string(),
            message: "Products retrieved successfully".to_string(),
            data: Some(products),
        }),
        Err(e) => HttpResponse::InternalServerError().json(ApiResponse<Product> {
            status: "error".to_string(),
            message: e.to_string(),
            data: None,
        }),
    }
}
            
#[utoipa::path(
    get,
    path = "/products/{id}",
    params(ProductPath),
    responses(
        (status = 200, description = "Product details", body = ApiResponse<Product>),
        (status = 400, description = "Invalid product ID"),
        (status = 404, description = "Product not found"),
        (status = 500, description = "Internal server error")
    ),
    tag = "products"
)]
pub async fn get_product(
    id: web::Path<String>,
    db: web::Data<db::Database>,
) -> impl Responder {
    let object_id = match ObjectId::parse_str(&id) {
        Ok(id) => id,
        Err(_) => return HttpResponse::BadRequest().json(ApiResponse {
            status: "error".to_string(),
            message: "Invalid product ID".to_string(),
            data: None,
        }),
    };

    match db.get_product(&object_id).await {
        Ok(Some(product)) => HttpResponse::Ok().json(ApiResponse {
            status: "success".to_string(),
            message: "Product retrieved successfully".to_string(),
            data: Some(product),
        }),
        Ok(None) => HttpResponse::NotFound().json(ApiResponse {
            success: false,
            message: "Product not found".to_string(),
            data: None,
        }),
        Err(e) => HttpResponse::InternalServerError().json(ApiResponse {
            success: false,
            message: e.to_string(),
            data: None,
        }),
    }
}

#[utoipa::path(
    put,
    path = "/products/{id}",
    params(ProductPath),
    request_body = ProductInput,
    responses(
        (status = 200, description = "Product updated successfully", body = ApiResponse),
        (status = 400, description = "Invalid product ID"),
        (status = 401, description = "Unauthorized"),
        (status = 404, description = "Product not found or not owned by user"),
        (status = 500, description = "Internal server error")
    ),
    tag = "products"
)]
pub async fn update_product(
    id: web::Path<String>,
    product_input: web::Json<ProductInput>,
    db: web::Data<db::Database>,
    req: actix_web::HttpRequest,
) -> impl Responder {
    let user_id = match crate::auth::get_user_id_from_token(&req) {
        Ok(id) => id,
        Err(e) => return HttpResponse::Unauthorized().json(ApiResponse {
            success: false,
            message: e.to_string(),
            data: None,
        }),
    };

    let object_id = match ObjectId::parse_str(&id) {
        Ok(id) => id,
        Err(_) => return HttpResponse::BadRequest().json(ApiResponse {
            success: false,
            message: "Invalid product ID".to_string(),
            data: None,
        }),
    };

    match db.update_product(&object_id, &user_id, &product_input).await {
        Ok(true) => HttpResponse::Ok().json(ApiResponse {
            success: true,
            message: "Product updated successfully".to_string(),
            data: None,
        }),
        Ok(false) => HttpResponse::NotFound().json(ApiResponse {
            success: false,
            message: "Product not found or not owned by user".to_string(),
            data: None,
        }),
        Err(e) => HttpResponse::InternalServerError().json(ApiResponse {
            success: false,
            message: e.to_string(),
            data: None,
        })
    }
}
#[utoipa::path(
    delete,
    path = "/products/{id}",
    params(ProductPath),
    responses(
        (status = 200, description = "Product deleted successfully", body = ApiResponse),
        (status = 400, description = "Invalid product ID"),
        (status = 401, description = "Unauthorized"),
        (status = 404, description = "Product not found or not owned by user"),
        (status = 500, description = "Internal server error")
    ),
    tag = "products"
)]
pub async fn delete_product(
    id: web::Path<String>,
    db: web::Data<db::Database>,
    req: actix_web::HttpRequest,
) -> impl Responder {
    let user_id = match crate::auth::get_user_id_from_token(&req) {
        Ok(id) => id,
        Err(e) => return HttpResponse::Unauthorized().json(ApiResponse {
            status: "error".to_string(),
            message: e.to_string(),
            data: None,
        }),
    };

    let object_id = match ObjectId::parse_str(&id) {
        Ok(id) => id,
        Err(_) => return HttpResponse::BadRequest().json(ApiResponse {
            status: "error".to_string(),
            message: "Invalid product ID".to_string(),
            data: None,
        }),
    };

    match db.delete_product(&object_id, &user_id).await {
        Ok(true) => HttpResponse::Ok().json(ApiResponse {
            success: true,
            message: "Product deleted successfully".to_string(),
            data: None,
        }),
        Ok(false) => HttpResponse::NotFound().json(ApiResponse {
            success: false,
            message: "Product not found or not owned by user".to_string(),
            data: None,
        }),
        Err(e) => HttpResponse::InternalServerError().json(ApiResponse {
            success: false,
            message: e.to_string(),
            data: None,
        }),
    }
}

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/products")
            .route("", web::post().to(create_product))
            .route("", web::get().to(get_products))
            .route("/{id}", web::get().to(get_product))
            .route("/{id}", web::put().to(update_product))
            .route("/{id}", web::delete().to(delete_product))
    );
}
