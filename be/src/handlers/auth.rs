use crate::{
    base::errors::AppError,
    models::user::{LoginUser, User, UserResponse}, // Import UserResponse
    utils::db::get_collection,
};
use actix_web::{
    post,
    web::{Data, Json},
    HttpResponse,
};
use mongodb::{bson::doc, Client};
use validator::Validate;

#[utoipa::path(
    post,
    path = "/api/auth/register", // Updated path
    request_body = User, // Use the full User model for input here as it contains name etc.
    responses(
        (status = 200, description = "User registered successfully", body = UserResponse),
        (status = 400, description = "Validation error"),
        (status = 500, description = "Internal server error")
    ),
    tag = "Auth"
)]
#[post("/auth/register")] // Keep the Actix path relative to the scope in main.rs
pub async fn register(
    client: Data<Client>,
    user: Json<User>, // Use User model directly for input
) -> Result<HttpResponse, AppError> {
    let user = user.into_inner();
    user.validate()?; // Validate email, password rules if added to User struct

    // Check if user already exists
    let collection_check = get_collection::<User>(&client, "users");
    if collection_check.find_one(doc! {"email": &user.email}).await?.is_some() {
         return Err(AppError::bad_request("User with this email already exists"));
    }

    let mut new_user = User::new(user.email, user.password, user.name);
    new_user.hash_password()?; // Hash password before saving

    let collection_insert = get_collection::<User>(&client, "users");
    let result = collection_insert.insert_one(new_user).await?;

    // Retrieve the inserted user to get the generated ID
    let inserted_user = collection_insert
        .find_one(doc! {"_id": result.inserted_id})
        .await?
        .ok_or(AppError::internal("User not found after insertion"))?;

    let jwt_secret = std::env::var("JWT_SECRET").map_err(|_| AppError::internal("JWT_SECRET not configured"))?;
    let user_response = inserted_user.to_response(&jwt_secret)?;

    Ok(HttpResponse::Ok().json(user_response))
}

#[utoipa::path(
    post,
    path = "/api/auth/login", // Updated path
    request_body = LoginUser,
    responses(
        (status = 200, description = "Login successful", body = UserResponse),
        (status = 400, description = "Validation error"),
        (status = 401, description = "Invalid credentials"),
        (status = 500, description = "Internal server error")
    ),
    tag = "Auth"
)]
#[post("/auth/login")] // Keep the Actix path relative to the scope in main.rs
pub async fn login(
    client: Data<Client>,
    credentials: Json<LoginUser>,
) -> Result<HttpResponse, AppError> {
    let credentials = credentials.into_inner();
    credentials.validate()?;

    let collection = get_collection::<User>(&client, "users");
    let user = collection
        .find_one(doc! {"email": &credentials.email})
        .await?
        .ok_or(AppError::unauthorized("Invalid credentials"))?; // Use specific error

    if !user.verify_password(&credentials.password)? {
        return Err(AppError::unauthorized("Invalid credentials")); // Use specific error
    }

    let jwt_secret = std::env::var("JWT_SECRET").map_err(|_| AppError::internal("JWT_SECRET not configured"))?;
    let user_response = user.to_response(&jwt_secret)?;

    Ok(HttpResponse::Ok().json(user_response))
}

pub fn config(cfg: &mut actix_web::web::ServiceConfig) {
    cfg.service(register).service(login);
}

