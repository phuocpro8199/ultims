use crate::{
    base::{errors::AppError, response::ApiResponse}, 
    models::product::{Product, ProductInput, ProductQueryInput, ProductResponse},
    utils::{db::get_collection, jwt::validate_token},
};
use actix_web::{
    web::{Data, Json, Path, Query},
    HttpRequest, HttpResponse,
    delete, get, post, put, 
};
use futures::StreamExt;
use mongodb::{bson::{doc, oid::ObjectId}, Client, Collection};
use validator::Validate;
use log; 
use chrono::Utc;

#[utoipa::path(
    post,
    path = "/api/products", 
    request_body = ProductInput,
    responses(
        (status = 200, description = "Product created successfully", body = ProductResponse),
        (status = 400, description = "Validation Error / Invalid Input"),
        (status = 401, description = "Unauthorized"),
        (status = 500, description = "Internal server error")
    ),
    security(
        ("bearer_auth" = [])
    ),
    tag = "Products"
)]
#[post("/products")] 
pub async fn create_product(
    client: Data<Client>,
    req: HttpRequest,
    product_input: Json<ProductInput>,
) -> Result<HttpResponse, AppError> {
    // Validate the input struct
    product_input.validate()?;

    let user_id_str = validate_token(&req)?;
    let user_object_id = ObjectId::parse_str(&user_id_str).map_err(|_| AppError::internal("Invalid user ID format in token"))?;

    // Create the full Product model for DB insertion
    let new_product = Product {
        id: None, // ID is generated by DB
        name: product_input.name.clone(),
        price: product_input.price,
        description: product_input.description.clone(),
        created_by: user_object_id,
        created_at: chrono::Utc::now(),
        updated_at: chrono::Utc::now(),
    };

    let collection = get_collection::<Product>(&client, "products");
    let result = collection.insert_one(new_product).await?;

    // Retrieve the full product to return its response form
    let inserted_product: Product = collection
        .find_one(doc! {"_id": result.inserted_id})
        .await?
        .ok_or(AppError::internal("Product not found after insertion"))?;

    // Return ProductResponse
    Ok(HttpResponse::Ok().json(inserted_product.to_response()))
}

#[utoipa::path(
    get,
    path = "/api/products", // Updated path
    params(
        ("name" = String, Query, description = "Product name"),
        ("page" = u32, Query, description = "Page number"),
        ("limit" = u32, Query, description = "Number of items per page"),
    ),
    responses(
        (status = 200, description = "List of products", body = ApiResponse<Vec<ProductResponse>>),
        (status = 500, description = "Internal server error")
    ),
    tag = "Products"
)]
#[get("/products")] 
pub async fn get_products(client: Data<Client>, query: Query<ProductQueryInput>) -> Result<HttpResponse, AppError> {
    let collection: Collection<Product> = get_collection::<Product>(&client, "products");
    
    let filter = if let Some(name) = &query.name {
        doc! {"name": {"$regex": name, "$options": "i"}}
    } else {
        doc! {}
    };

    let limit = query.limit.unwrap_or(10) as i64; // Default limit to 10 if not provided
    let skip = ((query.page.unwrap_or(1) - 1) * limit) as u64; // Calculate skip based on page and limit
    let mut cursor = collection.find(filter).limit(limit)
        .skip(skip).await?;
    let mut products_response: Vec<ProductResponse> = Vec::new();
    
    while let Some(result) = cursor.next().await {
        match result {
            Ok(product) => {
                products_response.push(product.to_response());
            },
            Err(e) => {
                log::error!("{}", e);
                break; // Exit the loop if an error occurs
            },
        }
    }
    log::info!("Fetching products from DB {:#?}", products_response);

    Ok(HttpResponse::Ok().json(products_response))
}

#[utoipa::path(
    get,
    path = "/api/products/{id}", // Updated path
    params(
        ("id" = String, Path, description = "Product ID"),
        ("name" = String, description = "Product name"),
    ),
    responses(
        (status = 200, description = "Product details", body = ProductResponse),
        (status = 400, description = "Invalid product ID format"),
        (status = 404, description = "Product not found"),
        (status = 500, description = "Internal server error")
    ),
    tag = "Products"
)]
#[get("/products/{id}")] 
pub async fn get_product(
    client: Data<Client>,
    id: Path<String>,
) -> Result<HttpResponse, AppError> {
    // Use into_inner() for Path and handle parse error
    let oid = ObjectId::parse_str(&id.into_inner()).map_err(|_| AppError::bad_request("Invalid product ID format"))?;
    let collection = get_collection::<Product>(&client, "products");
    let product = collection
        .find_one(doc! {"_id": oid})
        .await?
        .ok_or(AppError::not_found("Product not found"))?; // Use specific error

    Ok(HttpResponse::Ok().json(product.to_response()))
}

#[utoipa::path(
    put,
    path = "/api/products/{id}", 
    params(
        ("id" = String, Path, description = "Product ID")
    ),
    request_body = ProductInput,
    responses(
        (status = 200, description = "Product updated successfully", body = ProductResponse),
        (status = 400, description = "Validation Error / Invalid ID format"),
        (status = 401, description = "Unauthorized"),
        (status = 403, description = "Forbidden - Not owner"),
        (status = 404, description = "Product not found"),
        (status = 500, description = "Internal server error")
    ),
    security(
        ("bearer_auth" = [])
    ),
    tag = "Products"
)]
#[put("/products/{id}")] 
pub async fn update_product(
    client: Data<Client>,
    req: HttpRequest,
    id: Path<String>,
    product_input: Json<ProductInput>,
) -> Result<HttpResponse, AppError> {
    // Validate the input struct
    product_input.validate()?;

    let user_id_str = validate_token(&req)?;
    // Use into_inner() for Path and handle parse error
    let oid:ObjectId = ObjectId::parse_str(&id.into_inner()).map_err(|_| AppError::bad_request("Invalid product ID format"))?;
    let user_object_id:ObjectId = ObjectId::parse_str(&user_id_str).map_err(|_| AppError::internal("Invalid user ID format in token"))?;

    let collection: Collection<Product> = get_collection::<Product>(&client, "products");

    // Find the product first to check ownership
    let existing_product = collection
        .find_one(doc! {"_id": oid})
        .await?
        .ok_or(AppError::not_found("Product not found"))?;

    log::info!("{:?}", existing_product);

    // Compare ObjectIds for ownership
    if existing_product.created_by != user_object_id {
        return Err(AppError::forbidden("You can only update your own products"));
    }

    // Prepare update document
    let update = doc! {
        "$set": {
            "name": &product_input.name, // Use input directly
            "price": product_input.price,
            "description": &product_input.description,
            "updated_at": Utc::now().to_rfc3339(),
        }
    };

    // Perform the update, filter by ID only (ownership already checked)
    let update_result = collection
        .update_one(doc! {"_id": oid /* removed created_by check here */ }, update)
        .await?;

    if update_result.matched_count == 0 {
         // Should not happen if find_one succeeded, but good practice
         return Err(AppError::not_found("Product not found during update"));
    }
     if update_result.modified_count == 0 {
         // Indicates nothing changed, maybe return Ok or specific status?
         // For now, let's retrieve and return the current state.
        log::info!("Product {} data was the same, no modification needed.", oid); // <--- This line needed log
     }


    // Retrieve the updated product to return
    let updated_product = collection
        .find_one(doc! {"_id": oid})
        .await?
        .ok_or(AppError::internal("Product not found after update"))?;

    // Return ProductResponse
    Ok(HttpResponse::Ok().json(updated_product.to_response()))
}

#[utoipa::path(
    delete,
    path = "/api/products/{id}",
    params(
        ("id" = String, Path, description = "Product ID")
    ),
    responses(
        // Removed body definition for 200 to fix panic
        (status = 200, description = "Product deleted successfully"),
        (status = 400, description = "Validation Error / Invalid ID format"),
        (status = 401, description = "Unauthorized"),
        (status = 403, description = "Forbidden - Not owner"),
        (status = 404, description = "Product not found"),
        (status = 500, description = "Internal server error")
    ),
    security(
        ("bearer_auth" = [])
    ),
    tag = "Products"
)]
#[delete("/products/{id}")]
pub async fn delete_product(
    client: Data<Client>,
    req: HttpRequest,
    id: Path<String>,
) -> Result<HttpResponse, AppError> {
    let user_id_str = validate_token(&req)?;
    // Use into_inner() for Path and handle parse error
    let oid = ObjectId::parse_str(&id.into_inner()).map_err(|_| AppError::bad_request("Invalid product ID format"))?;
    let user_object_id = ObjectId::parse_str(&user_id_str).map_err(|_| AppError::internal("Invalid user ID format in token"))?;


    let collection = get_collection::<Product>(&client, "products");

    // Check ownership before deleting - find the product first
    // It's slightly less efficient but safer than deleting directly with user_id filter
    let existing_product = collection
        .find_one(doc! {"_id": oid})
        .await?
        .ok_or(AppError::not_found("Product not found"))?;

    // Compare ObjectIds for ownership
    if existing_product.created_by != user_object_id {
        return Err(AppError::forbidden("You can only delete your own products"));
    }

    // Delete query - filter by ID only, ownership confirmed above
    let delete_result = collection
        .delete_one(doc! {"_id": oid /* removed created_by check here */})
        .await?;

    if delete_result.deleted_count == 0 {
         // This case should ideally not happen if the find_one above succeeded and ownership check passed
         return Err(AppError::not_found("Product not found during delete attempt"));
    }

    // Return simple success message using ApiResponse
    Ok(HttpResponse::Ok().json(ApiResponse {
        status: "success".to_string(),
        message: "Product deleted successfully".to_string(),
        data: None::<()>, // Explicitly None of type unit
        page: None,
        limit: None,
        total: None,
        total_pages: None,
    }))
}

// This config function is used by main.rs
pub fn config(cfg: &mut actix_web::web::ServiceConfig) {
    cfg.service(create_product)
        .service(get_products)
        .service(get_product)
        .service(update_product)
        .service(delete_product); // This should work now
}
