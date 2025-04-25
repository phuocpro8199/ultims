use crate::base::errors::AppError;
use jsonwebtoken::{decode, encode, Algorithm, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use std::env;

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub exp: usize,
}

pub fn create_jwt(user_id: &str, secret: &str) -> Result<String, jsonwebtoken::errors::Error> {
    let expiration = chrono::Utc::now()
        .checked_add_signed(chrono::Duration::seconds(
            env::var("JWT_EXPIRATION")
                .unwrap_or("86400".to_string())
                .parse()
                .unwrap_or(86400),
        ))
        .expect("Invalid timestamp")
        .timestamp();

    let claims = Claims {
        sub: user_id.to_string(),
        exp: expiration as usize,
    };

    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret.as_bytes()),
    )
}

pub fn validate_token(req: &actix_web::HttpRequest) -> Result<String, AppError> {
    let token = req
        .headers()
        .get("Authorization")
        .ok_or(AppError::unauthorized("Missing authorization header"))?
        .to_str()
        .map_err(|_| AppError::unauthorized("Invalid authorization header"))?
        .split_whitespace()
        .last()
        .ok_or(AppError::unauthorized("Invalid token format"))?;

    let jwt_secret = env::var("JWT_SECRET").map_err(|_| AppError::internal("JWT_SECRET not set"))?;
    let token_data = decode::<Claims>(
        token,
        &DecodingKey::from_secret(jwt_secret.as_bytes()),
        &Validation::new(Algorithm::HS256),
    )
    .map_err(|_| AppError::unauthorized("Invalid token"))?;

    Ok(token_data.claims.sub)
}
